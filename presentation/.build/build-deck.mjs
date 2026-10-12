import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';

const root='D:/fr_sayt/fashion_shop';
const workspaceDir=path.join(root,'presentation');
const build=path.join(workspaceDir,'.build');
const assets=path.join(build,'assets');
const output=path.join(workspaceDir,'output');
const SKILL_DIR='C:/Users/Administrator/.codex/plugins/cache/openai-primary-runtime/presentations/26.1009.11318/skills/presentations';
const RUNTIME_PYTHON='C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
process.env.RUNTIME_NODE_MODULES='C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules';
const base='https://fashion-shop-demo-tom.netlify.app';
const p=Presentation.create({slideSize:{width:1280,height:720}});
const C={paper:'#F6F0E7',ink:'#261A20',wine:'#622C46',muted:'#655A5C',white:'#FFF9F2',dark:'#262326',gold:'#DAB8A1'};
const text=(s,value,x,y,w,h,size=24,color=C.ink,opt={})=>{
 const sh=s.shapes.add({geometry:'textbox',name:opt.name||String(value).slice(0,70),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 sh.text=value;
 sh.text.style={typeface:opt.serif?'Georgia':'Arial',fontSize:size,color,autoFit:'none',wrap:'square',insets:0,verticalAlignment:'top',bold:!!opt.bold,italic:!!opt.italic,...(opt.align?{alignment:opt.align}:{})};
 if(opt.link)sh.text.get(String(value)).link={uri:opt.link,isExternal:true};
 return sh;
};
const img=async(s,name,x,y,w,h,fit='contain',alt=name)=>{
 const b=await fs.readFile(path.join(assets,name));
 return s.images.add({blob:b,contentType:/\.png$/.test(name)?'image/png':'image/jpeg',alt,fit,position:{left:x,top:y,width:w,height:h}});
};
const slide=(bg=C.paper)=>{const s=p.slides.add();s.background.fill=bg;return s;};
const folio=(s,n,dark=false)=>text(s,String(n).padStart(2,'0')+' / 06',1151,671,80,25,17,dark?C.gold:C.muted,{align:'right'});
const block=(s,title,body,x,y,w,dark=false)=>{
 text(s,title,x,y,w,34,27,dark?C.white:C.ink,{bold:true});
 text(s,body,x,y+43,w,70,23,dark?'#E6DAD4':C.muted);
};
const creditManifest=JSON.parse(await fs.readFile(path.join(root,'docs/UZ_CATALOG_ASSETS.json'),'utf8'));
const photoCredit=file=>{const v=creditManifest.find(x=>x.file===file);return v?`Foto: ${v.author}. ${v.source}. Unsplash License.`:'';};
const common='Namoyishdagi suratlar va assortiment demo namuna. Haqiqiy do‘kon mahsulotlari, narxlari, qoldig‘i va kontaktlari egasi bilan moslashtiriladi. Sayt va admin panel tayyor. Telegram bot demo tasdiqlangach paket doirasida ishlab chiqilib ulanadi.';

// 1. Fashion editorial cover with concrete owner benefits.
{
 const s=slide();
 await img(s,'cover-photo.jpg',744,0,536,720,'cover','Fashion Shop namunaviy moviy uzun ko‘ylak surati');
 text(s,'Fashion Shop',62,57,600,59,44,C.wine,{serif:true,italic:true});
 text(s,'Kiyim do‘koningiz\nuchun onlayn\nvitrina',62,165,655,276,69,C.ink,{serif:true});
 text(s,'Veb sayt, boshqaruv paneli\nva Telegram xabarnomalari',66,478,605,72,27,C.wine);
 text(s,'Mijoz narx va o‘lchamni oldindan ko‘radi.\nSotuvchingiz bir xil savollarga\nkamroq vaqt sarflaydi.',66,575,610,105,23,C.muted);
 s.speakerNotes.text=common+'\n'+photoCredit('uz-style-01.jpg')+'\nLoyiha: '+base;
}

// 2. Real storefront screenshot and the customer journey.
{
 const s=slide();
 text(s,'Mijoz uchun qulay tanlov',58,50,1160,68,47,C.ink,{serif:true});
 await img(s,'catalog.png',48,149,764,488,'contain','Saytning haqiqiy katalogi: suratlar, filtrlar va mavjud kiyimlar');
 block(s,'Kiyimni tez topadi','Kategoriya, rang, o‘lcham va budjet\nbo‘yicha saralaydi.',857,158,365);
 block(s,'Ma’lumotni oldindan ko‘radi','Surat, narx, mato, variantlar\nva mavjud qoldiq bir joyda.',857,291,365);
 block(s,'Mos variantni tanlaydi','Taqqoslash, sevimlilar, tayyor\nobrazlar va uslub tanlash.',857,424,365);
 text(s,'Savatcha va buyurtma',857,561,365,35,27,C.ink,{bold:true});
 text(s,'Olib ketish yoki yetkazish\ndo‘kon qoidalariga mos ishlaydi.',857,601,365,63,23,C.muted);
 text(s,'Telefon va kompyuterga mos. Demo katalogda 36 ta namuna model.',58,660,1020,28,18,C.muted);
 folio(s,2);
 s.speakerNotes.text='Funksiyalar manbasi: docs/ADMIN_GUIDE_V2.md, docs/UZ_MARKET_UPDATE.md va tayyor loyiha. Ekran tasviri shu loyihaning lokal ishlab turgan nusxasidan, haqiqiy interfeys. Mahsulotni buyurtmadan oldin variant va qoldiq bo‘yicha tekshiradi. Yetkazish do‘kon sozlamalariga bog‘liq.\n'+common;
}

// 3. Admin screen and day-to-day operations.
{
 const s=slide(C.dark);
 text(s,'Do‘kon boshqaruvi bir panelda',58,49,1160,70,46,C.white,{serif:true});
 await img(s,'admin-products.png',48,164,774,478,'contain','Mahsulotlarni boshqarish uchun haqiqiy admin panel');
 block(s,'Mahsulot va variantlar','Surat, narx, rang, o‘lcham, SKU\nva qoldiqni o‘zgartirasiz.',870,160,352,true);
 block(s,'Savdo va murojaatlar','Buyurtma, kirim, sotuv hamda\nqaytarishni qayd qilasiz.',870,290,352,true);
 block(s,'Kontent va sozlamalar','Banner, kolleksiya, ish vaqti\nva yetkazishni sozlaysiz.',870,420,352,true);
 text(s,'Hisobot va xodimlar',870,554,352,36,27,C.white,{bold:true});
 text(s,'Savdo hisobotlari, CSV import\nva egasi/sotuvchi huquqlari.',870,597,352,64,23,'#E6DAD4');
 text(s,'Mahsulot QR yorliqlari. Login bilan himoyalangan boshqaruv.',58,662,1040,26,18,C.gold);
 folio(s,3,true);
 s.speakerNotes.text='Manba: docs/ADMIN_GUIDE_V2.md va haqiqiy admin panel. Hisobot tushumni qayd qiladi, foydani avtomatik taxmin qilmaydi. Qoldiq variant bo‘yicha boshqariladi. Panel egasi va sotuvchi rolini farqlaydi. Ekran tasviridagi ma’lumotlar demo assortiment. Admin login/paroli taqdimotga kiritilmagan.\n'+base+'/admin';
}

// 4. A real image processed by the existing no-AI studio.
{
 const s=slide();
 text(s,'Suratni katalog va reklamaga tayyorlash',58,47,1160,67,43,C.ink,{serif:true});
 text(s,'Asl surat',59,146,260,34,24,C.muted);
 text(s,'Studiyadagi tayyor natija',354,146,430,34,24,C.wine);
 await img(s,'studio-original.jpg',57,194,273,391,'contain','Asl bordo baland yoqali bluzka fotosurati');
 await img(s,'studio-result.png',355,194,336,420,'contain','Shu saytdagi rasm studiyasida ajratilgan va iliq oq fonga qo‘yilgan surat');
 block(s,'Fon va joylashuv','Fonni ajratasiz, chetlarini\ntuzatasiz, tayyor fon tanlaysiz.',792,186,430);
 block(s,'Katalog, reklama va Story','Har format uchun tayyor nusxa.\nAsl surat alohida saqlanadi.',792,323,430);
 block(s,'Nashrni o‘zingiz tasdiqlaysiz','Natijani ko‘rib tekshirasiz,\nkeyin mahsulotga qo‘shasiz.',792,460,430);
 text(s,'AI obunasi va har rasm uchun to‘lov yo‘q.',59,630,1050,36,26,C.wine,{bold:true});
 text(s,'Murakkab fonda konturlarni qo‘lda tuzatish kerak bo‘lishi mumkin.',59,674,1010,25,18,C.muted);
 folio(s,4);
 s.speakerNotes.text='Manba: docs/STUDIO_GUIDE.md. Tayyor rasm shu loyihadagi ImageStudio brauzer vositasida GrabCut bilan ishlab chiqildi. Mahsulotga saqlash yoki nashr qilish bajarilmadi. Bir bosishda istalgan murakkab fonda mukammal ajratish kafolatlanmaydi. Rasm API xarajati yo‘q, domen va hosting alohida.\n'+photoCredit('uz-style-06.jpg');
}

// 5. Proposed Telegram integration is explicitly labelled as the next stage.
{
 const s=slide();
 await img(s,'bot-photo.jpg',0,0,427,720,'cover','Yopiqroq kiyimdagi fashion foto, Telegram bosqichi uchun');
 text(s,'Murojaatlar\nTelegramga keladi',492,76,731,129,48,C.ink,{serif:true});
 text(s,'Paketga kiritilgan keyingi bosqich',495,225,720,40,25,C.wine,{bold:true});
 text(s,'01',496,305,56,44,32,C.wine,{serif:true});
 text(s,'Mijoz saytda buyurtma yoki savol yuboradi.',571,307,650,63,27,C.ink);
 text(s,'02',496,398,56,44,32,C.wine,{serif:true});
 text(s,'Bot biznes egasiga kiyim, variant, telefon\nva jami summa bilan xabar jo‘natadi.',571,400,650,78,27,C.ink);
 text(s,'03',496,505,56,44,32,C.wine,{serif:true});
 text(s,'Egasi mijoz bilan bog‘lanadi va buyurtmani\nadmin panelda boshqaradi.',571,507,650,78,27,C.ink);
 text(s,'Bot demo tasdiqlangach ulanadi.\nHozir buyurtma va murojaatlar admin panelda saqlanadi.',495,625,728,62,21,C.muted);
 s.speakerNotes.text='Telegram bot hali ishlab chiqilmagan va demo saytga ulanmagan. Bu slaydda biznes egasiga sotiladigan to‘liq paketning keyingi bosqichi taqdim etiladi. Yangi buyurtma/murojaat egasining Telegram chatiga avtomatik yuborilishi rejalashtirilgan. Bot username/havolasi hali mavjud emas, shuning uchun unga QR qo‘yilmagan.\n'+photoCredit('uz-style-14.jpg');
}

// 6. Offer and scannable links with clear scope and date.
{
 const s=slide(C.wine);
 text(s,'To‘liq paket',60,49,688,66,46,C.white,{serif:true});
 text(s,'≈ $378',58,130,686,141,112,C.white,{serif:true});
 text(s,'Bir martalik loyiha narxi',64,285,664,37,26,'#EAD9CF');
 text(s,'Veb sayt, admin panel va Telegram bot',64,339,670,40,26,C.white,{bold:true});
 text(s,'Boshlang‘ich sozlash va\n3 oy bepul servis',63,413,669,94,38,C.white,{serif:true});
 text(s,'Saytga oid har qanday muammoni sozlab\nberish va servis xizmati bepul.',64,535,685,71,26,C.white);
 await img(s,'qr-site.png',846,139,185,185,'contain','Jonli demo saytni ochadigan QR');
 text(s,'Saytni ko‘rish',842,341,374,36,26,C.white,{link:base});
 await img(s,'qr-admin.png',846,411,185,185,'contain','Admin kirish sahifasini ochadigan QR');
 text(s,'Admin kirish sahifasi',842,611,374,32,24,C.white,{link:base+'/admin'});
 text(s,'Login va parol bilan kiriladi.',842,648,374,25,18,'#EAD9CF');
 text(s,'4 500 000 so‘m ekvivalenti. MB: 1 USD = 11 897,90 so‘m, 11.10.2026.',64,631,735,30,18,'#EAD9CF');
 text(s,'3 oy topshirilgan kundan boshlanadi. Domen va pulli hosting alohida.',64,672,720,25,17,'#EAD9CF');
 s.speakerNotes.text='Taklif foydalanuvchi talabiga mos: 4 500 000 so‘mlik bir martalik paket, boshlang‘ich sozlash va topshirilgan kundan boshlab 3 oy saytga oid har qanday muammoni bartaraf etish/servis bepul. Servis va yangi loyiha/funksiyalarni ishlab chiqish alohida ko‘lamda kelishiladi. Domen va pulli hosting to‘lovlari alohida. Hisob: 4 500 000 / 11 897,90 = 378,21799057 USD. Slaydda yaxlitlangan ≈$378. Kurs manbasi: https://www.cbu.uz/en/arkhiv-kursov-valyut/ va 11.10.2026 uchun tasdiqlovchi https://digital.gov.uz/ru/iiv/sections/view/44573. QR 1: '+base+'; QR 2: '+base+'/admin. Admin paroli QR yoki faylga yozilmagan.\n'+common;
}

await fs.mkdir(output,{recursive:true});
const candidatePath=path.join(build,'candidate.pptx');
await (await PresentationFile.exportPptx(p)).save(candidatePath);
for(let i=0;i<p.slides.items.length;i++){
 const s=p.slides.items[i];
 const b=await p.export({slide:s,format:'png',scale:1.5});
 await fs.writeFile(path.join(build,`slide-${i+1}.png`),new Uint8Array(await b.arrayBuffer()));
 const layout=await s.export({format:'layout'});await fs.writeFile(path.join(build,`slide-${i+1}.layout.json`),await layout.text());
}
console.log('Rendered 6 slides');
const {finalizePresentation}=await import(pathToFileURL(path.join(SKILL_DIR,'container_tools/artifact_tool_utils.mjs')).href);
const finalPath=path.join(output,'Fashion_Shop_Taqdimot.pptx');
const result=await finalizePresentation({
 workspaceDir,candidatePath,finalPath,pythonExecutable:RUNTIME_PYTHON,
 integrityValidatorPath:path.join(SKILL_DIR,'container_tools/inspect_presentation_package_integrity.py'),
 layoutValidatorPath:path.join(SKILL_DIR,'container_tools/inspect_presentation_layout_geometry.py'),
 layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],
 fontPolicy:{basis:'design',families:['Georgia','Arial']},verifyArtifactToolImport:true,
 receiptPath:path.join(build,'validation.json')
});
await import('./export-pdf.mjs');
await fs.writeFile(path.join(build,'deck.json'),JSON.stringify(p.toProto()));
console.log(JSON.stringify({finalPath,result,pdf:path.join(output,'Fashion_Shop_Taqdimot.pdf'),slides:p.slides.items.length}));
