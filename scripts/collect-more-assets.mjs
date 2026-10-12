import fs from 'node:fs';
const list=JSON.parse(fs.readFileSync('data/asset-candidates.json','utf8'));
for(const category of ['dress','shirts','pants','sweaters']){const r=await fetch('https://www.shopify.com/stock-photos/'+category);if(!r.ok)continue;const s=await r.text();fs.writeFileSync('data/assets-'+category+'.html',s);for(const match of s.matchAll(/<img[^>]+>/g)){const x=match[0];if(!x.includes('data-photo-id'))continue;const slug=x.match(/burst.shopifycdn.com\/photos\/([^?]+)/)?.[1],title=x.match(/data-photo-title="([^"]+)/)?.[1],url=x.match(/ src="([^"]+)/)?.[1]?.replaceAll('&amp;','&');if(slug&&url&&!list.some(x=>x.slug===slug))list.push({slug,title,url});}}
fs.writeFileSync('data/asset-candidates.json',JSON.stringify(list,null,2));console.log('Candidates: '+list.length);
