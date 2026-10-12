import fs from 'node:fs';
import path from 'node:path';
import {NetlifyAPI} from '@netlify/api';
const cfg=JSON.parse(fs.readFileSync(path.join(process.env.APPDATA,'netlify','Config','config.json'),'utf8'));
const user=cfg.users[cfg.userId];if(user.email!=='boydullayevtolibjon2001@gmail.com')throw Error('Netlify hisobi mos emas.');
const siteId=JSON.parse(fs.readFileSync('.netlify/state.json','utf8')).siteId;
const api=new NetlifyAPI(user.auth.token);
const site=await api.getSite({site_id:siteId});
if(site.name!=='fashion-shop-demo-tom'||site.published_deploy?.state!=='ready')throw Error('Deploy hali tayyor emas.');
// Publish the storefront's production URL; preview deployments keep team login.
await api.updateSite({site_id:siteId,body:{sso_login:true,sso_login_context:'non_production'}});
const verified=await api.getSite({site_id:siteId});
console.log({site:verified.ssl_url,previewLogin:verified.sso_login,protectionContext:verified.sso_login_context});
