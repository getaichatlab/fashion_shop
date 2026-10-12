import fs from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
const db=new DatabaseSync('data/fashion.sqlite');db.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
if(!db.prepare('PRAGMA table_info(variants)').all().some(c=>c.name==='sku'))throw Error('Avval yangilangan saytni bir marta ishga tushiring.');
const candidates=JSON.parse(fs.readFileSync('data/asset-candidates.json','utf8'));
// Each row is a visually reviewed distinct garment. Alternate views belong to that same model.
const models=[
 [0,'Qora charm uslubidagi kurtka','Kurtkalar','Qora','#242424','Kuz','Kundalik',[36]],
 [1,'Sariq keng shim','Shimlar','Sariq','#ddc44b','Yoz','Sayr',[123]],
 [3,'Naqshli och binafsha kurtka','Kurtkalar','Binafsha','#b9a2ad','Bahor','Kundalik',[]],
 [4,'Oq yoqali qora ko‘ylak','Ko‘ylaklar','Qora','#222222','Bahor','Kundalik',[]],
 [6,'Oq keng sviter','Sviter va kardiganlar','Oq','#eee9e2','Qish','Kundalik',[]],
 [7,'Pushti gulli top','Top va futbolkalar','Pushti','#a7375a','Yoz','Sayr',[]],
 [10,'Ko‘k jinsi shorti','Jinsi kiyimlar','Ko‘k','#597d94','Yoz','Sayr',[]],
 [12,'Chiziqli uzun yengli top','Top va futbolkalar','Ko‘k','#658b96','Bahor','Kundalik',[]],
 [13,'Zaytun rangli huddi','Top va futbolkalar','Zaytun','#67705e','Kuz','Kundalik',[]],
 [15,'Gulli qisqa top','Top va futbolkalar','Oq','#ebe2d6','Yoz','Sayr',[]],
 [16,'Qora yengsiz top','Top va futbolkalar','Qora','#202020','Yoz','Kundalik',[]],
 [17,'Qora uzun ko‘ylak','Ko‘ylaklar','Qora','#252525','Yoz','Bayram',[]],
 [19,'Oq chiziqli futbolka','Top va futbolkalar','Oq','#ece9e1','Yoz','Kundalik',[]],
 [20,'Bordo uzun yengli sviter','Sviter va kardiganlar','Bordo','#752339','Kuz','Kundalik',[]],
 [21,'Jinsi kombinezon','Jinsi kiyimlar','Ko‘k','#5d6f91','Bahor','Sayr',[]],
 [24,'Kaki keng shim','Shimlar','Kaki','#a19875','Yoz','Ish uchun',[]],
 [29,'Qora baland yoqali sviter','Sviter va kardiganlar','Qora','#222323','Qish','Kundalik',[]],
 [30,'Oq erkin bluzka','Ko‘ylak va bluzkalar','Oq','#e9e8e4','Bahor','Ish uchun',[]],
 [31,'Qora midi ko‘ylak','Ko‘ylaklar','Qora','#242423','Kuz','Bayram',[]],
 [33,'Pushti uzun palto','Palto va trenchlar','Pushti','#b67489','Kuz','Kundalik',[]],
 [34,'Kulrang keng shorti','Shimlar','Kulrang','#8b8e8d','Yoz','Sayr',[]],
 [35,'Qora fermuarli kurtka','Kurtkalar','Qora','#242424','Kuz','Kundalik',[]],
 [41,'Oq uzun yengli ko‘ylak','Ko‘ylaklar','Oq','#efeeea','Bahor','Bayram',[]],
 [43,'Xantal rangli bluzka','Ko‘ylak va bluzkalar','Xantal','#ae7937','Kuz','Ish uchun',[]],
 [49,'Kulrang uzun palto','Palto va trenchlar','Kulrang','#a0a2a0','Qish','Ish uchun',[]],
 [51,'Oq yoqali ko‘ylak','Ko‘ylak va bluzkalar','Oq','#ebe8e2','Bahor','Ish uchun',[]],
 [54,'Qora erkin ko‘ylak','Ko‘ylak va bluzkalar','Qora','#292929','Kuz','Ish uchun',[]],
 [55,'Qizil yengsiz top','Top va futbolkalar','Qizil','#ae2635','Yoz','Sayr',[]],
 [59,'Qora gulli maxi ko‘ylak','Ko‘ylaklar','Qora','#242424','Yoz','Bayram',[]],
 [76,'Och pushti yengil ko‘ylak','Ko‘ylaklar','Pushti','#e5cfda','Yoz','Sayr',[]],
 [81,'Yashil uzun ko‘ylak','Ko‘ylaklar','Yashil','#1b7359','Yoz','Bayram',[94]],
 [111,'Pushti gulli midi ko‘ylak','Ko‘ylaklar','Pushti','#bc7891','Yoz','Bayram',[]],
 [119,'Chiziqli sport leggings','Shimlar','Qora','#252525','Barcha mavsum','Kundalik',[129,136,140]],
 [149,'Kulrang sport shim','Shimlar','Kulrang','#b5b6b4','Barcha mavsum','Kundalik',[]],
 [151,'Kamuflyaj sport shim','Shimlar','Naqshli','#7d8177','Barcha mavsum','Kundalik',[]],
 [153,'To‘q ko‘k sport leggings','Shimlar','Ko‘k','#172c4f','Barcha mavsum','Kundalik',[154,160]]
];
const assets=[];
for(const [photo,,,,,,,extra] of models)for(const n of [photo,...extra]){const file=`catalog-${n}.jpg`;fs.copyFileSync(`data/catalog-candidates/${n}.jpg`,`public/images/${file}`);assets.push({file,source:'https://www.shopify.com/stock-photos/photos/'+candidates[n].slug.replace('.jpg',''),title:candidates[n].title,cdn:candidates[n].url,license:'Shopify Burst licensed/CC0 photo terms',reviewedAt:new Date().toISOString()});}
db.exec('BEGIN IMMEDIATE');try{
 // Old sample cards with unrelated editorial photographs become drafts, preserving stock and IDs.
 if(!db.prepare('SELECT id FROM products WHERE id=?').get('demo-v2-1'))for(let i=1;i<=24;i++){const row=db.prepare('SELECT payload FROM products WHERE id=?').get('p'+i);if(!row)continue;const p=JSON.parse(row.payload);const reserved=db.prepare('SELECT SUM(reserved) AS n FROM variants WHERE productId=?').get(p.id).n;if(p.media.every(x=>x.startsWith('/images/editorial-'))&&p.description.includes('Demo surat')&&!reserved){p.status='draft';p.isDemo=true;db.prepare('UPDATE products SET payload=? WHERE id=?').run(JSON.stringify(p),p.id);}}
 models.forEach((m,i)=>{const [photo,name,category,color,hex,season,occasion,extra]=m,id='demo-v2-'+(i+1);if(db.prepare('SELECT id FROM products WHERE id=?').get(id))return;const media=[photo,...extra].map(n=>`/images/catalog-${n}.jpg`),price=195000+(i%8)*50000;const p={id,slug:'collection-'+(i+1),code:'FS-'+String(25+i).padStart(3,'0'),name,category,price,oldPrice:i%7===0?price+70000:0,description:'Demo model. Surat kiyim uslubini ko‘rsatish uchun; narx, o‘lcham va qoldiq namuna. Haqiqiy do‘kon mahsuloti bilan egasi almashtiradi.',fabric:'Tarkibi sotuvchidan aniqlashtiriladi',fit:['Erkin','To‘g‘ri'][i%2],season,occasions:[occasion,'Kundalik'],collections:[season==='Qish'||season==='Kuz'?'Shahar mavsumi':'Yengil kunlar'],colorMedia:{[color]:media},isDemo:true,measurements:'{}',status:'published',media,video:'',badge:'',createdAt:new Date(Date.now()-i*3600000).toISOString()};db.prepare('INSERT INTO products VALUES(?,?)').run(id,JSON.stringify(p));['S','M','L','XL'].forEach((size,j)=>db.prepare('INSERT INTO variants(id,productId,color,hex,size,stock,reserved,sku,price) VALUES(?,?,?,?,?,?,0,?,NULL)').run(`${id}-${j}`,id,color,hex,size,(i+j)%6===0?0:3+j,`${p.code}-${size}`));});
 const drafts=[['Klassik ikki qismli kostyum','Kostyum va komplektlar'],['Erkin kundalik kostyum','Kostyum va komplektlar'],['Linen mavsumiy kostyum','Kostyum va komplektlar'],['Ish kuni uchun komplekt','Kostyum va komplektlar'],['To‘g‘ri bichimli midi yubka','Yubkalar'],['Yengil uzun yubka','Yubkalar'],['Klassik qora yubka','Yubkalar'],['Jinsi midi yubka','Yubkalar'],['Yengil tugmali kardigan','Sviter va kardiganlar'],['Keng trikotaj kardigan','Sviter va kardiganlar'],['Mavsumiy bej trench','Palto va trenchlar'],['Qisqa jinsi kurtka','Jinsi kiyimlar']];drafts.forEach(([name,category],i)=>{const id='demo-draft-'+(i+1);if(db.prepare('SELECT id FROM products WHERE id=?').get(id))return;db.prepare('INSERT INTO products VALUES(?,?)').run(id,JSON.stringify({id,slug:id,code:'FS-'+(61+i),name,category,price:395000,oldPrice:0,description:'Surat va mahsulot ma’lumotlari tayyorlanishini kutayotgan demo qoralama.',fabric:'',measurements:'{}',status:'draft',media:[],video:'',badge:'',isDemo:true,createdAt:new Date().toISOString()}));db.prepare('INSERT INTO variants(id,productId,color,hex,size,stock,reserved,sku) VALUES(?,?,?,?,?,0,0,?)').run(id+'-M',id,'Aniqlashtiriladi','#cccccc','M','FS-'+(61+i)+'-M');});
 db.exec('CREATE TABLE IF NOT EXISTS merchandising(id INTEGER PRIMARY KEY,payload TEXT)');if(!db.prepare('SELECT id FROM merchandising').get())db.prepare('INSERT INTO merchandising VALUES(1,?)').run(JSON.stringify({categories:[...new Set(models.map(m=>m[2]))],blocks:['categories','new','looks','budget','finder','store'],hiddenBlocks:[],looks:[{id:'look-city',name:'Shahar uchun yengil obraz',occasion:'Ish uchun',productIds:['demo-v2-18','demo-v2-16','demo-v2-25'],active:true},{id:'look-walk',name:'Erkin sayr',occasion:'Sayr',productIds:['demo-v2-11','demo-v2-15','demo-v2-1'],active:true},{id:'look-weekend',name:'Dam olish kayfiyati',occasion:'Kundalik',productIds:['demo-v2-13','demo-v2-34','demo-v2-5'],active:true}]}));
 db.prepare('INSERT OR IGNORE INTO migration_versions VALUES(3,?)').run(new Date().toISOString());
 db.exec('COMMIT');
}catch(e){db.exec('ROLLBACK');throw e;}
fs.writeFileSync('docs/CATALOG_ASSETS.json',JSON.stringify(assets,null,2));console.log(JSON.stringify({reviewedModels:models.length,totalDemoModels:72,published:db.prepare("SELECT COUNT(*) AS n FROM products WHERE json_extract(payload,'$.status')='published'").get().n,integrity:db.prepare('PRAGMA integrity_check').get()},null,2));db.close();
