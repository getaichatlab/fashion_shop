import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import sharp from 'sharp';

const root='D:/fr_sayt/fashion_shop';
const out=path.join(root,'presentation/.build/assets');
process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(root,'.browsers');
const projectRequire=createRequire(path.join(root,'package.json'));
const {chromium}=projectRequire('@playwright/test');
const QRCode=projectRequire('qrcode');
await fs.mkdir(out,{recursive:true});
const publicUrl='https://fashion-shop-demo-tom.netlify.app';
const base='http://127.0.0.1:3100';
for(const [name,url] of [['qr-site',publicUrl],['qr-admin',publicUrl+'/admin']]){
 await QRCode.toFile(path.join(out,name+'.png'),url,{width:1000,margin:4,errorCorrectionLevel:'M',color:{dark:'#20171C',light:'#FFFFFF'}});
}
const browser=await chromium.launch({headless:true});
try{
 const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const ready=async()=>{await page.evaluate(()=>document.fonts.ready);await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.filter(i=>i.complete).map(i=>i.decode().catch(()=>{}))));};
 await page.goto(base+'/catalog',{waitUntil:'networkidle',timeout:60000});
 await page.locator('.product-card').first().waitFor();
 await page.locator('.product-card').first().scrollIntoViewIfNeeded();await ready();
 await page.screenshot({path:path.join(out,'catalog.png')});
 await page.locator('.card-view').first().click();await page.getByRole('dialog').waitFor();await ready();
 await page.screenshot({path:path.join(out,'quick-view.png')});
 await page.getByRole('button',{name:'Yopish',exact:true}).click();
 await page.setViewportSize({width:390,height:844});
 await page.goto(base,{waitUntil:'networkidle',timeout:60000});await page.locator('.hero').waitFor();await ready();
 await page.screenshot({path:path.join(out,'mobile-home.png')});
 await page.setViewportSize({width:1440,height:960});
 const credential=await fs.readFile(path.join(root,'data/admin-access.txt'),'utf8');
 const password=credential.match(/Parol:\s*(.+)/)[1].trim();
 const login=await context.request.post(base+'/api/login',{headers:{origin:base},data:{username:'owner',password}});
 if(!login.ok())throw Error('Admin login failed: '+login.status());
 await page.goto(base+'/admin/products',{waitUntil:'networkidle',timeout:60000});await page.locator('.admin-content').waitFor();await ready();
 await page.locator('select').filter({has:page.locator('option[value="published"]')}).first().selectOption('published');
 await page.locator('.admin-product img').first().waitFor();await ready();
 await page.screenshot({path:path.join(out,'admin-products.png')});
 await page.goto(base+'/admin',{waitUntil:'networkidle',timeout:60000});await page.locator('.admin-content').waitFor();await ready();
 await page.screenshot({path:path.join(out,'admin-overview.png')});
 await page.goto(base+'/admin/studio',{waitUntil:'networkidle',timeout:60000});
 await page.locator('.admin-content .panel select').first().selectOption('demo-v2-6');
 const studio=page.locator('.image-studio');
 const canvas=studio.locator('canvas[aria-label="Kiyimni belgilash maydoni"]');
 await canvas.waitFor();
 await page.waitForFunction(()=>document.querySelector('canvas[aria-label="Kiyimni belgilash maydoni"]')?.width>100);
 await studio.getByRole('button',{name:'Ramka',exact:true}).click();
 await canvas.scrollIntoViewIfNeeded();
 const b=await canvas.boundingBox();
 await page.mouse.move(b.x+b.width*.015,b.y+b.height*.002);await page.mouse.down();
 await page.mouse.move(b.x+b.width*.965,b.y+b.height*.99,{steps:8});await page.mouse.up();
 await studio.getByRole('button',{name:'Kiyimni saqlash',exact:true}).click();
 for(const [x,y1,y2] of [[.47,.005,.26],[.33,.008,.16],[.60,.015,.20]]){
  await page.mouse.move(b.x+b.width*x,b.y+b.height*y1);await page.mouse.down();
  await page.mouse.move(b.x+b.width*x,b.y+b.height*y2,{steps:10});await page.mouse.up();
 }
 await studio.getByRole('button',{name:'Fonni ajratish',exact:true}).waitFor({state:'visible'});
 await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent.includes('Fonni ajratish')&&!b.disabled),{},{timeout:60000});
 await studio.getByRole('button',{name:'Fonni ajratish',exact:true}).click();
 await page.waitForFunction(()=>[...document.querySelectorAll('[role=status]')].some(e=>e.textContent.includes('Fon ajratildi')),{},{timeout:60000});
 await studio.getByRole('button',{name:'Iliq oq',exact:true}).click();
 await ready();
 const result=await studio.locator('canvas[aria-label="Tayyor reklama va katalog rasmi"]').evaluate(c=>c.toDataURL('image/png').split(',')[1]);
 await fs.writeFile(path.join(out,'studio-result.png'),Buffer.from(result,'base64'));
 await canvas.scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'studio-screen.png')});
 await context.request.post(base+'/api/logout',{headers:{origin:base}});
 console.log(JSON.stringify({captured:7,qr:2,pageErrors:errors,studio:'Real browser processing; no product saved or published'}));
 await context.close();
}finally{await browser.close();}
for(const [source,name] of [['uz-style-01.jpg','cover-photo.jpg'],['uz-style-06.jpg','studio-original.jpg'],['uz-style-07.jpg','offer-photo.jpg'],['uz-style-14.jpg','bot-photo.jpg']]){
 await sharp(path.join(root,'public/images',source)).resize({width:1600,withoutEnlargement:true}).jpeg({quality:90}).toFile(path.join(out,name));
}
