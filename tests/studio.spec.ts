import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const origin='http://127.0.0.1:3100';
const credential=()=>fs.readFileSync('data/admin-access.txt','utf8').match(/Parol: (.+)/)![1].trim();
async function login(request:any){expect((await request.post('/api/login',{headers:{origin},data:{username:'owner',password:credential()}})).ok()).toBeTruthy();}

async function dragPhoto(page:any,canvas:any,a=[.04,.04],b=[.96,.96]){await canvas.scrollIntoViewIfNeeded();const box=(await canvas.boundingBox())!;await page.mouse.move(box.x+box.width*a[0],box.y+box.height*a[1]);await page.mouse.down();await page.mouse.move(box.x+box.width*b[0],box.y+box.height*b[1],{steps:5});await page.mouse.up();}

test('phone photo studio preserves garment, exports, approves and publishes',async({page,request})=>{
 await login(request);await page.context().addCookies((await request.storageState()).cookies);
 await page.goto('/admin/products');await page.getByRole('button',{name:'Yangi mahsulot'}).click();
 const name='QA — rasm editori '+Date.now();await page.getByLabel('Mahsulot nomi',{exact:true}).fill(name);await page.getByLabel('Narx, so‘m',{exact:true}).fill('180000');
 const base64=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=200;c.height=300;const x=c.getContext('2d')!;x.fillStyle='white';x.fillRect(0,0,200,300);x.fillStyle='#e02030';x.beginPath();x.moveTo(70,50);x.lineTo(40,70);x.lineTo(20,120);x.lineTo(60,140);x.lineTo(60,250);x.lineTo(140,250);x.lineTo(140,140);x.lineTo(180,120);x.lineTo(160,70);x.lineTo(130,50);x.closePath();x.fill();return c.toDataURL('image/png').split(',')[1];});
 await page.locator('.product-form > .section-head input[type=file]').setInputFiles({name:'demo-phone-photo.png',mimeType:'image/png',buffer:Buffer.from(base64,'base64')});
 await expect(page.locator('.media-grid img')).toHaveCount(1);await page.getByRole('button',{name:'Fon / reklama',exact:true}).click();
 const studio=page.locator('.image-studio'),canvas=studio.locator('canvas[aria-label="Kiyimni belgilash maydoni"]');await expect(canvas).toHaveJSProperty('width',200);
 await dragPhoto(page,canvas);await studio.getByRole('button',{name:'Fonni ajratish',exact:true}).click();await expect(studio.getByRole('status')).toContainText('Fon ajratildi');
 const pixels=await canvas.evaluate((c:any)=>{const x=c.getContext('2d');return {corner:[...x.getImageData(0,0,1,1).data],garment:[...x.getImageData(100,150,1,1).data]};});expect(pixels.corner[3]).toBe(0);expect(pixels.garment).toEqual([224,32,48,255]);
 await studio.getByRole('button',{name:'Aylantirish',exact:true}).click();await expect(canvas).toHaveJSProperty('width',300);await expect(canvas).toHaveJSProperty('height',200);
 await studio.getByRole('button',{name:'Suratni kesish',exact:true}).click();await dragPhoto(page,canvas,[.2,.2],[.8,.8]);await expect(studio.getByRole('status')).toContainText('Surat kesildi');const croppedWidth=await canvas.evaluate((c:any)=>c.width);expect(croppedWidth).toBeLessThan(300);
 await studio.getByRole('button',{name:'Amalni bekor qilish',exact:true}).click();await expect(canvas).toHaveJSProperty('width',300);await studio.getByRole('button',{name:'Amalni qaytarish',exact:true}).click();await expect(canvas).toHaveJSProperty('width',croppedWidth);
 await studio.getByRole('button',{name:'Asl suratga qaytish',exact:true}).click();await expect(canvas).toHaveJSProperty('width',200);await expect(canvas).toHaveJSProperty('height',300);await studio.getByRole('button',{name:'Ramka',exact:true}).click();await dragPhoto(page,canvas);await studio.getByRole('button',{name:'Fonni ajratish',exact:true}).click();await expect(studio.getByRole('status')).toContainText('Fon ajratildi');
 const downloadPromise=page.waitForEvent('download');await studio.getByRole('button',{name:'Tayyor rasmni yuklab olish',exact:true}).click();const download=await downloadPromise;await download.saveAs('docs/qa-catalog-export.png');const png=fs.readFileSync('docs/qa-catalog-export.png');expect(png.readUInt32BE(16)).toBe(1200);expect(png.readUInt32BE(20)).toBe(1500);const preview=await studio.locator('canvas[aria-label="Tayyor reklama va katalog rasmi"]').evaluate((c:any)=>c.toDataURL('image/png').split(',')[1]);expect(png).toEqual(Buffer.from(preview,'base64'));
 await studio.getByRole('button',{name:'Mahsulotga nusxa qo‘shish',exact:true}).click();await expect(page.locator('.media-grid img')).toHaveCount(2);await expect(page.getByLabel('Suratlar, kiyim ko‘rinishi, narx va variantlarni tekshirdim.')).not.toBeChecked();
 await page.getByRole('button',{name:'Mahsulotni saqlash',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCount(0);
 let data=await (await request.get('/api/admin/data')).json();let p=data.products.find((p:any)=>p.name===name);expect(p.status).toBe('draft');const publicContext=await page.context().browser()!.newContext();try{expect((await publicContext.request.get(origin+p.media[0])).status()).toBe(404);const published=await request.post('/api/admin/products',{headers:{origin},data:{...p,status:'published',approved:true}});expect(published.ok(),await published.text()).toBeTruthy();const catalog=await (await publicContext.request.get(origin+'/api/catalog')).json();expect(catalog.products.some((x:any)=>x.id===p.id)).toBeTruthy();expect((await publicContext.request.get(origin+p.media[0])).ok()).toBeTruthy();expect(Buffer.from(await (await request.get(p.media[1])).body())).toEqual(Buffer.from(base64,'base64'));}finally{await publicContext.close();await request.post('/api/admin/products',{headers:{origin},data:{...(await (await request.get('/api/admin/data')).json()).products.find((x:any)=>x.id===p.id),status:'archived',approved:true}});}
});

