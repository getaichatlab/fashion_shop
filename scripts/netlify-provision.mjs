import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {NetlifyAPI} from '@netlify/api';
const run = promisify(execFile);
const config = JSON.parse(fs.readFileSync(path.join(process.env.APPDATA, 'netlify', 'Config', 'config.json'), 'utf8'));
const user = config.users[config.userId];
if (user.email !== 'boydullayevtolibjon2001@gmail.com') throw Error('Deploy hisobi mos emas.');
const siteId = JSON.parse(fs.readFileSync('.netlify/state.json', 'utf8')).siteId;
if (siteId !== '33a83608-582b-4581-8290-52f6960a53d9') throw Error('Loyiha ID mos emas.');
const { stdout } = await run('curl.exe', ['--silent','--show-error','--max-time','60','--retry','2','--request','POST','--header',`Authorization: Bearer ${user.auth.token}`,'--header','Content-Type: application/json','--data','{}',`https://api.netlify.com/api/v1/sites/${siteId}/database`], {maxBuffer:1024*1024});
const created = JSON.parse(stdout);
if(!created.connection_string)throw Error('Database yaratilmadi.');
const result = await new NetlifyAPI(user.auth.token).getSiteDatabase({site_id:siteId,role:'netlifydb_owner'});
if (!result.connection_string) { console.log('Database response fields:', Object.keys(result)); throw Error('Database ulanishi tayyor emas.'); }
fs.mkdirSync('data/netlify', {recursive:true});
fs.writeFileSync('data/netlify/database.json', JSON.stringify({siteId,connectionString:result.connection_string}));
console.log('Netlify Database tayyor. Ulanish ma’lumoti faqat data/netlify/database.json faylida saqlandi.');
