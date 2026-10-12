// Build-only transport retry; HTTPS validation and authorization stay with the original fetch.
const originalFetch=globalThis.fetch;
globalThis.fetch=async function(input,options){
 let url;try{url=new URL(typeof input==='string'?input:input.url||String(input));}catch{return originalFetch(input,options);}
 const method=(options?.method||input.method||'GET').toUpperCase();
 if(!['api.netlify.com','api.netlifysdk.com'].includes(url.hostname)||!['GET','HEAD'].includes(method))return originalFetch(input,options);
 for(let attempt=0;attempt<3;attempt++){
  try{return await originalFetch(input,options);}catch(error){
   const code=error.cause?.code||error.code;
   if(attempt===2||options?.signal?.aborted||!['UND_ERR_SOCKET','ECONNRESET','ETIMEDOUT','UND_ERR_CONNECT_TIMEOUT'].includes(code))throw error;
   console.warn('Netlify build: retrying an interrupted API read');
   await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));
  }
 }
};
