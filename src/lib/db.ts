import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { randomBytes, randomUUID, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { available, deliveryPrice, nextStatuses, validPhone, paymentsFor, whiteContrast } from './domain';
import type { Product, Settings, Order } from './types';
import { variantPrice } from './catalog';
import { databaseContext, cloudStorage } from './db-context';

export const dataDir = path.join(process.cwd(), 'data');
let database: DatabaseSync;
export function db() {
 const scoped = databaseContext.getStore();
 if(scoped)return scoped;
 if(cloudStorage()||process.env.NETLIFY==='true')throw Error('Doimiy baza konteksti talab etiladi.');
 if(database)return database;
 fs.mkdirSync(path.join(dataDir,'media'),{recursive:true});
 database=new DatabaseSync(path.join(dataDir,'fashion.sqlite'));
 database.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS products(id TEXT PRIMARY KEY,payload TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS variants(id TEXT PRIMARY KEY,productId TEXT NOT NULL REFERENCES products(id),color TEXT,hex TEXT,size TEXT,stock INTEGER NOT NULL CHECK(stock>=0),reserved INTEGER NOT NULL DEFAULT 0 CHECK(reserved>=0 AND reserved<=stock));
 CREATE TABLE IF NOT EXISTS orders(id TEXT PRIMARY KEY,token TEXT UNIQUE NOT NULL,payload TEXT NOT NULL,idempotency TEXT UNIQUE,expires INTEGER);
 CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY,payload TEXT);
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,username TEXT UNIQUE,name TEXT,role TEXT,salt TEXT,hash TEXT);
 CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,userId TEXT REFERENCES users(id),expires INTEGER);
 CREATE TABLE IF NOT EXISTS media(id TEXT PRIMARY KEY,mime TEXT,name TEXT);
 CREATE TABLE IF NOT EXISTS requests(id TEXT PRIMARY KEY,type TEXT,payload TEXT,status TEXT DEFAULT 'new',createdAt TEXT);
 CREATE TABLE IF NOT EXISTS wishlists(id TEXT PRIMARY KEY,payload TEXT,createdAt TEXT);
 CREATE TABLE IF NOT EXISTS events(id TEXT PRIMARY KEY,type TEXT,payload TEXT,createdAt TEXT);
 CREATE TABLE IF NOT EXISTS views(id TEXT PRIMARY KEY,count INTEGER DEFAULT 0,favorites INTEGER DEFAULT 0);
 CREATE TABLE IF NOT EXISTS rate_limits(key TEXT PRIMARY KEY,count INTEGER,expires INTEGER);`);
 // Additive migration: identifiers and historical orders remain intact.
 const columns=database.prepare('PRAGMA table_info(variants)').all() as any[];
 for(const [name,definition] of [['sku','TEXT'],['price','INTEGER'],['retired','INTEGER NOT NULL DEFAULT 0']])if(!columns.some(c=>c.name===name))database.exec(`ALTER TABLE variants ADD COLUMN ${name} ${definition};`);
 for(const v of database.prepare('SELECT id FROM variants WHERE sku IS NULL').all() as any[])database.prepare('UPDATE variants SET sku=? WHERE id=?').run('V-'+v.id.toUpperCase(),v.id);
 database.exec('CREATE UNIQUE INDEX IF NOT EXISTS variants_sku ON variants(sku); CREATE TABLE IF NOT EXISTS migration_versions(version INTEGER PRIMARY KEY, appliedAt TEXT);');
 database.prepare('INSERT OR IGNORE INTO migration_versions VALUES(2,?)').run(new Date().toISOString());
 if(!database.prepare('SELECT id FROM settings').get())seed();
 if(!database.prepare('SELECT id FROM users').get()){
   const password=process.env.FASHION_ADMIN_PASSWORD||randomBytes(14).toString('base64url'); const salt=randomBytes(16).toString('hex');
   database.prepare('INSERT INTO users VALUES(?,?,?,?,?,?)').run(randomUUID(),'owner','Do‘kon egasi','owner',salt,scryptSync(password,salt,64).toString('hex'));
   fs.writeFileSync(path.join(dataDir,'admin-access.txt'),`Lokal demo admin kirishi\nManzil: http://127.0.0.1:3100/admin\nLogin: owner\nParol: ${password}\nBu faylni ulashmang. Ommaviy serverga chiqarishdan oldin parolni almashtiring.\n`);
 }
 return database;
}
const defaults: Settings={name:'Fashion Shop',tagline:'Sizning uslubingiz. Sizning tanlovingiz.',phone:'+998903278950',address:'Toshkent, Fidokor ko‘chasi, 4',hours:'Har kuni 11:00 — 20:00',telegram:'https://t.me/fashion_shopuz',instagram:'',delivery:false,pickup:true,zones:'Toshkent',deliveryMode:'fixed',deliveryFee:25000,freeAbove:0,accepting:true,paymentMethods:['Do‘konda naqd','Do‘konda terminal'],reservationMinutes:60,returnPolicy:'Almashtirish shartlarini buyurtma berishdan avval sotuvchi bilan aniqlashtiring.',heroTitle:'Har kuningizga\nbir oz nafislik.',heroSubtitle:'O‘zingizga mos rang, qulay mato va sevimli siluet. Yangi mavsumni o‘z uslubingizda kutib oling.',heroImage:'/images/editorial-1.jpg',accent:'#702D43'};
function seed(){
 database.prepare('INSERT INTO settings VALUES(1,?)').run(JSON.stringify(defaults));
 const names=[['Shahar uslubidagi palto','Ustki kiyim',685000],['Minimal oq ko‘ylak','Ko‘ylaklar',425000],['Klassik bej kostyum','Kostyumlar',795000],['Yengil kundalik ko‘ylak','Ko‘ylaklar',385000],['Tuzilishli blazer','Ustki kiyim',535000],['Linen keng shim','Shimlar',335000],['Yumshoq trikotaj top','Toplar',245000],['Kuzgi kardigan','Ustki kiyim',395000],['Atlas midi ko‘ylak','Ko‘ylaklar',465000],['Klassik to‘g‘ri shim','Shimlar',315000],['Basic paxta ko‘ylak','Toplar',225000],['Nafis uzun palto','Ustki kiyim',895000],['Kundalik ikki qismli kostyum','Kostyumlar',645000],['Erkin siluetli ko‘ylak','Ko‘ylaklar',365000],['Yumshoq uzun kardigan','Ustki kiyim',435000],['Shahar uchun linen kostyum','Kostyumlar',725000],['Paxta oversize top','Toplar',195000],['Klassik midi yubka','Shimlar',285000],['Yengil mavsumiy blazer','Ustki kiyim',495000],['Minimal kundalik shim','Shimlar',295000],['Nafis oq bluzka','Toplar',345000],['Kechki midi ko‘ylak','Ko‘ylaklar',595000],['Erkin trikotaj kostyum','Kostyumlar',545000],['Yumshoq basic kardigan','Ustki kiyim',325000]];
 names.forEach((n,i)=>{
 const id=`p${i+1}`,media=[`/images/editorial-${i%6+1}.jpg`]; const product={id,slug:`model-${i+1}`,code:`FS-${String(i+1).padStart(3,'0')}`,name:n[0],category:n[1],price:n[2],oldPrice:i%4===0?Number(n[2])+80000:0,description:'Yumshoq mato, qulay bichim va sodda detallar. Kundalik garderobingiz uchun tanlangan namuna. Demo surat kiyimning haqiqiy do‘kon assortimenti emas.',fabric:i%3===0?'Paxta va viskoza':'Linen aralash mato',measurements:JSON.stringify({S:{chest:88,waist:68,length:105},M:{chest:94,waist:74,length:107},L:{chest:100,waist:80,length:109}}),status:'published',media,video:'',badge:i<4?'Yangi':i%4===0?'Taklif':'',createdAt:new Date(Date.now()-i*86400000).toISOString()};
 database.prepare('INSERT INTO products VALUES(?,?)').run(id,JSON.stringify(product));
 ['Bej','Qora'].forEach((color,c)=>['S','M','L'].forEach((size,s)=>database.prepare('INSERT INTO variants(id,productId,color,hex,size,stock,reserved,sku) VALUES(?,?,?,?,?,?,0,?)').run(`${id}-${c}-${s}`,id,color,c===0?'#b7a48a':'#222222',size,i===23?0:(i+s+c)%5===0?0:3+s,`FS-${i+1}-${c}-${size}`)));
 });
}
export function settings():Settings{return JSON.parse((db().prepare('SELECT payload FROM settings WHERE id=1').get() as any).payload);}
export function record(type:string,payload:unknown){db().prepare('INSERT INTO events VALUES(?,?,?,?)').run(randomUUID(),type,JSON.stringify(payload),new Date().toISOString());}
export function transaction<T>(fn:()=>T):T{db().exec('BEGIN IMMEDIATE');try{const value=fn();db().exec('COMMIT');return value;}catch(error){db().exec('ROLLBACK');throw error;}}
export function releaseExpired(){const rows=db().prepare('SELECT * FROM orders WHERE expires IS NOT NULL AND expires<?').all(Date.now()) as any[]; if(!rows.length)return;transaction(()=>{for(const row of rows){const order:Order=JSON.parse(row.payload);if(order.status!=='new')continue;for(const item of order.items)db().prepare('UPDATE variants SET reserved=reserved-? WHERE id=?').run(item.quantity,item.variantId);order.status='expired';order.history.push({status:'expired',at:new Date().toISOString()});db().prepare('UPDATE orders SET payload=?,expires=NULL WHERE id=?').run(JSON.stringify(order),row.id);record('order.expired',{id:row.id});}});}
function productRevision(payload:string,variants:any[]){return createHash('sha256').update(payload+JSON.stringify([...variants].sort((a,b)=>a.id.localeCompare(b.id)))).digest('hex');}
export function products(all=false):Product[]{releaseExpired();return (db().prepare('SELECT payload FROM products').all() as any[]).map(row=>{const p=JSON.parse(row.payload),variants=db().prepare('SELECT * FROM variants WHERE productId=? AND retired=0').all(p.id) as any[];p.revision=productRevision(row.payload,variants);p.variants=variants.map(v=>({...v,available:available(v.stock,v.reserved)}));return p;}).filter(p=>all||p.status==='published').sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export function saveProduct(input:any,user:any,insideTransaction=false){const write=()=>{
 if(user.role!=='owner')throw Error('Mahsulotni tahrirlash va e’lon qilish do‘kon egasiga tegishli.');
 if(!input.name?.trim()||!input.category?.trim())throw Error('Mahsulot nomi va kategoriyasini kiriting.');
 if(!Number.isSafeInteger(Number(input.price))||Number(input.price)<1000)throw Error('Narx kamida 1 000 so‘m bo‘lishi kerak.');
 if(Number(input.oldPrice)>0&&Number(input.oldPrice)<=Number(input.price))throw Error('Eski narx yangi narxdan katta bo‘lishi kerak.');
 if(!['draft','published','archived'].includes(input.status))throw Error('Mahsulot holati noto‘g‘ri.');
 if(input.status==='published'&&(!input.media?.length||!input.approved))throw Error('Suratni tekshirib tasdiqlang.');
 if(!Array.isArray(input.variants)||!input.variants.length||input.variants.length>200)throw Error('1–200 ta rang va o‘lcham kombinatsiyasi kiriting.');
 if(!Array.isArray(input.media)||input.media.length>30)throw Error('Suratlar ro‘yxati 30 tagacha bo‘lsin.');
 const old=input.id?db().prepare('SELECT payload FROM products WHERE id=?').get(input.id) as any:null;
 if(input.id&&!old)throw Error('Mahsulot topilmadi.');
 const id=input.id||randomUUID(),oldVariants=db().prepare('SELECT * FROM variants WHERE productId=?').all(id) as any[];
 if(old&&input.revision&&input.revision!==productRevision(old.payload,oldVariants.filter(v=>!v.retired)))throw Error('Mahsulot yoki qoldiq boshqa oynada o‘zgargan. Yangilab qayta tahrirlang.');
 const seen=new Set(); const variants=input.variants.map((v:any)=>{if(!v.color?.trim()||!v.size?.trim())throw Error('Rang va o‘lchamni kiriting.');const key=`${v.color.trim().toLowerCase()}-${v.size.trim().toLowerCase()}`;if(seen.has(key))throw Error('Bir xil rang va o‘lcham takrorlangan.');seen.add(key);if(!v.color?.trim()||!v.size?.trim()||!Number.isSafeInteger(Number(v.stock))||Number(v.stock)<0)throw Error('Variant va qoldiqni tekshiring.');const existing=oldVariants.find(x=>x.id===v.id);if(v.id&&!existing)throw Error('Variant boshqa mahsulotga tegishli.');if(Number(v.stock)<(existing?.reserved||0))throw Error('Qoldiq ajratilgan kiyimlar sonidan kam bo‘la olmaydi.');return {...v,id:existing?.id||randomUUID(),stock:Number(v.stock),reserved:existing?.reserved||0};});
 for(const v of variants){v.sku=String(v.sku||`V-${v.id}`).trim().toUpperCase();if(!/^[A-Z0-9_-]{3,100}$/.test(v.sku))throw Error('SKU: 3–100 ta lotin harfi, raqam, - yoki _.');if(v.price!==undefined&&v.price!==null&&v.price!==''&&(!Number.isSafeInteger(Number(v.price))||Number(v.price)<1000))throw Error('Variant narxi kamida 1 000 so‘m.');v.price=v.price===undefined||v.price===null||v.price===''?null:Number(v.price);const duplicate=db().prepare('SELECT id FROM variants WHERE sku=? AND id<>?').get(v.sku,v.id);if(duplicate||variants.filter((x:any)=>String(x.sku||'').trim().toUpperCase()===v.sku).length>1)throw Error('SKU takrorlanmasin.');if(!/^#[0-9a-f]{6}$/i.test(v.hex||'#b7a48a'))throw Error('Rang tusini tekshiring.');}
 for(const oldV of oldVariants)if(!variants.find((v:any)=>v.id===oldV.id)){if(oldV.reserved)throw Error('Buyurtmaga ajratilgan variantni olib tashlab bo‘lmaydi.');db().prepare('UPDATE variants SET retired=1 WHERE id=?').run(oldV.id);}
 const original=old?JSON.parse(old.payload):{};const p={...original,id,slug:original.slug||id,code:input.code||`FS-${id.slice(0,6).toUpperCase()}`,name:String(input.name).slice(0,200),category:String(input.category).slice(0,80),price:Number(input.price),oldPrice:Number(input.oldPrice)||0,description:String(input.description||'').slice(0,5000),fabric:String(input.fabric||'').slice(0,300),measurements:input.measurements||'{}',status:input.status,media:input.media,video:input.video||'',badge:input.badge||'',createdAt:original.createdAt||new Date().toISOString()};
 Object.assign(p,{fit:String(input.fit||'').slice(0,80),season:String(input.season||'').slice(0,80),occasions:Array.isArray(input.occasions)?input.occasions.filter((x:any)=>typeof x==='string').slice(0,10):[],collections:Array.isArray(input.collections)?input.collections.filter((x:any)=>typeof x==='string').slice(0,10):[],colorMedia:input.colorMedia||{},isDemo:Boolean(input.isDemo)});
 const links=(p as any).colorMedia;if(!links||Array.isArray(links)||typeof links!=='object'||Object.values(links).some((urls:any)=>!Array.isArray(urls)||urls.some((url:any)=>!p.media.includes(url))))throw Error('Rangga biriktirilgan surat mahsulot galereyasida bo‘lsin.');
 const measurements=JSON.parse(p.measurements);if(!measurements||Array.isArray(measurements)||typeof measurements!=='object'||Object.values(measurements).some((row:any)=>!row||typeof row!=='object'||Object.values(row).some((v:any)=>v!==null&&(typeof v!=='number'||!Number.isFinite(v)||v<=0||v>500))))throw Error('Kiyim o‘lchovlari 0–500 sm oralig‘ida bo‘lsin.');for(const url of [...p.media,...(p.video?[p.video]:[])])if(!/^\/(images\/[a-zA-Z0-9.-]+|api\/media\/[a-zA-Z0-9.-]+)$/.test(url))throw Error('Media havolasi noto‘g‘ri.');
 db().prepare('INSERT INTO products VALUES(?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload').run(id,JSON.stringify(p));
 for(const v of variants){db().prepare('INSERT INTO variants(id,productId,color,hex,size,stock,reserved,sku,price) VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET color=excluded.color,hex=excluded.hex,size=excluded.size,stock=excluded.stock,sku=excluded.sku,price=excluded.price,retired=0').run(v.id,id,v.color,v.hex||'#b7a48a',v.size,v.stock,v.reserved,v.sku,v.price);const before=oldVariants.find(x=>x.id===v.id)?.stock||0;if(before!==v.stock)record('stock.adjusted',{variantId:v.id,sku:v.sku,before,after:v.stock,delta:v.stock-before,reason:'Mahsulot formasida tahrir',user:user.id,isDemo:(p as any).isDemo});}
 record('product.saved',{id,user:user.id,status:p.status});return id;
 };return insideTransaction?write():transaction(write);}
export function createOrder(input:any,key:string):Order{
 releaseExpired(); return transaction(()=>{
 const previous=db().prepare('SELECT payload FROM orders WHERE idempotency=?').get(key) as any;if(previous)return JSON.parse(previous.payload);
 const s=settings();if(!s.accepting)throw Error('Hozir buyurtmalar vaqtincha qabul qilinmayapti.');
 if(!input.customer?.trim()||!validPhone(input.phone||''))throw Error('Ism va +998 formatidagi telefonni kiriting.');
 if(input.method==='pickup'&&!s.pickup||input.method==='delivery'&&!s.delivery||!['pickup','delivery'].includes(input.method))throw Error('Tanlangan olish usuli mavjud emas.');
 if(input.method==='delivery'&&(!input.address?.trim()||!s.zones.split(',').map(x=>x.trim()).includes(input.zone)))throw Error('Yetkazish hududi va manzilini tekshiring.');
 if(!paymentsFor(input.method,s.paymentMethods).includes(input.payment))throw Error('Olish usuliga mos to‘lovni tanlang.');
 if(!Array.isArray(input.items)||!input.items.length||input.items.length>30)throw Error('Savatchani tekshiring.');
 const ids=new Set();let subtotal=0;const items=input.items.map((line:any)=>{if(ids.has(line.variantId))throw Error('Variant takrorlangan.');ids.add(line.variantId);if(!Number.isSafeInteger(line.quantity)||line.quantity<1||line.quantity>20)throw Error('Miqdorni tekshiring.');const row=db().prepare('SELECT v.*,p.payload FROM variants v JOIN products p ON p.id=v.productId WHERE v.id=? AND v.productId=? AND v.retired=0').get(line.variantId,line.productId) as any;if(!row)throw Error('Kiyim varianti topilmadi.');const p=JSON.parse(row.payload);if(p.status!=='published'||available(row.stock,row.reserved)<line.quantity)throw Error(`${p.name}: tanlangan o‘lcham yetarli emas.`);const price=variantPrice(p,row);if(line.price!==price)throw Error(`${p.name}: narx o‘zgargan. Savatchani yangilang.`);subtotal+=price*line.quantity;return {productId:p.id,variantId:row.id,name:p.name,code:p.code,isDemo:Boolean(p.isDemo)||/^QA|test/i.test(p.name),color:row.color,size:row.size,image:p.colorMedia?.[row.color]?.[0]||p.media[0],price,quantity:line.quantity};});
 const fee=deliveryPrice(subtotal,input.method,s),now=new Date().toISOString(),expires=Date.now()+s.reservationMinutes*60000;
 const order:Order={id:`FS-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`,token:randomBytes(24).toString('base64url'),customer:input.customer.trim().slice(0,100),phone:input.phone.replace(/[\s()-]/g,''),method:input.method,address:input.method==='delivery'?String(input.address).slice(0,500):'',zone:input.method==='delivery'?input.zone:'',payment:input.payment,note:String(input.note||'').slice(0,1000),status:'new',paymentStatus:'unpaid',subtotal,fee,total:subtotal+(fee??0),items,isDemo:items.some((x:any)=>x.isDemo),history:[{status:'new',at:now}],createdAt:now,reservedUntil:new Date(expires).toISOString()};
 for(const item of items)db().prepare('UPDATE variants SET reserved=reserved+? WHERE id=?').run(item.quantity,item.variantId);
 db().prepare('INSERT INTO orders VALUES(?,?,?,?,?)').run(order.id,order.token,JSON.stringify(order),key,expires);record('order.created',{id:order.id});return order;
 });}
export function orders(){releaseExpired();return (db().prepare('SELECT payload FROM orders ORDER BY rowid DESC').all() as any[]).map(row=>JSON.parse(row.payload)) as Order[];}
export function updateOrder(id:string,input:any,user:any){releaseExpired();return transaction(()=>{
 const row=db().prepare('SELECT payload FROM orders WHERE id=?').get(id) as any;if(!row)throw Error('Buyurtma topilmadi.');const o:Order=JSON.parse(row.payload);
 if(input.status&&input.status!==o.status){if(!nextStatuses(o.method,o.status).includes(input.status))throw Error('Bu holatga o‘tish mumkin emas.');
 if(['cancelled','completed'].includes(input.status))for(const item of o.items){if(input.status==='completed'){const v=db().prepare('SELECT stock,sku FROM variants WHERE id=?').get(item.variantId) as any;db().prepare('UPDATE variants SET stock=stock-?,reserved=reserved-? WHERE id=?').run(item.quantity,item.quantity,item.variantId);record('stock.order',{variantId:item.variantId,sku:v.sku,before:v.stock,after:v.stock-item.quantity,delta:-item.quantity,orderId:o.id,user:user.id,reason:'Onlayn buyurtma yakunlandi',isDemo:Boolean(o.isDemo)});}else db().prepare('UPDATE variants SET reserved=reserved-? WHERE id=?').run(item.quantity,item.variantId);}
 o.status=input.status;o.history.push({status:o.status,at:new Date().toISOString(),by:user.name});}
 if(input.paymentStatus){if(!['unpaid','paid','refunded'].includes(input.paymentStatus))throw Error('To‘lov holati noto‘g‘ri.');o.paymentStatus=input.paymentStatus;}
 if(input.fee!==undefined){if(o.method!=='delivery'||!['new','confirmed','preparing'].includes(o.status)||!Number.isSafeInteger(input.fee)||input.fee<0)throw Error('Yetkazish narxini tekshiring.');o.fee=input.fee;o.total=o.subtotal+input.fee;}
 db().prepare('UPDATE orders SET payload=?,expires=? WHERE id=?').run(JSON.stringify(o),o.status==='new'?Date.parse(o.reservedUntil):null,id);record('order.updated',{id,user:user.id,status:o.status});return o;
 });}
export function sale(variantId:string,quantity:number,user:any){releaseExpired();return transaction(()=>{const v=db().prepare('SELECT * FROM variants WHERE id=?').get(variantId) as any;if(!v||!Number.isSafeInteger(quantity)||quantity<1||available(v.stock,v.reserved)<quantity)throw Error('Sotuv uchun qoldiq yetarli emas.');const p=JSON.parse((db().prepare('SELECT payload FROM products WHERE id=?').get(v.productId) as any).payload);db().prepare('UPDATE variants SET stock=stock-? WHERE id=?').run(quantity,variantId);record('store.sale',{variantId,quantity,amount:p.price*quantity,user:user.id});});}
export function saveSettings(input:any,user:any){
 if(user.role!=='owner')throw Error('Bu amal faqat do‘kon egasiga ruxsat etilgan.');
 const current=settings();const s:any={...current};for(const key of Object.keys(current))if(input[key]!==undefined)s[key]=input[key];
 for(const key of ['pickup','delivery','accepting'])if(typeof s[key]!=='boolean')throw Error('Olish sozlamalarini tekshiring.');
 if(!s.pickup&&!s.delivery&&s.accepting)throw Error('Kamida bitta olish usuli yoqilgan bo‘lishi kerak.');
 const allowed=['Do‘konda naqd','Do‘konda terminal','Yetkazishda naqd','Sotuvchi bilan kelishiladi'];
 if(!Array.isArray(s.paymentMethods)||!s.paymentMethods.length||s.paymentMethods.some((x:any)=>!allowed.includes(x)))throw Error('To‘lov usullarini tekshiring.');
 if(s.accepting&&s.pickup&&!paymentsFor('pickup',s.paymentMethods).length)throw Error('Olib ketish uchun mos to‘lov usulini tanlang.');
 if(s.accepting&&s.delivery&&!paymentsFor('delivery',s.paymentMethods).length)throw Error('Yetkazish uchun mos to‘lov usulini tanlang.');
 for(const n of ['deliveryFee','freeAbove','reservationMinutes']){s[n]=Number(s[n]);if(!Number.isSafeInteger(s[n])||s[n]<0)throw Error('Raqamli sozlamalarni tekshiring.');}
 if(s.reservationMinutes<5||s.reservationMinutes>1440)throw Error('Ajratish muddati 5–1440 daqiqa.');
 if(!['fixed','quote'].includes(s.deliveryMode)||typeof s.zones!=='string'||s.delivery&&!s.zones.trim())throw Error('Yetkazish hududi va narx turini tekshiring.');
 if(typeof s.name!=='string'||!s.name.trim()||s.name.length>100||!validPhone(s.phone||''))throw Error('Do‘kon nomi va telefonini tekshiring.');
 if(!/^#[0-9a-f]{6}$/i.test(s.accent)||whiteContrast(s.accent)<4.5)throw Error('Oq matn o‘qilishi uchun to‘q aksent rang tanlang.');
 if(!/^\/(images\/[a-zA-Z0-9.-]+|api\/media\/[a-zA-Z0-9.-]+)$/.test(s.heroImage))throw Error('Banner surati noto‘g‘ri.');
 for(const link of ['telegram','instagram'])if(s[link]&&!/^https:\/\/(t\.me|www\.instagram\.com|instagram\.com)\//.test(s[link]))throw Error('Ijtimoiy havolani tekshiring.');
 db().prepare('UPDATE settings SET payload=? WHERE id=1').run(JSON.stringify(s));record('settings.updated',{user:user.id});return s;
}
export function rateLimit(key:string,max=30,ms=60000){const row=db().prepare('SELECT * FROM rate_limits WHERE key=?').get(key) as any;if(row&&row.expires>Date.now()&&row.count>=max)throw Error('Juda ko‘p urinish. Biroz kutib qayta urinib ko‘ring.');db().prepare('INSERT INTO rate_limits VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET count=excluded.count,expires=excluded.expires').run(key,row&&row.expires>Date.now()?row.count+1:1,row&&row.expires>Date.now()?row.expires:Date.now()+ms);}
export function login(username:string,password:string){rateLimit(`login:${username}`,8,15*60000);const u=db().prepare('SELECT * FROM users WHERE username=?').get(username) as any;const salt=u?.salt||'invalid';const candidate=scryptSync(password||'',salt,64);if(!u||!timingSafeEqual(candidate,Buffer.from(u.hash,'hex')))throw Error('Login yoki parol noto‘g‘ri.');db().prepare('DELETE FROM rate_limits WHERE key=?').run('login:'+username);const token=randomBytes(32).toString('base64url');db().prepare('INSERT INTO sessions VALUES(?,?,?)').run(createHash('sha256').update(token).digest('hex'),u.id,Date.now()+12*3600000);return token;}
export function session(token:string){if(!token)return null;const u=db().prepare('SELECT u.id,u.name,u.username,u.role FROM sessions s JOIN users u ON u.id=s.userId WHERE s.token=? AND s.expires>?').get(createHash('sha256').update(token).digest('hex'),Date.now());return u as any;}
export function logout(token:string){db().prepare('DELETE FROM sessions WHERE token=?').run(createHash('sha256').update(token).digest('hex'));}
export function staff(){return db().prepare('SELECT id,username,name,role FROM users').all();}
export function addStaff(input:any,user:any){if(user.role!=='owner')throw Error('Ruxsat yo‘q.');if(!/^[a-z0-9_]{3,30}$/.test(input.username)||input.password?.length<12||!input.name)throw Error('Login kamida 3 belgi, parol kamida 12 belgi va ism kerak.');const salt=randomBytes(16).toString('hex');db().prepare('INSERT INTO users VALUES(?,?,?,?,?,?)').run(randomUUID(),input.username,input.name,'seller',salt,scryptSync(input.password,salt,64).toString('hex'));record('staff.created',{username:input.username,user:user.id});}
export function changePassword(password:string,user:any){if(password.length<12)throw Error('Parol kamida 12 belgi bo‘lsin.');const salt=randomBytes(16).toString('hex');db().prepare('UPDATE users SET salt=?,hash=? WHERE id=?').run(salt,scryptSync(password,salt,64).toString('hex'),user.id);db().prepare('DELETE FROM sessions WHERE userId=?').run(user.id);}
