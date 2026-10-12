import fs from 'node:fs';
import path from 'node:path';
process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(process.cwd(),'.browsers');
const {chromium}=await import('@playwright/test');
const browser=await chromium.launch();
const results=[];
try{
 for(const profile of [{name:'desktop-local',width:1440,height:900},{name:'mobile-throttled',width:390,height:844,cpu:4,mbps:4,latency:100}]){
  for(let run=1;run<=3;run++){
   const context=await browser.newContext({viewport:{width:profile.width,height:profile.height},reducedMotion:'reduce'});
   const page=await context.newPage(),cdp=await context.newCDPSession(page);
   await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
   if(profile.cpu){await cdp.send('Emulation.setCPUThrottlingRate',{rate:profile.cpu});await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:profile.latency,downloadThroughput:profile.mbps*1000000/8,uploadThroughput:1000000/8});}
   await page.addInitScript(()=>{
    window.lab={lcp:0,cls:0,eventMs:0};let first=0,last=0,sum=0;
    new PerformanceObserver(list=>{for(const e of list.getEntries())window.lab.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(list=>{for(const e of list.getEntries()){if(e.hadRecentInput)continue;if(e.startTime-last>1000||e.startTime-first>5000){first=e.startTime;sum=e.value;}else sum+=e.value;last=e.startTime;window.lab.cls=Math.max(window.lab.cls,sum);}}).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(list=>{for(const e of list.getEntries())if(e.interactionId)window.lab.eventMs=Math.max(window.lab.eventMs,e.duration);}).observe({type:'event',buffered:true,durationThreshold:16});
   });
   await page.goto('http://127.0.0.1:3100',{waitUntil:'domcontentloaded'});await page.locator('.hero').waitFor();
   await page.locator('.hero-visual img').evaluate(i=>i.decode());await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1100);
   const home=await page.evaluate(()=>({...window.lab,fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime||0,resources:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0)}));
   await page.locator(profile.width<768?'.mobile-bottom-nav a[href="/catalog"]':'.header-actions a[aria-label="Qidirish"]').click();await page.locator('.catalog-grid .product-card').first().waitFor();
   await page.locator('.catalog-grid .card-view').first().click();await page.getByRole('dialog').waitFor();await page.waitForTimeout(100);
   const eventMs=await page.evaluate(()=>window.lab.eventMs);
   results.push({profile:profile.name,run,lcpMs:Math.round(home.lcp),fcpMs:Math.round(home.fcp),cls:Number(home.cls.toFixed(4)),maxObservedInteractionMs:eventMs,homeTransferredBytes:home.resources});
   console.log(JSON.stringify(results.at(-1)));
   await context.close();
  }
 }
 fs.writeFileSync('docs/site-performance.json',JSON.stringify({measuredAt:new Date().toISOString(),environment:'Local production server, Chromium; cold browser cache; mobile CPU 4x / 4 Mbps / 100 ms RTT; reduced motion. Event timing is a laboratory interaction observation, not field INP.',results},null,2));
 console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
