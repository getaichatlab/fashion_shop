import fs from 'node:fs';
import path from 'node:path';
process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(process.cwd(),'.browsers');
const {chromium}=await import('@playwright/test');
const browser=await chromium.launch(),origin='http://127.0.0.1:3100';
try{
 const context=await browser.newContext({reducedMotion:'reduce'}),page=await context.newPage();
 const password=fs.readFileSync('data/admin-access.txt','utf8').match(/Parol: (.+)/)[1].trim();
 const login=await context.request.post(origin+'/api/login',{headers:{origin},data:{username:'owner',password}});if(!login.ok())throw Error('Admin login failed');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,390]){
  const size=width===1440?'desktop':'mobile';await page.setViewportSize({width,height:900});
  await page.goto(origin);await page.locator('.hero').waitFor();await page.evaluate(()=>document.fonts.ready);
  for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=650){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(60);}
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(200);
  await page.screenshot({path:`docs/polish-home-${size}.png`,fullPage:true});await page.screenshot({path:`docs/polish-home-${size}-top.png`});
  await page.goto(origin+'/catalog');await page.locator('.product-card').first().waitFor();await page.locator('.product-card img').first().evaluate(i=>i.decode());
  await page.locator('.product-card').first().scrollIntoViewIfNeeded();await page.screenshot({path:`docs/polish-catalog-${size}.png`});
  await page.locator('.card-view').first().click();await page.getByRole('dialog').waitFor();await page.screenshot({path:`docs/polish-quick-${size}.png`});await page.getByRole('button',{name:'Yopish',exact:true}).click();
  await page.goto(origin+'/admin/products');await page.locator('.admin-content').waitFor();await page.getByPlaceholder('Nomi yoki kodi bilan qidirish').fill('FS-047');
  await page.locator('.admin-product').first().getByRole('button',{name:'Tahrirlash'}).click();await page.getByRole('dialog').waitFor();await page.screenshot({path:`docs/polish-product-form-${size}.png`});
  await page.locator('.matrix-section').scrollIntoViewIfNeeded();await page.screenshot({path:`docs/polish-variants-${size}.png`});await page.getByRole('button',{name:'Bekor qilish',exact:true}).click();
  await page.goto(origin+'/admin/content');await page.locator('.content-block-row').first().waitFor();await page.screenshot({path:`docs/polish-content-${size}.png`});
 }
 console.log(JSON.stringify({screenshots:14,pageErrors:errors}));await context.close();
}finally{await browser.close();}
