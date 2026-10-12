import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),dir=path.join(root,'data','catalog-candidates');fs.mkdirSync(dir,{recursive:true});
const list=JSON.parse(fs.readFileSync('data/asset-candidates.json','utf8'));
for(let i=0;i<list.length;i+=4){await Promise.all(list.slice(i,i+4).map(async(x,j)=>{const file=path.join(dir,`${i+j}.jpg`);if(fs.existsSync(file))return;const r=await fetch(x.url.replace('width=1000','width=800'));if(!r.ok)throw Error(r.status+' '+x.slug);fs.writeFileSync(file,Buffer.from(await r.arrayBuffer()));}));}
console.log('Downloaded '+list.length+' licensed photo candidates.');
