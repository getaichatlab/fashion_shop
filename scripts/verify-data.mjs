import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
const db=new DatabaseSync('data/fashion.sqlite',{readOnly:true});
try{
 const all=db.prepare('SELECT id,payload FROM products').all().map(r=>JSON.parse(r.payload));
 const demo=all.filter(p=>/^p\d+$|^demo-v2-\d+$|^demo-draft-\d+$/.test(p.id));
 const media=db.prepare('SELECT id FROM media').all();
 const missingMedia=media.filter(m=>!fs.existsSync(path.join('data/media',m.id))).map(m=>m.id);
 const missingReferences=[];
 for(const p of all)for(const url of [...p.media,...(p.video?[p.video]:[])]){
  if(url.startsWith('/images/')&&!fs.existsSync(path.join('public',url)))missingReferences.push({product:p.id,url});
  if(url.startsWith('/api/media/')&&!fs.existsSync(path.join('data/media',url.split('/').at(-1))))missingReferences.push({product:p.id,url});
 }
 const report={verifiedAt:new Date().toISOString(),integrity:db.prepare('PRAGMA integrity_check').get().integrity_check,foreignKeyErrors:db.prepare('PRAGMA foreign_key_check').all(),demoModels:demo.length,publishedDemoModels:demo.filter(p=>p.status==='published').length,draftDemoModels:demo.filter(p=>p.status==='draft').length,missingMedia,missingReferences};
 const previous=process.argv[2];
 if(previous){
  const baseline=new DatabaseSync(path.join(previous,'fashion.sqlite'),{readOnly:true});
  try{
   const products=baseline.prepare('SELECT id FROM products').all(),variants=baseline.prepare('SELECT id,productId,stock,reserved FROM variants').all(),orders=baseline.prepare('SELECT id FROM orders').all();
   const current=new Map(db.prepare('SELECT id,stock,reserved FROM variants').all().map(v=>[v.id,v]));
   report.preservation={baseline:previous,priorProducts:products.length,missingProductIds:products.filter(p=>!db.prepare('SELECT id FROM products WHERE id=?').get(p.id)).map(p=>p.id),priorVariants:variants.length,missingVariantIds:variants.filter(v=>!current.has(v.id)).map(v=>v.id),priorOrders:orders.length,missingOrderIds:orders.filter(o=>!db.prepare('SELECT id FROM orders WHERE id=?').get(o.id)).map(o=>o.id),originalDemoStockChanges:variants.filter(v=>/^p\d+$/.test(v.productId)&&current.has(v.id)&&current.get(v.id).stock!==v.stock).map(v=>v.id),originalDemoReservationChanges:variants.filter(v=>/^p\d+$/.test(v.productId)&&current.has(v.id)&&current.get(v.id).reserved!==v.reserved).map(v=>({id:v.id,before:v.reserved,after:current.get(v.id).reserved}))};
  }finally{baseline.close();}
 }
 fs.writeFileSync('docs/data-verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 if(report.integrity!=='ok'||report.foreignKeyErrors.length||missingMedia.length||missingReferences.length||report.preservation?.missingProductIds.length||report.preservation?.missingVariantIds.length||report.preservation?.missingOrderIds.length)process.exitCode=1;
}finally{db.close();}
