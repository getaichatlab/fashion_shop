import fs from 'node:fs/promises';
const base='https://fashion-shop-demo-tom.netlify.app';
const password=(await fs.readFile('data/netlify-admin-access.txt','utf8')).match(/Parol: (.+)/)?.[1].trim();
if(!password)throw Error('Cloud login file missing');
const login=await fetch(base+'/api/login',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({username:'owner',password})});
if(!login.ok)throw Error('Cloud login failed');
const cookie=login.headers.get('set-cookie').split(';')[0];
try{
 const stamp=new Date().toISOString().replace(/[:.]/g,'-'),directory='data/backups/cloud-'+stamp;
 const exportResponse=await fetch(base+'/api/admin/export',{headers:{Cookie:cookie}});
 const contentResponse=await fetch(base+'/api/admin/merchandising',{headers:{Cookie:cookie}});
 if(!exportResponse.ok||!contentResponse.ok)throw Error('Cloud export failed');
 const data=await exportResponse.json(),content=await contentResponse.json();
 await fs.mkdir(directory,{recursive:true});
 await fs.writeFile(directory+'/catalog-orders-settings.json',JSON.stringify(data,null,2));
 await fs.writeFile(directory+'/merchandising.json',JSON.stringify(content,null,2));
 console.log('Cloud data export saved',directory,{products:data.products.length,orders:data.orders.length});
}finally{await fetch(base+'/api/logout',{method:'POST',headers:{Origin:base,Cookie:cookie}});}
