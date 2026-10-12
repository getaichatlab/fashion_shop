import fs from 'node:fs';
import path from 'node:path';
import {NetlifyAPI} from '@netlify/api';
const cfg=JSON.parse(fs.readFileSync(path.join(process.env.APPDATA,'netlify','Config','config.json'),'utf8'));
const user=cfg.users[cfg.userId];if(user.email!=='boydullayevtolibjon2001@gmail.com')throw Error('Netlify hisobi mos emas.');
const siteId=JSON.parse(fs.readFileSync('.netlify/state.json','utf8')).siteId;
const api=new NetlifyAPI(user.auth.token);
const accountId='boydullayevtolibjon2001';
const existing=await api.getEnvVars({accountId,siteId});
for(const [key,value] of Object.entries({FASHION_STORAGE:'netlify',AWS_LAMBDA_JS_RUNTIME:'nodejs24.x'})){
 const body={key,is_secret:false,scopes:['builds','functions','runtime','post_processing'],values:[{context:'all',value}]};
 if(existing.some(v=>v.key===key))await api.updateEnvVar({accountId,siteId,key,body});
 else await api.createEnvVars({accountId,siteId,body:[body]});
}
const verified=await api.getEnvVars({accountId,siteId});
console.log(verified.filter(v=>['FASHION_STORAGE','AWS_LAMBDA_JS_RUNTIME'].includes(v.key)).map(v=>({key:v.key,scopes:v.scopes,values:v.values.map(x=>({context:x.context,value:x.value}))})));
