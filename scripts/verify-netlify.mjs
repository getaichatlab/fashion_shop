import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';

// This mutates only a new, explicitly marked QA demo product and QA orders.
// Completed orders are cancelled and the product is archived through normal APIs.
const base = 'https://fashion-shop-demo-tom.netlify.app';
const password = (await fs.readFile('data/netlify-admin-access.txt', 'utf8')).match(/Parol: (.+)/)?.[1].trim();
assert(password, 'Cloud admin access file missing');
const checks = [];
let cookie = '', productId;
const createdOrders = [];
async function request(endpoint, {method='GET', body, authenticated=false, headers={}} = {}) {
 const response = await fetch(base + endpoint, {method, headers:{
  ...(method!=='GET'?{Origin:base}:{}),
  ...(body && !(body instanceof FormData)?{'Content-Type':'application/json'}:{}),
  ...(authenticated?{Cookie:cookie}:{}), ...headers
 }, body:body instanceof FormData?body:body?JSON.stringify(body):undefined});
 return response;
}
async function json(endpoint, options, expected=200) {
 const response = await request(endpoint, options);
 assert.equal(response.status,expected, `${endpoint}: unexpected HTTP ${response.status}`);
 return response.json();
}
const record = name => {checks.push(name); console.log('PASS', name);};
async function adminData() {return json('/api/admin/data',{authenticated:true});}
try {
 assert.equal((await request('/')).status,200);
 const original=await json('/api/catalog');
 assert.equal(original.products.length,36);
 assert.equal((await request('/api/admin/data')).status,401);
 record('Anonymous storefront, 36 published models, protected admin');
 const login=await request('/api/login',{method:'POST',body:{username:'owner',password}});
 assert.equal(login.status,200,'Cloud login failed');
 cookie=login.headers.get('set-cookie')?.split(';')[0] || '';
 assert(cookie.startsWith('fs-session='));
 assert.match(login.headers.get('set-cookie'),/HttpOnly/i);
 assert.match(login.headers.get('set-cookie'),/Secure/i);
 assert.match(login.headers.get('set-cookie'),/SameSite=Strict/i);
 const initialAdmin=await adminData();
 assert.equal(initialAdmin.user.role,'owner');
 assert.equal(initialAdmin.products.filter(p=>p.status==='draft').length,36);
 record('Owner login and durable session; 36 private draft models');
 assert.equal((await request('/api/admin/settings',{method:'PUT',body:{name:'Unauthorized QA'},authenticated:true,headers:{Origin:'https://example.invalid'}})).status,403);
 record('Cross-origin admin mutation blocked');

 const image=await fs.readFile('public/images/catalog-0.jpg');
 const form=new FormData(); form.append('file',new Blob([image],{type:'image/jpeg'}),'QA-Netlify-image.jpg');
 const uploaded=await json('/api/admin/upload',{method:'POST',body:form,authenticated:true});
 assert.equal((await request(uploaded.url)).status,404);
 const adminImage=await request(uploaded.url,{authenticated:true});
 assert.equal(adminImage.status,200);
 assert.equal(createHash('sha256').update(Buffer.from(await adminImage.arrayBuffer())).digest('hex'),createHash('sha256').update(image).digest('hex'));
 record('Cloud image storage survives a fresh request; unattached image is private');
 const sku='QA-NETLIFY-'+randomUUID().slice(0,8).toUpperCase();
 const draft={name:'QA Netlify — deploy sinovi',category:'Sinov',price:1000,oldPrice:0,status:'draft',isDemo:true,approved:false,media:[uploaded.url],description:'Faqat texnik deploy sinovi; haqiqiy savdo uchun emas.',variants:[{color:'Qora',hex:'#111111',size:'M',stock:1,sku}]};
 ({id:productId}=await json('/api/admin/products',{method:'POST',body:draft,authenticated:true}));
 let product=(await adminData()).products.find(p=>p.id===productId);
 assert(product);
 assert.equal((await request(uploaded.url)).status,404);
 assert.equal((await request('/api/admin/products',{method:'POST',body:{...product,status:'published',approved:false},authenticated:true})).status,400);
 assert(!(await json('/api/catalog')).products.some(p=>p.id===productId));
 record('Draft photo and product stay private; publishing requires approval');
 await json('/api/admin/products',{method:'POST',body:{...product,status:'published',approved:true},authenticated:true});
 product=(await json('/api/catalog')).products.find(p=>p.id===productId);
 assert(product);
 assert.equal((await request(uploaded.url)).status,200);
 record('Approved product and stored photo become visible together');

 const input={customer:'QA Netlify deploy sinovi',phone:'+998900000000',method:'pickup',payment:'Do‘konda naqd',note:'Texnik demo sinovi; avtomatik bekor qilinadi.',items:[{productId,variantId:product.variants[0].id,quantity:1,price:1000}]};
 const keys=[randomUUID(),randomUUID()];
 const results=await Promise.all(keys.map(key=>request('/api/orders',{method:'POST',body:input,headers:{'Idempotency-Key':key}})));
 for(const response of results) if(response.status===201) createdOrders.push(await response.json());
 assert.equal(createdOrders.length,1,'Last unit must be reserved by exactly one concurrent order');
 assert.deepEqual(results.map(r=>r.status).sort(),[201,400]);
 const winner=results.findIndex(r=>r.status===201), order=createdOrders[0];
 const repeated=await json('/api/orders',{method:'POST',body:input,headers:{'Idempotency-Key':keys[winner]}},201);
 assert.equal(repeated.id,order.id);
 const tracked=await json('/api/track/'+order.token);
 assert.equal(tracked.id,order.id);
 assert((await adminData()).orders.some(o=>o.id===order.id));
 record('Concurrent last-unit reservation, repeat protection, tracking and admin persistence');
 await json('/api/admin/orders/'+order.id,{method:'PATCH',body:{status:'cancelled'},authenticated:true});
 product=(await adminData()).products.find(p=>p.id===productId);
 assert.equal(product.variants[0].reserved,0);
 assert.equal(product.variants[0].stock,1);
 record('Cancellation restores the reserved stock');
} finally {
 if(cookie) {
  for(const order of createdOrders) {
   const current=(await adminData()).orders.find(o=>o.id===order.id);
   if(current?.status==='new') await json('/api/admin/orders/'+order.id,{method:'PATCH',body:{status:'cancelled'},authenticated:true});
  }
  if(productId) {
   const product=(await adminData()).products.find(p=>p.id===productId);
   if(product) await json('/api/admin/products',{method:'POST',body:{...product,status:'archived',approved:false},authenticated:true});
  }
  await json('/api/logout',{method:'POST',authenticated:true});
 }
}
assert.equal((await json('/api/catalog')).products.length,36);
record('QA product archived; customer catalog restored to 36 models');
const report={site:base,verifiedAt:new Date().toISOString(),checks,qaProductId:productId,qaOrders:createdOrders.map(o=>o.id),cleanup:'QA orders cancelled and product archived; history retained'};
await fs.writeFile('docs/deploy/netlify-smoke-results.json',JSON.stringify(report,null,2)+'\n');
console.log('Verified',checks.length,'cloud checks');
