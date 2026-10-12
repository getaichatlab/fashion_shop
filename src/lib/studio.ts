export type StudioRect = {x:number;y:number;width:number;height:number};
export type StudioDocument = {pixels:ImageData;alpha:Uint8Array;seeds:Uint8Array;rectangle:StudioRect|null};
export type Composition = {background:string;backgroundSrc:string;format:string;caption:boolean;shadow:number;scale:number;x:number;y:number;feather:number;trim:number};
export const defaultComposition:Composition={background:'white',backgroundSrc:'',format:'catalog',caption:false,shadow:12,scale:100,x:0,y:0,feather:1,trim:0};
export function cloneDocument(d:StudioDocument):StudioDocument{return {pixels:d.pixels,alpha:d.alpha.slice(),seeds:d.seeds.slice(),rectangle:d.rectangle?{...d.rectangle}:null};}
export function blurAlpha(source:Uint8Array,w:number,h:number,radius:number){
 if(!radius)return source.slice();const r=Math.max(1,Math.round(radius)),span=2*r+1,tmp=new Float32Array(source.length),out=new Uint8Array(source.length);
 for(let y=0;y<h;y++){let sum=0;for(let x=-r;x<=r;x++)sum+=source[y*w+Math.max(0,Math.min(w-1,x))];for(let x=0;x<w;x++){tmp[y*w+x]=sum/span;sum+=source[y*w+Math.min(w-1,x+r+1)]-source[y*w+Math.max(0,x-r)];}}
 for(let x=0;x<w;x++){let sum=0;for(let y=-r;y<=r;y++)sum+=tmp[Math.max(0,Math.min(h-1,y))*w+x];for(let y=0;y<h;y++){out[y*w+x]=Math.round(sum/span);sum+=tmp[Math.min(h-1,y+r+1)*w+x]-tmp[Math.max(0,y-r)*w+x];}}
 return out;
}
export function preparedPixels(d:StudioDocument,feather:number,trim:number){
 const {width:w,height:h,data}=d.pixels;let a=d.alpha;
 if(trim)a=adjustAlphaEdge(a,w,h,trim);
 a=blurAlpha(a,w,h,feather);const output=new ImageData(new Uint8ClampedArray(data),w,h);
 for(let i=0;i<a.length;i++)output.data[i*4+3]=Math.round(data[i*4+3]*a[i]/255);
 return output;
}
// Erode/dilate only the mask. The garment's RGB pixels are never recolored.
export function adjustAlphaEdge(source:Uint8Array,w:number,h:number,trim:number){
 const radius=Math.min(4,Math.abs(Math.round(trim)));
 if(!radius)return source.slice();
 const shrink=trim>0,tmp=new Uint8Array(source.length),out=new Uint8Array(source.length);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  let value=shrink?255:0;
  for(let dx=-radius;dx<=radius;dx++){
   const next=source[y*w+Math.max(0,Math.min(w-1,x+dx))];
   value=shrink?Math.min(value,next):Math.max(value,next);
  }
  tmp[y*w+x]=value;
 }
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  let value=shrink?255:0;
  for(let dy=-radius;dy<=radius;dy++){
   const next=tmp[Math.max(0,Math.min(h-1,y+dy))*w+x];
   value=shrink?Math.min(value,next):Math.max(value,next);
  }
  out[y*w+x]=value;
 }
 return out;
}
// Optional cleanup: protect the largest silhouette and every green-marked part.
// Eight-way connectivity preserves diagonal straps. Two passes bound memory use.
export function cleanAlphaIslands(source:Uint8Array,seeds:Uint8Array,w:number,h:number,ratio=.002){
 const total=w*h;
 if(source.length!==total||seeds.length!==total)throw Error('Niqob o‘lchami noto‘g‘ri.');
 const seen=new Uint8Array(total),queue=new Int32Array(total),alpha=source.slice();
 const threshold=Math.max(1,Math.floor(total*Math.max(0,Math.min(.01,ratio))));
 let largestStart=-1,largestSize=0,removedPixels=0,removedComponents=0;
 function collect(start:number){
  let head=0,tail=1,protectedPart=false;queue[0]=start;seen[start]=1;
  while(head<tail){
   const i=queue[head++],x=i%w,y=Math.floor(i/w);
   if(seeds[i]===1)protectedPart=true;
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
    if(!dx&&!dy)continue;const nx=x+dx,ny=y+dy;
    if(nx<0||nx>=w||ny<0||ny>=h)continue;const j=ny*w+nx;
    if(!seen[j]&&source[j]>0){seen[j]=1;queue[tail++]=j;}
   }
  }
  return {size:tail,protectedPart};
 }
 for(let i=0;i<total;i++)if(source[i]&&!seen[i]){
  const {size}=collect(i);if(size>largestSize){largestSize=size;largestStart=i;}
 }
 seen.fill(0);
 for(let i=0;i<total;i++)if(source[i]&&!seen[i]){
  const part=collect(i);
  if(i!==largestStart&&!part.protectedPart&&part.size<=threshold){
   for(let j=0;j<part.size;j++)alpha[queue[j]]=0;
   removedPixels+=part.size;removedComponents++;
  }
 }
 return {alpha,removedPixels,removedComponents};
}
export function alphaBounds(image:ImageData):StudioRect|null{
 let x0=image.width,y0=image.height,x1=-1,y1=-1;
 for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)if(image.data[(y*image.width+x)*4+3]>12){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
 return x1<0?null:{x:x0,y:y0,width:x1-x0+1,height:y1-y0+1};
}
export function brushStroke(d:StudioDocument,from:{x:number;y:number},to:{x:number;y:number},radius:number,hardness:number,keep:boolean){
 const w=d.pixels.width,h=d.pixels.height,dist=Math.hypot(to.x-from.x,to.y-from.y),steps=Math.max(1,Math.ceil(dist/Math.max(1,radius*.3)));
 for(let step=0;step<=steps;step++){const cx=from.x+(to.x-from.x)*step/steps,cy=from.y+(to.y-from.y)*step/steps;
 for(let y=Math.max(0,Math.floor(cy-radius));y<Math.min(h,Math.ceil(cy+radius));y++)for(let x=Math.max(0,Math.floor(cx-radius));x<Math.min(w,Math.ceil(cx+radius));x++){
 const distance=Math.hypot(x-cx,y-cy)/radius;if(distance>1)continue;
 const amount=distance<=hardness?1:Math.max(0,(1-distance)/Math.max(.01,1-hardness)),i=y*w+x;
 d.alpha[i]=Math.round(keep?d.alpha[i]+(255-d.alpha[i])*amount:d.alpha[i]*(1-amount));if(amount>.75)d.seeds[i]=keep?1:2;
 }}
}
export function rectangleBetween(a:{x:number;y:number},b:{x:number;y:number}):StudioRect{return {x:Math.min(a.x,b.x),y:Math.min(a.y,b.y),width:Math.abs(a.x-b.x),height:Math.abs(a.y-b.y)};}
export function transformDocument(d:StudioDocument,crop:StudioRect|null):StudioDocument{
 const old=d.pixels,w=crop?Math.round(crop.width):old.height,h=crop?Math.round(crop.height):old.width;
 const pixels=new ImageData(w,h),alpha=new Uint8Array(w*h),seeds=new Uint8Array(w*h);
 if(crop){for(let y=0;y<h;y++)for(let x=0;x<w;x++){const from=(crop.y+y)*old.width+crop.x+x,to=y*w+x;pixels.data.set(old.data.subarray(from*4,from*4+4),to*4);alpha[to]=d.alpha[from];seeds[to]=d.seeds[from];}}
 else{for(let y=0;y<old.height;y++)for(let x=0;x<old.width;x++){const from=y*old.width+x,to=x*w+(w-1-y);pixels.data.set(old.data.subarray(from*4,from*4+4),to*4);alpha[to]=d.alpha[from];seeds[to]=d.seeds[from];}}
 let rectangle:StudioRect|null=null;if(d.rectangle){const r=d.rectangle;if(crop){const x=Math.max(r.x,crop.x),y=Math.max(r.y,crop.y),right=Math.min(r.x+r.width,crop.x+w),bottom=Math.min(r.y+r.height,crop.y+h);if(right-x>=8&&bottom-y>=8)rectangle={x:x-crop.x,y:y-crop.y,width:right-x,height:bottom-y};}else rectangle={x:old.height-r.y-r.height,y:r.x,width:r.height,height:r.width};}
 return {pixels,alpha,seeds,rectangle};
}
export function outputSize(format:string){return format==='story'?[1080,1920]:format==='square'?[1080,1080]:[1200,1500];}
function cover(ctx:CanvasRenderingContext2D,img:HTMLImageElement,w:number,h:number){const k=Math.max(w/img.width,h/img.height);ctx.drawImage(img,(w-img.width*k)/2,(h-img.height*k)/2,img.width*k,img.height*k);}
function textLines(ctx:CanvasRenderingContext2D,text:string,x:number,y:number,width:number,lineHeight:number,maxLines:number){
 const words=text.split(/\s+/);let line='',lineNo=0;for(let i=0;i<words.length;i++){const candidate=line?line+' '+words[i]:words[i];if(ctx.measureText(candidate).width>width&&line){ctx.fillText(line,x,y+lineNo*lineHeight,width);lineNo++;line=words[i];if(lineNo===maxLines-1){const remaining=[line,...words.slice(i+1)].join(' ');let short=remaining;while(short.length&&ctx.measureText(short+'…').width>width)short=short.slice(0,-1);ctx.fillText(short+(short!==remaining?'…':''),x,y+lineNo*lineHeight,width);return;}}else line=candidate;}if(lineNo<maxLines)ctx.fillText(line,x,y+lineNo*lineHeight,width);
}
export function compose(cutout:HTMLCanvasElement,bounds:StudioRect|null,c:Composition,brand:{name:string;accent:string},product:{name?:string;price?:number},backgroundImage?:HTMLImageElement){
 const out=document.createElement('canvas');[out.width,out.height]=outputSize(c.format);const ctx=out.getContext('2d')!,w=out.width,h=out.height;
 if(c.background==='custom'&&backgroundImage)cover(ctx,backgroundImage,w,h);
 else if(c.background==='gradient'){const g=ctx.createRadialGradient(w*.48,h*.37,30,w*.5,h*.6,h*.8);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#cfc8bc');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
 else if(c.background==='brand'){ctx.fillStyle='#f1e9e6';ctx.fillRect(0,0,w,h);ctx.fillStyle=brand.accent;ctx.fillRect(w*.78,0,w*.22,h);ctx.globalAlpha=.06;ctx.beginPath();ctx.arc(w*.2,h*.8,w*.6,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
 else if(c.background!=='transparent'){ctx.fillStyle=c.background==='warm'?'#f5f2ed':'#ffffff';ctx.fillRect(0,0,w,h);}
 const r=bounds||{x:0,y:0,width:cutout.width,height:cutout.height},margin=w*.085,top=c.caption?160:margin,bottom=c.caption?235:margin;
 const fit=Math.min((w-margin*2)/r.width,(h-top-bottom)/r.height)*c.scale/100,dw=r.width*fit,dh=r.height*fit,x=(w-dw)/2+w*c.x/100,y=top+(h-top-bottom-dh)/2+h*c.y/100;
 ctx.save();if(c.shadow){ctx.shadowColor=`rgba(20,17,14,${c.shadow/100})`;ctx.shadowBlur=w*.028;ctx.shadowOffsetX=w*.008;ctx.shadowOffsetY=h*.014;}ctx.drawImage(cutout,r.x,r.y,r.width,r.height,x,y,dw,dh);ctx.restore();
 if(c.caption){ctx.fillStyle='rgba(255,255,255,.96)';ctx.fillRect(0,0,w,140);ctx.fillRect(0,h-205,w,205);ctx.fillStyle='#211f1d';ctx.font='500 46px Georgia';textLines(ctx,brand.name,margin,95,w-margin*2,48,1);ctx.font='32px Arial';textLines(ctx,product.name||'Yangi mahsulot',margin,h-160,w-margin*2,42,2);ctx.font='bold 40px Arial';ctx.fillText(new Intl.NumberFormat('uz-UZ').format(product.price||0)+' so‘m',margin,h-60,w-margin*2);}
 return {canvas:out,clipped:x<0||y<(c.caption?140:0)||x+dw>w||y+dh>(c.caption?h-205:h)};
}
