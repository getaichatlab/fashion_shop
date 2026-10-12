import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base='https://fashion-shop-demo-tom.netlify.app';
const before=JSON.parse(await fs.readFile('data/backups/cloud-2026-10-11T06-05-13-488Z/catalog-orders-settings.json','utf8'));
const manifest=JSON.parse(await fs.readFile('data/uz-catalog-manifest.json','utf8'));
const password=(await fs.readFile('data/netlify-admin-access.txt','utf8')).match(/Parol: (.+)/)?.[1].trim();
const login=await fetch(base+'/api/login',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({username:'owner',password})});
assert.equal(login.status,200,'Cloud admin login');
const cookie=login.headers.get('set-cookie').split(';')[0];
async function get(path,method='GET'){
 for(let attempt=0;attempt<3;attempt++){
  try{const response=await fetch(base+path,{method,headers:{Cookie:cookie}});assert.equal(response.status,200,path);return method==='HEAD'?response:response.json();}catch(error){if(attempt===2)throw error;}
 }
}
try{
 const admin=await get('/api/admin/data'),catalog=await get('/api/catalog'),content=await get('/api/admin/merchandising');
 assert.equal(admin.products.length,before.products.length,'No products lost');
 assert.equal(catalog.products.length,36,'Published catalog size');
 const stock=p=>p.variants.map(v=>({id:v.id,productId:v.productId,size:v.size,stock:v.stock,reserved:v.reserved,sku:v.sku,retired:v.retired})).sort((a,b)=>a.id.localeCompare(b.id));
 for(const old of before.products){const product=admin.products.find(p=>p.id===old.id);assert(product,'Product remains');assert.equal(product.status,old.status);assert.equal(product.slug,old.slug);assert.deepEqual(stock(product),stock(old),'Variant IDs/SKU/size/stock preserved');}
 assert.deepEqual(admin.orders,before.orders,'Order history unchanged');
 assert.deepEqual(admin.requests,before.requests,'Customer requests unchanged');
 const urls=new Set();
 for(const item of manifest){
  const product=catalog.products.find(p=>p.id===item.id);
  assert.equal(product.name,item.name);assert.equal(product.price,item.price);assert.equal(product.oldPrice,0);
  assert(product.variants.every(v=>v.color===item.color&&v.hex===item.hex&&v.price===null));
  assert(product.media.every(url=>url.startsWith('/images/uz-style-')));
  product.media.forEach(url=>urls.add(url));
 }
 assert(admin.products.filter(p=>p.status==='draft').every(p=>p.media.length===0),'Drafts have no unrelated old photos');
 assert.equal(catalog.settings.heroImage,'/images/uz-editorial-1.jpg');
 for(let number=1;number<=6;number++)urls.add('/images/uz-editorial-'+number+'.jpg');
 for(const url of urls)await get(url,'HEAD');
 assert.equal(content.looks.filter(look=>look.active).length,3);
 assert(content.banners.every(b=>b.image.startsWith('/images/uz-editorial-')));
 for(const [key,value] of Object.entries(before.settings)){if(!['heroTitle','heroSubtitle','heroImage','accent'].includes(key))assert.deepEqual(catalog.settings[key],value,'Store setting '+key+' preserved');}
 const report={site:base,checkedAt:new Date().toISOString(),published:36,totalProducts:admin.products.length,checkedImages:urls.size,priceRange:[Math.min(...manifest.map(p=>p.price)),Math.max(...manifest.map(p=>p.price))],checks:{photosNamesColorsPrices:true,noInventedDiscounts:true,variantIdsSkuStockPreserved:true,ordersRequestsPreserved:true,storePoliciesContactsPreserved:true,draftPhotosCleared:true,threeLooksAndUpdatedBanners:true}};
 await fs.writeFile('docs/deploy/uz-catalog-verification.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
}finally{await fetch(base+'/api/logout',{method:'POST',headers:{Origin:base,Cookie:cookie}});}
