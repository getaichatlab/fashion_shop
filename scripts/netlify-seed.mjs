import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync, randomUUID } from 'node:crypto';
import { getStore } from '@netlify/blobs';

const deploy = JSON.parse(fs.readFileSync('data/netlify/database.json','utf8'));
const source=new DatabaseSync('data/fashion.sqlite',{readOnly:true});
const filename=path.resolve('data/netlify/seed.sqlite');
if(fs.existsSync(filename))throw Error('Seed fayli mavjud. Uni qo‘lda tekshiring.');
source.exec("VACUUM INTO '"+filename.replace(/'/g,"''")+"'");source.close();
const seed=new DatabaseSync(filename);
seed.exec('PRAGMA foreign_keys=ON; BEGIN IMMEDIATE;');
for(const table of ['sessions','orders','requests','wishlists','events','views','rate_limits','stock_previews','store_sales','users'])seed.exec('DELETE FROM '+table);
seed.exec("DELETE FROM variants WHERE productId IN (SELECT id FROM products WHERE json_extract(payload,'$.status')='archived'); DELETE FROM products WHERE json_extract(payload,'$.status')='archived'; UPDATE variants SET reserved=0;");
const password=randomBytes(18).toString('base64url'),salt=randomBytes(16).toString('hex');
seed.prepare('INSERT INTO users VALUES(?,?,?,?,?,?)').run(randomUUID(),'owner','Do‘kon egasi','owner',salt,scryptSync(password,salt,64).toString('hex'));
seed.exec('COMMIT;');
const references=new Set();
function collect(value){if(typeof value==='string'&&/^\/api\/media\/[a-zA-Z0-9.-]+$/.test(value))references.add(value.split('/').pop());else if(Array.isArray(value))value.forEach(collect);else if(value&&typeof value==='object')Object.values(value).forEach(collect);}
for(const table of ['products','settings','merchandising'])for(const row of seed.prepare('SELECT payload FROM '+table).all())collect(JSON.parse(row.payload));
for(const row of seed.prepare('SELECT id FROM media').all())if(!references.has(row.id))seed.prepare('DELETE FROM media WHERE id=?').run(row.id);
seed.exec('VACUUM;');
if(seed.prepare('PRAGMA integrity_check').get().integrity_check!=='ok')throw Error('Seed yaxlitligi buzilgan.');
const count=seed.prepare('SELECT COUNT(*) n FROM products').get().n;
const published=seed.prepare("SELECT COUNT(*) n FROM products WHERE json_extract(payload,'$.status')='published'").get().n;
if(count!==72||published!==36)throw Error('Demo kolleksiyasi soni mos emas.');
seed.close();
const config=JSON.parse(fs.readFileSync(path.join(process.env.APPDATA,'netlify','Config','config.json'),'utf8'));
const user=config.users[config.userId];if(user.email!=='boydullayevtolibjon2001@gmail.com')throw Error('Deploy hisobi mos emas.');
const store=getStore({name:'fashion-media',siteID:deploy.siteId,token:user.auth.token,consistency:'strong'});
for(const id of references)await store.set(id,new Uint8Array(fs.readFileSync(path.join('data/media',id))).buffer);
// The agent's Netlify database connection is read-only. Native migrations run
// with the platform's migration role; no credential or permission bypass.
const snapshot=fs.readFileSync(filename);
fs.writeFileSync('netlify/database/migrations/20261010171000_fashion_demo.sql',`-- Clean demo only. This never replaces an existing shop database.\nINSERT INTO fashion_state(id,snapshot) VALUES('main',decode('${snapshot.toString('hex')}','hex')) ON CONFLICT(id) DO NOTHING;\n`);
fs.writeFileSync('data/netlify-admin-access.txt',`Netlify demo admin\nManzil: https://fashion-shop-demo-tom.netlify.app/admin\nLogin: owner\nParol: ${password}\nUshbu faylni ochiq ulashmang. Parolni admin sozlamalaridan almashtiring.\n`);
console.log(`Cloud demo migratsiyasi tayyor: ${count} model, ${published} e’lon qilingan, ${references.size} media. Tarixiy buyurtmalar va sessiyalar ko‘chirilmagan.`);
