import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import {db,products,settings,session,login,logout,orders,createOrder,updateOrder,saveProduct,saveSettings,sale,record,rateLimit,staff,addStaff,changePassword} from '@/lib/db';
import {withStorage,readMedia,writeMedia,deleteStagedMedia} from '@/lib/cloud-storage';
import {cloudStorage} from '@/lib/db-context';
import {validPhone} from '@/lib/domain';
import {publicCatalog,previewProductImport,commitProductImport,analytics,merchandising,saveMerchandising,cloneProduct,bulkProducts,previewStock,commitStock,commitSale,storeSales,returnSale} from '@/lib/operations';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const json=(data:any,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
async function handle(req:NextRequest,context:{params:Promise<{path:string[]}>}){
 try {
 const parts=(await context.params).path,endpoint=parts.join('/'),method=req.method,token=req.cookies.get('fs-session')?.value||'',user=session(token);
 if(method!=='GET'){
 const origin=req.headers.get('origin');const expectedOrigin=process.env.FASHION_PUBLIC_ORIGIN||req.nextUrl.protocol+'//'+req.headers.get('host');if(origin!==expectedOrigin)return json({error:'So‘rov manbasi noto‘g‘ri.'},403);
 if(Number(req.headers.get('content-length')||0)>26*1024*1024)return json({error:'Fayl juda katta.'},413);
 }
 if(endpoint==='catalog'&&method==='GET')return json(publicCatalog());
 if(endpoint==='session'&&method==='GET')return json({user});
 if(endpoint==='login'&&method==='POST'){const body=await req.json();if(typeof body.password!=='string'||body.password.length>200)return json({error:'Login ma’lumotini tekshiring.'},400);const t=login(String(body.username||''),body.password);const result=json({ok:true});result.cookies.set('fs-session',t,{httpOnly:true,sameSite:'strict',secure:req.nextUrl.protocol==='https:',maxAge:43200,path:'/'});return result;}
 if(endpoint==='logout'&&method==='POST'){logout(token);const result=json({ok:true});result.cookies.delete('fs-session');return result;}
 if(endpoint==='orders'&&method==='POST'){rateLimit(`order:${req.headers.get('x-forwarded-for')||'local'}`,20);const key=req.headers.get('idempotency-key');if(!key||!/^[a-zA-Z0-9-]{16,80}$/.test(key))throw Error('Buyurtma kaliti noto‘g‘ri.');return json(createOrder(await req.json(),key),201);}
 if(parts[0]==='track'&&method==='GET'){const o=orders().find(o=>o.token===parts[1]);if(!o)return json({error:'Buyurtma topilmadi.'},404);return json(o);}
 if(endpoint==='wishlist'&&method==='POST'){const input=await req.json();rateLimit('wishlist',60);const ids=Array.isArray(input.ids)?input.ids.filter((x:any)=>typeof x==='string').slice(0,100):[];const id=randomUUID();db().prepare('INSERT INTO wishlists VALUES(?,?,?)').run(id,JSON.stringify(ids),new Date().toISOString());return json({id});}
 if(endpoint==='insight'&&method==='POST'){rateLimit('insight',180);const input=await req.json();if(!['cart.add','search.empty'].includes(input.type))throw Error('Hodisa noto‘g‘ri.');const p=input.productId?products().find(p=>p.id===input.productId):null;if(input.productId&&!p)throw Error('Mahsulot topilmadi.');if(input.type==='cart.add'&&!p?.variants.some(v=>v.id===input.variantId))throw Error('Variant topilmadi.');record(input.type,{productId:p?.id,variantId:input.variantId,query:String(input.query||'').slice(0,150),isDemo:p?Boolean(p.isDemo)||/^QA|test/i.test(p.name):products().every(p=>p.isDemo||/^QA|test/i.test(p.name))});return json({ok:true});}
 if(parts[0]==='wishlist'&&method==='GET'){const row=db().prepare('SELECT payload FROM wishlists WHERE id=?').get(parts[1]) as any;return row?json({ids:JSON.parse(row.payload)}):json({error:'Tanlov topilmadi.'},404);}
 if(endpoint==='request'&&method==='POST'){rateLimit('requests',40);const input=await req.json();if(!['question','stock'].includes(input.type)||!validPhone(input.phone||'')||!input.name?.trim())throw Error('Ism va telefonni kiriting.');const p=products().find(p=>p.id===input.productId);if(!p)throw Error('Mahsulot topilmadi.');if(input.variantId&&!p.variants.some(v=>v.id===input.variantId))throw Error('Variant topilmadi.');if(input.type==='question'&&!input.message?.trim())throw Error('Savolingizni kiriting.');const id=randomUUID();db().prepare('INSERT INTO requests(id,type,payload,createdAt) VALUES(?,?,?,?)').run(id,input.type,JSON.stringify({...input,message:String(input.message||'').slice(0,2000),productName:p.name}),new Date().toISOString());record('request.created',{id,type:input.type});return json({ok:true});}
 if(endpoint==='metric'&&method==='POST'){const input=await req.json();if(!['view','favorite'].includes(input.type)||!products().some(p=>p.id===input.productId))throw Error('Noto‘g‘ri hodisa.');rateLimit('metric',120);db().prepare('INSERT INTO views(id,count,favorites) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET count=count+excluded.count,favorites=favorites+excluded.favorites').run(input.productId,input.type==='view'?1:0,input.type==='favorite'?1:0);if(input.type==='view')record('product.view',{productId:input.productId,isDemo:products().some(p=>p.id===input.productId&&(p.isDemo||/^QA|test/i.test(p.name)))});return json({ok:true});}
 if(parts[0]==='media'&&method==='GET'){
 const id=parts[1];if(!/^[a-zA-Z0-9.-]+$/.test(id))return json({error:'Fayl topilmadi.'},404);const m=db().prepare('SELECT * FROM media WHERE id=?').get(id) as any;
 if(!m||(!user&&settings().heroImage!==`/api/media/${id}`&&!merchandising().banners?.some(b=>b.image===`/api/media/${id}`)&&!products().some(p=>p.media.includes(`/api/media/${id}`)||p.video===`/api/media/${id}`)))return json({error:'Fayl topilmadi.'},404);
 const data=await readMedia(id);const range=req.headers.get('range');if((range||cloudStorage()&&data.length>3*1024*1024)&&m.mime.startsWith('video/')){const match=/^bytes=(\d+)-(\d*)$/.exec(range||'bytes=0-');if(!match)return new NextResponse(null,{status:416});const start=Number(match[1]),requestedEnd=match[2]?Math.min(Number(match[2]),data.length-1):data.length-1,end=cloudStorage()?Math.min(requestedEnd,start+3*1024*1024-1):requestedEnd;if(start>end||start>=data.length)return new NextResponse(null,{status:416});return new NextResponse(new Uint8Array(data.subarray(start,end+1)),{status:206,headers:{'Content-Type':m.mime,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Accept-Ranges':'bytes','Content-Length':String(end-start+1)}});}
 return new NextResponse(new Uint8Array(data),{headers:{'Content-Type':m.mime,'Content-Length':String(data.length),'Cache-Control':user?'private, no-store':'public, max-age=3600','Accept-Ranges':'bytes'}});
 }
 if(parts[0]!=='admin'||!user)return json({error:'Admin hisobiga kiring.'},401);
 if(endpoint==='admin/data'&&method==='GET')return json({user,realRevenue:analytics(365,false).revenue,products:products(true),settings:settings(),orders:orders(),requests:db().prepare('SELECT * FROM requests ORDER BY rowid DESC').all().map((r:any)=>({...r,payload:JSON.parse(r.payload)})),events:db().prepare('SELECT * FROM events ORDER BY rowid DESC LIMIT 150').all().map((e:any)=>({...e,payload:JSON.parse(e.payload)})),storeRevenue:Number((db().prepare("SELECT COALESCE(SUM(json_extract(payload,'$.amount')),0) AS total FROM events WHERE type='store.sale'").get() as any).total),metrics:db().prepare('SELECT * FROM views').all(),staff:user.role==='owner'?staff():[]});
 if(endpoint==='admin/analytics'&&method==='GET')return json(analytics(Number(req.nextUrl.searchParams.get('days'))||30,req.nextUrl.searchParams.get('demo')==='1'));
 if(endpoint==='admin/products'&&method==='POST')return json({id:saveProduct(await req.json(),user)});
 if(endpoint==='admin/import-preview'&&method==='POST')return json(previewProductImport(await req.json(),user));
 if(endpoint==='admin/import-commit'&&method==='POST')return json(commitProductImport(await req.json(),user));
 if(endpoint==='admin/clone'&&method==='POST')return json({id:cloneProduct((await req.json()).id,user)});
 if(endpoint==='admin/bulk'&&method==='POST')return json(bulkProducts(await req.json(),user));
 if(endpoint==='admin/stock-preview'&&method==='POST')return json(previewStock(await req.json(),user));
 if(endpoint==='admin/stock-commit'&&method==='POST')return json(commitStock(await req.json(),user));
 if(endpoint==='admin/sales'&&method==='GET')return json({sales:storeSales(),movements:db().prepare("SELECT * FROM events WHERE type LIKE 'stock.%' ORDER BY rowid DESC LIMIT 300").all().map((r:any)=>({...r,payload:JSON.parse(r.payload)}))});
 if(endpoint==='admin/return'&&method==='POST')return json(returnSale(await req.json(),user));
 if(endpoint==='admin/merchandising'&&method==='GET')return json(merchandising());
 if(endpoint==='admin/merchandising'&&method==='PUT')return json(saveMerchandising(await req.json(),user));
 if(parts[1]==='orders'&&method==='PATCH')return json(updateOrder(parts[2],await req.json(),user));
 if(endpoint==='admin/sale'&&method==='POST'){const body=await req.json();return json(commitSale(body,req.headers.get('idempotency-key')||randomUUID(),user));}
 if(endpoint==='admin/settings'&&method==='PUT')return json(saveSettings(await req.json(),user));
 if(endpoint==='admin/password'&&method==='POST'){changePassword(String((await req.json()).password||''),user);const result=json({ok:true});result.cookies.delete('fs-session');return result;}
 if(endpoint==='admin/staff'&&method==='POST'){addStaff(await req.json(),user);return json({ok:true});}
 if(parts[1]==='requests'&&method==='PATCH'){const body=await req.json();if(!['new','answered','closed'].includes(body.status))throw Error('Holat noto‘g‘ri.');db().prepare('UPDATE requests SET status=? WHERE id=?').run(body.status,parts[2]);record('request.updated',{id:parts[2],status:body.status,user:user.id});return json({ok:true});}
 if(endpoint.startsWith('admin/upload-')){
 db().exec('CREATE TABLE IF NOT EXISTS media_uploads(id TEXT PRIMARY KEY,userId TEXT,payload TEXT,expires INTEGER);');
 const chunkSize=3*1024*1024;
 if(endpoint==='admin/upload-start'&&method==='POST'){
 const body=await req.json();if(!Number.isSafeInteger(body.size)||body.size<=chunkSize||body.size>25*1024*1024)throw Error('Fayl hajmini tekshiring.');
 const id=randomUUID(),payload={name:String(body.name||'upload').slice(0,150),size:body.size,chunks:[] as number[]};
 rateLimit('upload:'+user.id,30);db().prepare('INSERT INTO media_uploads VALUES(?,?,?,?)').run(id,user.id,JSON.stringify(payload),Date.now()+30*60000);return json({id,chunkSize});
 }
 const uploadId=req.nextUrl.searchParams.get('id')||'';const row=db().prepare('SELECT * FROM media_uploads WHERE id=? AND userId=? AND expires>?').get(uploadId,user.id,Date.now()) as any;if(!row)throw Error('Yuklash muddati tugagan. Qayta yuklang.');const upload=JSON.parse(row.payload),count=Math.ceil(upload.size/chunkSize);
 if(endpoint==='admin/upload-chunk'&&method==='PUT'){
 const index=Number(req.nextUrl.searchParams.get('index'));if(!Number.isSafeInteger(index)||index<0||index>=count)throw Error('Fayl bo‘lagi noto‘g‘ri.');const buffer=Buffer.from(await req.arrayBuffer()),size=Math.min(chunkSize,upload.size-index*chunkSize);if(buffer.length!==size)throw Error('Fayl bo‘lagi hajmi noto‘g‘ri.');await writeMedia(`staged-${uploadId}-${index}`,buffer);upload.chunks=[...new Set([...upload.chunks,index])];db().prepare('UPDATE media_uploads SET payload=? WHERE id=?').run(JSON.stringify(upload),uploadId);return json({ok:true});
 }
 if(endpoint==='admin/upload-finish'&&method==='POST'){
 if(upload.chunks.length!==count)throw Error('Fayl to‘liq yuklanmagan.');const buffer=Buffer.concat(await Promise.all(Array.from({length:count},(_,i)=>readMedia(`staged-${uploadId}-${i}`))));if(buffer.length!==upload.size)throw Error('Fayl hajmi mos kelmadi.');const result=await saveUploadedMedia(buffer,upload.name,user);db().prepare('DELETE FROM media_uploads WHERE id=?').run(uploadId);await Promise.all(Array.from({length:count},(_,i)=>deleteStagedMedia(`staged-${uploadId}-${i}`)));return json(result);
 }
 return json({error:'Yuklash amali topilmadi.'},404);
 }
 if(endpoint==='admin/upload'&&method==='POST'){
 const form=await req.formData(),file=form.get('file');if(!(file instanceof File)||file.size>25*1024*1024||file.size===0)throw Error('Fayl 25 MB dan kichik va bo‘sh bo‘lmasin.');const buffer=Buffer.from(await file.arrayBuffer());
 return json(await saveUploadedMedia(buffer,file.name,user));
 }
 if(endpoint==='admin/export'&&method==='GET'&&user.role==='owner'){const all={version:1,exportedAt:new Date().toISOString(),settings:settings(),products:products(true),orders:orders(),requests:db().prepare('SELECT * FROM requests').all()};return new NextResponse(JSON.stringify(all,null,2),{headers:{'Content-Type':'application/json','Content-Disposition':'attachment; filename="fashion-export.json"','Cache-Control':'no-store'}});}
 return json({error:'Amal topilmadi.'},404);
 }catch(error){console.error(error instanceof Error?error.message:'API error');return json({error:error instanceof Error?error.message:'Amal bajarilmadi.'},400);}
}
async function saveUploadedMedia(buffer:Buffer,name:string,user:any){
 const mime=buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'image/png':buffer[0]===255&&buffer[1]===216?'image/jpeg':buffer.subarray(0,4).toString()==='RIFF'&&buffer.subarray(8,12).toString()==='WEBP'?'image/webp':buffer.subarray(4,8).toString()==='ftyp'?'video/mp4':'';
 if(!mime)throw Error('JPG, PNG, WebP yoki MP4 fayl yuklang.');
 if(cloudStorage()&&mime.startsWith('image/')&&buffer.length>4*1024*1024)throw Error('Suratni 4 MB dan kichik qilib yuklang.');
 const id=randomUUID()+({'image/png':'.png','image/jpeg':'.jpg','image/webp':'.webp','video/mp4':'.mp4'} as Record<string,string>)[mime];await writeMedia(id,buffer);db().prepare('INSERT INTO media VALUES(?,?,?)').run(id,mime,name.slice(0,150));record('media.uploaded',{id,user:user.id});return {url:`/api/media/${id}`,mime};
}
async function persistentHandle(req:NextRequest,context:{params:Promise<{path:string[]}>}){
 try{return await withStorage(()=>handle(req,context));}catch{console.error('Persistent storage request failed');return json({error:'Saqlash xizmatiga ulanib bo‘lmadi. Birozdan keyin qayta urinib ko‘ring.'},503);}
}
export {persistentHandle as GET,persistentHandle as POST,persistentHandle as PUT,persistentHandle as PATCH};