test('shared collections, stock requests and seller replies persist',async({request})=>{
 await login(request);const p=(await (await request.get('/api/catalog')).json()).products.find((p:any)=>p.id==='demo-v2-1');
 const shared=await request.post('/api/wishlist',{headers:{origin},data:{ids:[p.id]}});const {id}=await shared.json();expect((await (await request.get('/api/wishlist/'+id)).json()).ids).toEqual([p.id]);
 for(const type of ['stock','question']){const r=await request.post('/api/request',{headers:{origin},data:{type,name:'QA murojaat',phone:'+998901234567',productId:p.id,variantId:p.variants[0].id,message:type==='question'?'Matoning parvarishi qanday?':''}});expect(r.ok(),await r.text()).toBeTruthy();}
 const data=await (await request.get('/api/admin/data')).json();const rows=data.requests.filter((r:any)=>r.payload.name==='QA murojaat');expect(rows.length).toBeGreaterThanOrEqual(2);for(const row of rows){expect((await request.patch('/api/admin/requests/'+row.id,{headers:{origin},data:{status:'closed'}})).ok()).toBeTruthy();}
});

test('settings reject unreadable accents and unavailable payment combinations',async({request})=>{
 await login(request);const settings=(await (await request.get('/api/admin/data')).json()).settings;
 expect((await request.put('/api/admin/settings',{headers:{origin},data:{...settings,accent:'#ffffff'}})).status()).toBe(400);
 expect((await request.put('/api/admin/settings',{headers:{origin},data:{...settings,delivery:true,paymentMethods:['Do‘konda naqd']}})).status()).toBe(400);
 expect((await (await request.get('/api/admin/data')).json()).settings).toEqual(settings);
});
