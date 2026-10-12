import fs from 'node:fs';
import path from 'node:path';
import {cleanAlphaIslands} from '../src/lib/studio.ts';
process.env.PLAYWRIGHT_BROWSERS_PATH=path.join(process.cwd(),'.browsers');
const {chromium}=await import('@playwright/test');
const browser=await chromium.launch();
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:3100');await page.addScriptTag({content:`window.studioCleanup = ${cleanAlphaIslands.toString()};`});
 const report=await page.evaluate(async()=>{
  const cases=[
   {id:1,rect:[.32,.28,.43,.69],keep:[[.60,.53],[.49,.63],[.50,.36],[.40,.90]],remove:[[.34,.50]]},
   {id:2,rect:[.27,.08,.50,.88],keep:[[.55,.62],[.64,.35],[.46,.22],[.50,.84],[.49,.31],[.52,.38],[.54,.72],[.58,.76],[.47,.86],[.61,.85]],remove:[[.70,.75],[.31,.49],[.35,.106],[.718,.186]]},
   {id:3,rect:[.31,.28,.43,.70],keep:[[.57,.50],[.53,.70],[.52,.35],[.54,.90]],remove:[[.35,.83],[.71,.67],[.66,.89]]},
   {id:4,rect:[.20,.05,.65,.94],keep:[[.48,.51],[.65,.63],[.58,.15],[.43,.74],[.30,.17],[.29,.24],[.27,.30],[.27,.38],[.32,.41]],remove:[[.84,.76],[.25,.76],[.36,.29],[.34,.34]]},
   {id:5,rect:[.25,.32,.52,.61],keep:[[.50,.59],[.49,.72],[.52,.37],[.35,.87],[.68,.89],[.47,.78],[.57,.77],[.48,.66]],remove:[[.34,.55],[.70,.63]]},
   {id:6,rect:[.22,.32,.40,.65],keep:[[.46,.70],[.40,.51],[.42,.38],[.52,.92]],remove:[[.30,.80],[.60,.72],[.34,.93],[.42,.925],[.51,.96],[.59,.965]]}
  ];
  const worker=new Worker('/studio/grabcut-worker.js');const wait=new Map();worker.onmessage=({data})=>{const operation=wait.get(data.id);if(operation){wait.delete(data.id);operation(data);}};
  const ask=input=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Worker timeout')),60000);wait.set(input.id,result=>{clearTimeout(timer);result.error?reject(Error(result.error)):resolve(result);});worker.postMessage(input);});
  await ask({id:0,type:'init'});const results=[];const sheet=document.createElement('canvas');sheet.width=1440;sheet.height=940;const sheetContext=sheet.getContext('2d');sheetContext.fillStyle='#f5f2ed';sheetContext.fillRect(0,0,1440,940);
  for(const spec of cases){
   const image=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=`/images/editorial-${spec.id}.jpg`;});const scale=Math.min(1,1000/Math.max(image.width,image.height)),width=Math.round(image.width*scale),height=Math.round(image.height*scale);
   const before=document.createElement('canvas');before.width=width;before.height=height;const ctx=before.getContext('2d');ctx.drawImage(image,0,0,width,height);const original=ctx.getImageData(0,0,width,height),seeds=new Uint8Array(width*height);
   for(const [points,value] of [[spec.keep,1],[spec.remove,2]])for(const [px,py] of points){const cx=Math.round(px*width),cy=Math.round(py*height),radius=Math.max(4,Math.round(width*.018));for(let y=Math.max(0,cy-radius);y<Math.min(height,cy+radius);y++)for(let x=Math.max(0,cx-radius);x<Math.min(width,cx+radius);x++)if((x-cx)**2+(y-cy)**2<radius**2)seeds[y*width+x]=value;}
   const [x,y,w,h]=spec.rect,started=performance.now();const result=await ask({id:spec.id,type:'segment',width,height,pixels:original.data.buffer,seeds:seeds.buffer,rectangle:{x:Math.round(x*width),y:Math.round(y*height),width:Math.round(w*width),height:Math.round(h*height)},detail:640});
   const segmentationMs=Math.round(performance.now()-started),cleanup=window.studioCleanup(new Uint8Array(result.alpha),seeds,width,height,.002);
   const alpha=cleanup.alpha,pixels=new ImageData(new Uint8ClampedArray(original.data),width,height);let decisionsCorrect=true;for(let i=0;i<alpha.length;i++){pixels.data[i*4+3]=alpha[i];if(seeds[i]&&(alpha[i]!== (seeds[i]===1?255:0)))decisionsCorrect=false;}
   const after=document.createElement('canvas');after.width=width;after.height=height;after.getContext('2d').putImageData(pixels,0,0);const col=(spec.id-1)%3,row=Math.floor((spec.id-1)/3),left=col*480,top=row*470,k=Math.min(220/width,400/height),photoTop=top+35+(400-height*k)/2;
   sheetContext.fillStyle='#fff';sheetContext.fillRect(left+10,top+35,220,400);sheetContext.fillRect(left+250,top+35,220,400);sheetContext.drawImage(before,left+10+(220-width*k)/2,photoTop,width*k,height*k);sheetContext.drawImage(after,left+250+(220-width*k)/2,photoTop,width*k,height*k);sheetContext.fillStyle='#292522';sheetContext.font='17px Arial';sheetContext.fillText(`Surat ${spec.id} · asl / belgilar + tozalash`,left+15,top+25);sheetContext.font='14px Arial';sheetContext.fillText(`${segmentationMs}ms · ${cleanup.removedComponents} mayda qoldiq`,left+15,top+455);
   results.push({photo:spec.id,width,height,segmentationMs,elapsedMs:Math.round(performance.now()-started),coverageBeforeCleanup:result.coverage,removedComponents:cleanup.removedComponents,manualForegroundHints:spec.keep.length,manualBackgroundHints:spec.remove.length,explicitDecisionsPreserved:decisionsCorrect,png:after.toDataURL().split(',')[1]});
  }
  worker.terminate();return {results,sheet:sheet.toDataURL().split(',')[1]};
 });
 fs.mkdirSync('docs/studio-validation',{recursive:true});for(const result of report.results){fs.writeFileSync(`docs/studio-validation/editorial-${result.photo}-cutout.png`,Buffer.from(result.png,'base64'));delete result.png;}
 fs.writeFileSync('docs/studio-validation/real-photos.png',Buffer.from(report.sheet,'base64'));fs.writeFileSync('docs/studio-validation/results.json',JSON.stringify(report.results,null,2));console.log(JSON.stringify(report.results,null,2));
 if(report.results.some(r=>!r.explicitDecisionsPreserved))throw Error('Explicit user decisions were lost.');
}finally{await browser.close();}
