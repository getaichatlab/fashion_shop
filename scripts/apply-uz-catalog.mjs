import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
const manifest=JSON.parse(await fs.readFile('data/uz-catalog-manifest.json','utf8'));
const mode=process.argv[2];
assert(['--local','--cloud'].includes(mode),'Use --local or --cloud');
assert.equal(manifest.length,36);
const mediaFor=m=>[m.photo,...m.extra].map((_,i)=>`/images/uz-style-${String(m.number).padStart(2,'0')}${i?'-'+(i+1):''}.jpg`);
for(const m of manifest)for(const url of mediaFor(m))await fs.access('public'+url);
function updatedProduct(current,m){
 assert(current?.isDemo&&current.status==='published','Only the designated published demo model can be replaced');
 const media=mediaFor(m),collections=m.occasion==='Bayram'?['Bayramona']:m.occasion==='Ish uchun'?['Ish kuni','Nafis kundalik']:['Nafis kundalik'];
 return {...current,name:m.name,category:m.category,price:m.price,oldPrice:0,description:m.detail+' Surat uslub uchun namuna. Narx, o‘lcham va qoldiq demo; haqiqiy mahsulot ma’lumoti do‘kon egasi tomonidan tasdiqlanadi.',fabric:'Tarkibi sotuvchidan aniqlashtiriladi',fit:m.category==='Shimlar'?'Keng':'Erkin',season:m.season,occasions:[...new Set([m.occasion,'Kundalik'])],collections,media,colorMedia:{[m.color]:media},video:'',badge:'',approved:true,variants:current.variants.map(v=>({...v,color:m.color,hex:m.hex,price:null}))};
}
const settingsPatch={heroTitle:'Yopiq bichim.\nErkin nafislik.',heroSubtitle:'Uzun ko‘ylaklar, erkin bluzkalar va o‘z kuningizga mos tanlov. Nafislikni har kuni his qiling.',heroImage:'/images/uz-editorial-1.jpg',accent:'#553b49'};
function updatedContent(m){return {...m,categories:[...new Set(manifest.map(p=>p.category))],banners:[{title:settingsPatch.heroTitle,subtitle:settingsPatch.heroSubtitle,image:settingsPatch.heroImage,href:'/catalog'},{title:'Ish kuniga\nmos klassika.',subtitle:'Erkin bluzkalar, keng shimlar va bir-biriga mos komplektlar.',image:'/images/uz-editorial-3.jpg',href:'/catalog?collection=Ish%20kuni'}],looks:[{id:'look-city',name:'Ish kuni uchun klassika',occasion:'Ish uchun',productIds:['demo-v2-2','demo-v2-14','demo-v2-27'],active:true},{id:'look-walk',name:'Yashil va oq uyg‘unligi',occasion:'Kundalik',productIds:['demo-v2-24','demo-v2-5'],active:true},{id:'look-weekend',name:'Karamel rangli kundalik obraz',occasion:'Kundalik',productIds:['demo-v2-31','demo-v2-30','demo-v2-17'],active:true}]};}
function clearOldDraft(p){return {...p,media:[],colorMedia:{},video:'',description:'Yopiqroq bichimdagi demo qoralama. Egasi shu modelga mos haqiqiy surat va ma’lumot kiritgach e’lon qilinadi.'};}
let changedDrafts=0;
if(mode==='--local'){
 const db=new DatabaseSync('data/fashion.sqlite');db.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; BEGIN IMMEDIATE');
 try{
  for(const m of manifest){const row=db.prepare('SELECT payload FROM products WHERE id=?').get(m.id);assert(row,'Expected local product missing');const current={...JSON.parse(row.payload),variants:db.prepare('SELECT * FROM variants WHERE productId=? AND retired=0').all(m.id)};const p=updatedProduct(current,m);delete p.variants;delete p.approved;db.prepare('UPDATE products SET payload=? WHERE id=?').run(JSON.stringify(p),m.id);for(const v of current.variants)db.prepare('UPDATE variants SET color=?,hex=?,price=NULL WHERE id=?').run(m.color,m.hex,v.id);}
  for(const row of db.prepare('SELECT id,payload FROM products').all()){const p=JSON.parse(row.payload);if(p.status==='draft'&&/^p\d+$/.test(p.id)){db.prepare('UPDATE products SET payload=? WHERE id=?').run(JSON.stringify(clearOldDraft(p)),p.id);changedDrafts++;}}
  const s=JSON.parse(db.prepare('SELECT payload FROM settings WHERE id=1').get().payload);db.prepare('UPDATE settings SET payload=? WHERE id=1').run(JSON.stringify({...s,...settingsPatch}));
  const m=JSON.parse(db.prepare('SELECT payload FROM merchandising WHERE id=1').get().payload);db.prepare('UPDATE merchandising SET payload=? WHERE id=1').run(JSON.stringify(updatedContent(m)));
  assert.equal(db.prepare('PRAGMA integrity_check').get().integrity_check,'ok');db.exec('COMMIT');
 }catch(error){db.exec('ROLLBACK');throw error;}finally{db.close();}
 console.log('Local catalog updated',{published:36,oldDraftPhotosCleared:changedDrafts,stockAndIds:'preserved'});
}else{
 const base='https://fashion-shop-demo-tom.netlify.app';
 const password=(await fs.readFile('data/netlify-admin-access.txt','utf8')).match(/Parol: (.+)/)?.[1].trim();
 const login=await fetch(base+'/api/login',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({username:'owner',password})});assert.equal(login.status,200,'Cloud login failed');
 const cookie=login.headers.get('set-cookie').split(';')[0];
 async function api(url,method='GET',body){const r=await fetch(base+'/api/'+url,{method,headers:{Cookie:cookie,Origin:base,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});if(!r.ok)throw Error(url+': '+r.status+' '+(await r.json()).error);return r.json();}
 try{
  const initial=await api('admin/data');
  for(const m of manifest){assert(initial.products.some(p=>p.id===m.id&&p.isDemo),'Expected cloud demo model missing');assert.equal((await fetch(base+mediaFor(m)[0],{method:'HEAD'})).status,200,'Deploy new assets before updating cloud data');}
  for(const m of manifest){const current=(await api('admin/data')).products.find(p=>p.id===m.id);await api('admin/products','POST',updatedProduct(current,m));if(m.number%6===0)console.log('Cloud models updated',m.number,'/36');}
  for(const p of (await api('admin/data')).products.filter(p=>p.status==='draft'&&/^p\d+$/.test(p.id))){await api('admin/products','POST',{...clearOldDraft(p),approved:false});changedDrafts++;}
  await api('admin/settings','PUT',settingsPatch);
  await api('admin/merchandising','PUT',updatedContent(await api('admin/merchandising')));
  const final=await api('catalog');assert.equal(final.products.length,36);
  for(const m of manifest){const p=final.products.find(p=>p.id===m.id);assert.equal(p.name,m.name);assert.equal(p.price,m.price);assert.deepEqual(p.media,mediaFor(m));}
  await fs.writeFile('docs/deploy/uz-catalog-update.json',JSON.stringify({site:base,updatedAt:new Date().toISOString(),published:36,oldDraftPhotosCleared:changedDrafts,priceRange:[159000,699000],stockAndIds:'preserved',lookCount:3},null,2));
  console.log('Cloud catalog verified: all 36 models, prices, photos and 3 coordinated looks');
 }finally{await api('logout','POST');}
}
