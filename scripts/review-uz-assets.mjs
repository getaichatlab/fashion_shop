import fs from 'node:fs/promises';
import sharp from 'sharp';
const photos=JSON.parse(await fs.readFile('data/uz-photo-candidates.json','utf8'));
await fs.mkdir('data/uz-photo-review',{recursive:true});
let next=0,failed=0;
await Promise.all(Array.from({length:3},async()=>{while(next<photos.length){const photo=photos[next++];const file=`data/uz-photo-review/${photo.id}.jpg`;try{await fs.access(file);}catch{try{const url=new URL(photo.url);url.searchParams.set('w','480');url.searchParams.set('q','65');const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('HTTP '+r.status);await fs.writeFile(file,Buffer.from(await r.arrayBuffer()));}catch(error){failed++;console.log('Image unavailable',photo.id,error.message);}}}}));
for(let group=0;group<5;group++){
 const list=photos.filter(p=>p.group===group);const cells=[];
 for(let n=0;n<list.length;n++){const p=list[n],left=n%6*180,top=Math.floor(n/6)*276;try{cells.push({input:await sharp(`data/uz-photo-review/${p.id}.jpg`).resize(178,248,{fit:'contain',background:'#eeeae4'}).jpeg().toBuffer(),left,top});cells.push({input:Buffer.from(`<svg width="180" height="28"><rect width="180" height="28" fill="white"/><text x="8" y="19" font-size="14">${group}:${p.index} ${p.id}</text></svg>`),left,top:top+248});}catch{}}
 await sharp({create:{width:1080,height:Math.ceil(list.length/6)*276,channels:3,background:'#eeeae4'}}).composite(cells).jpeg({quality:85}).toFile(`data/uz-photo-review/group-${group}.jpg`);
}
console.log('Review sheets ready', {photos:photos.length,failed});
