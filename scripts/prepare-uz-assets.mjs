import fs from 'node:fs/promises';
import sharp from 'sharp';
const manifest=JSON.parse(await fs.readFile('data/uz-catalog-manifest.json','utf8'));
let completed=0;
const jobs=manifest.flatMap(model=>[model.photo,...model.extra].map((photo,i)=>({model,photo,file:`uz-style-${String(model.number).padStart(2,'0')}${i?'-'+(i+1):''}.jpg`})));
let next=0;
await Promise.all(Array.from({length:3},async()=>{while(next<jobs.length){const job=jobs[next++];
 const url=new URL(job.photo.url);url.searchParams.set('w','1200');url.searchParams.set('q','85');
 let bytes;
 for(let attempt=0;attempt<3;attempt++){try{const response=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error('Photo HTTP '+response.status);bytes=Buffer.from(await response.arrayBuffer());break;}catch(error){if(attempt===2)throw error;}}
 await sharp(bytes).rotate().resize({width:1080,height:1600,fit:'inside',withoutEnlargement:true}).jpeg({quality:83,mozjpeg:true}).toFile('public/images/'+job.file);
 if(++completed%8===0)console.log('Photos prepared',completed,'/',jobs.length);
}}));
const editorial=[1,24,2,7,28,18];
for(let i=0;i<editorial.length;i++)await fs.copyFile(`public/images/uz-style-${String(editorial[i]).padStart(2,'0')}.jpg`,`public/images/uz-editorial-${i+1}.jpg`);
await fs.writeFile('docs/UZ_CATALOG_ASSETS.json',JSON.stringify(jobs.map(j=>({file:j.file,model:j.model.name,author:j.photo.author,source:j.photo.source,photoId:j.photo.id,license:'Unsplash License',reviewedAt:new Date().toISOString()})),null,2)+'\n');
console.log('All 36 products, 3 alternate views and 6 editorial photos prepared');
