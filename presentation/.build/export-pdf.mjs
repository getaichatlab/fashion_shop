import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import sharp from 'sharp';
import {PDFDocument,PDFName,PDFString,PDFArray} from 'pdf-lib';
const root='D:/fr_sayt/fashion_shop/presentation';
const build=path.join(root,'.build');
const pdf=await PDFDocument.create();
pdf.setTitle('Fashion Shop — Kiyim do‘koni uchun veb sayt va boshqaruv');
pdf.setSubject('Biznesga foyda, sayt, admin panel, rasm studiyasi, Telegram bosqichi va taklif');
pdf.setAuthor('Fashion Shop');pdf.setLanguage('uz-UZ');
const link=(page,x,y,w,h,url)=>{
 const a=pdf.context.obj({Type:'Annot',Subtype:'Link',Rect:[x*.75,(720-y-h)*.75,(x+w)*.75,(720-y)*.75],Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of(url)}});
 const ref=pdf.context.register(a);
 const existing=page.node.lookupMaybe(PDFName.of('Annots'),PDFArray);
 if(existing)existing.push(ref);else page.node.set(PDFName.of('Annots'),pdf.context.obj([ref]));
};
for(let i=1;i<=6;i++){
 const page=pdf.addPage([960,540]);
 const png=await pdf.embedPng(await fs.readFile(path.join(build,`slide-${i}.png`)));
 page.drawImage(png,{x:0,y:0,width:960,height:540});
 if(i===6){
  link(page,838,130,380,250,'https://fashion-shop-demo-tom.netlify.app');
  link(page,838,402,380,270,'https://fashion-shop-demo-tom.netlify.app/admin');
  link(page,64,631,735,30,'https://www.cbu.uz/en/arkhiv-kursov-valyut/');
 }
}
const output=path.join(root,'output/Fashion_Shop_Taqdimot.pdf');
await fs.writeFile(output,await pdf.save());

const projectRequire=createRequire('D:/fr_sayt/fashion_shop/package.json');
const QRCode=projectRequire('qrcode');
const src=await sharp(path.join(build,'slide-6.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const pixel=(x,y)=>{const k=(Math.floor(y)*src.info.width+Math.floor(x))*4;return (src.data[k]+src.data[k+1]+src.data[k+2])/3<140;};
const checks=[];
for(const [kind,url,x,y] of [['site','https://fashion-shop-demo-tom.netlify.app',846,139],['admin','https://fashion-shop-demo-tom.netlify.app/admin',846,411]]){
 const qr=QRCode.create(url,{errorCorrectionLevel:'M'});const size=qr.modules.size;
 let mismatch=0;
 for(let r=0;r<size;r++)for(let c=0;c<size;c++){
  const actual=pixel((x+(c+4.5)*185/(size+8))*1.5,(y+(r+4.5)*185/(size+8))*1.5);
  if(actual!==!!qr.modules.data[r*size+c])mismatch++;
 }
 checks.push({kind,url,moduleCount:size,mismatch,passed:mismatch===0});
}
await fs.writeFile(path.join(build,'qr-validation.json'),JSON.stringify(checks,null,2));
if(checks.some(c=>!c.passed))throw Error('Rendered QR matrix mismatch');
console.log(JSON.stringify({pdf:output,pages:6,links:3,qr:checks}));
