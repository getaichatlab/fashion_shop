# Fashion Shop — sayt va admin demo

Barcha loyiha fayllari `D:\fr_sayt\fashion_shop` ichida. Sayt va admin bir xil saqlanadigan bazadan ishlaydi. Telegram bot egasi demo tasdiqlagandan keyin qo‘shiladi.

Netlify demo: [sayt](https://fashion-shop-demo-tom.netlify.app) · [admin](https://fashion-shop-demo-tom.netlify.app/admin). Asosiy sayt ommaga ochiq, previewlar yopiq. Cloud admin login `owner`; parol `data/netlify-admin-access.txt` faylida. Joylashtirish, cloud saqlash va tekshiruv natijalari: [Netlify qo‘llanmasi](docs/NETLIFY_DEPLOY.md).

## Ishga tushirish

Node.js 24 kerak (demo `node:sqlite` foydalanadi).

```powershell
cd D:\fr_sayt\fashion_shop
npm.cmd install --cache .npm-cache
npm.cmd run dev
```

- Sayt: http://127.0.0.1:3100
- Admin: http://127.0.0.1:3100/admin
- Birinchi API chaqirig‘ida baza va owner hisobi yaratiladi.
- Login va tasodifiy parol: `data/admin-access.txt`. Bu fayl sayt orqali berilmaydi. Yangi parol paneldagi xavfsizlik bo‘limida o‘rnatiladi.

Tayyor demo buildi mavjud. `RUN_DEMO.cmd` ni ikki marta bosib ochish mumkin; u 3100 portda serverni ishga tushiradi. Shu portda demo allaqachon ishlayotgan bo‘lsa, yangi nusxani ishga tushirmang. Kodni o‘zgartirgach `npm.cmd run build` orqali buildni yangilang. Ishlab chiqish uchun `RUN_DEV.cmd`, zaxira nusxa uchun `BACKUP.cmd` bor. Lokal server kompyuter ishlayotgan vaqt davomida ochiladi.

## Bajarilgan funksiyalar

- Responsive butik dizayni, banner slayderi, yengil perspektiva/transition, kamaytirilgan animatsiya rejimi.
- 72 ta demo model: suratga mos 36 tasi e’lon qilingan, qolgan 36 tasi qoralamada. Yangi e’lon qilingan modellarda 144 ta rang/o‘lcham varianti; avvalgi variant va buyurtma identifikatorlari saqlangan.
- SKU/apostrofga mos qidiruv, rang/o‘lcham/mato/bichim/mavsum/vaziyat/budjet filtrlari, 24 tadan yuklash. Mahsulotdan qaytilganda filtr, yuklangan modellar va sahifadagi joy tiklanadi.
- Mobil tez ko‘rish, 2–3 modelni taqqoslash, yaqinda ko‘rganlar, tayyor obraz va uch tanlovli uslub topish. Rang tanlovi tegishli foto va o‘lchamlarni ochadi; barcha yo‘llarda variant narxi ishlaydi.
- Mahsulot galereyasi/zoom/video, o‘lchov jadvali, variant mavjudligi.
- Yoqtirganlar va alohida ulashiladigan tanlov.
- Savatcha va hisob yaratmasdan buyurtma. Narx serverda tekshiriladi.
- Shaxsiy havola orqali buyurtma holati.
- Mahsulot savollari va tugagan variant bo‘yicha mavjudlik so‘rovlari.
- Owner/seller seanslari, mahsulot/qoralama/tasdiqlash/arxiv, rang × o‘lcham jadvali, alohida SKU/narx, rangga bog‘langan va tartiblanadigan media.
- 0 qoldiqli qoralamaga nusxalash, CSV mahsulot importi, ommaviy narx/arxiv/kolleksiya amallari. Import va ommaviy amal avval tekshiriladi; tasdiqlanmaguncha ma’lumot o‘zgarmaydi.
- SKU yoki QR havola orqali tezkor sotuv, to‘lov qaydi, asl sotuvga bog‘langan qaytarish, kirim/inventar CSV va qoldiq harakati tarixi. Band qoldiq himoyalangan; sotuv/kirim/qaytarish takror yuborilganda ikkinchi marta bajarilmaydi.
- Mahsulot uchun mahalliy QR yorlig‘i; banner, kategoriya, obraz va bosh sahifa bloklarini tartiblash/yashirish.
- Haqiqiy savdo va demo/QA hisobotlari alohida: ko‘rish → savatcha → buyurtma → yakunlangan, topilmagan qidiruvlar, mavjudlik so‘rovlari, kam qoldiq va uzoq sotilmagan modellar.
- Buyurtma holatlari, to‘lov qaydi, kelishilgan yetkazish narxi, murojaatlar, hisobot va eksport.
- AI va pullik API talab qilmaydigan mahalliy GrabCut studiyasi: kiyim ramkasi, yashil saqlash/qizil o‘chirish belgisi, asl suratdan qayta hisoblash, yumshoq/qattiq cho‘tka va qamrov kursori, zoom/surish, oldin/keyin taqqoslash, oq/qora fonda kontur tekshirish, mayda fon qoldiqlarini tozalash va chetlarni sozlash.
- Kesish/aylantirish ham kiradigan undo/redo; oq, iliq oq, studiya, brend, shaffof yoki shaxsiy fon; masshtab/joylashuv/soya/yozuv; eksport bilan aynan bir xil jonli ko‘rinish; katalog/reklama/Story PNG. Bo‘sh natija yoki kadrdan chiqqan kiyim eksportini bloklash.
- Asl media saqlanadi. E’lon qilishdan oldin admin tasdig‘i majburiy.
- Studiyada katalog/kvadrat/Story brend presetlari, ketma-ket foto navbati, tahrir qoralamasini shu brauzerda saqlash va qayta ochish mavjud.
- Brend, banner, ish vaqti, kontakt, yetkazish/olib ketish, narx/hudud, to‘lov va buyurtma qabulini sozlash.
- Telegram post qoralamasini nusxalash. Botga oid funksiyalar ulanishgacha xabar yubormaydi.

## Demo ko‘rsatish

1. Katalogda M o‘lcham va budjet bo‘yicha filtr qiling.
2. Mahsulotni yoqtirganlarga saqlang, o‘lchov jadvalini oching va savatchaga qo‘shing.
3. Demo ism/telefon bilan olib ketish buyurtmasini bering.
4. Admin panelda buyurtmani tasdiqlang, holatini tayyor/yakunlangan qiling.
5. Qoldiq bo‘limida do‘kondagi sotuvni qayd qiling.
6. Yangi mahsulotga surat yuklang, editorni oching, tekshirib tasdiqlang va e’lon qiling.
7. Yetkazishni yoqing, hudud va mos to‘lovni belgilang. Saytda olish yo‘li o‘zgarishini ko‘ring.

Yangi imkoniyatlar uchun `docs/ADMIN_GUIDE_V2.md` ichidagi ko‘rsatish ketma-ketligidan foydalaning. Funksiyalar va bajarilgan bosqichlar `docs/POLISH_IMPLEMENTATION_V2.md` da.

## Testlar

```powershell
npm.cmd run typecheck
npm.cmd run test
$env:PLAYWRIGHT_BROWSERS_PATH='D:\fr_sayt\fashion_shop\.browsers'
npx.cmd playwright install chromium
npm.cmd run test:e2e
npm.cmd run test:studio-photos
npm.cmd run test:performance
npm.cmd run build
```

E2E server 3100 portda ishlayotgan bo‘lishini talab qiladi. Sinovlar belgilangan QA mahsulotlarini yaratadi va arxivlaydi; test buyurtmalar demo tarixida saqlanadi.

## Zaxira nusxa

```powershell
node scripts/backup.mjs
```

Baza va yuklangan media `data/backups/<vaqt>` ichiga saqlanadi. Tiklash uchun serverni to‘xtating, joriy `data` nusxasini saqlang, backupdagi `fashion.sqlite` va `media`ni tegishli joyiga tiklang. Qoldiq/buyurtmalarni tekshirib serverni qayta yoqing. `fashion.sqlite-wal` va `fashion.sqlite-shm` faqat server to‘xtagach ko‘riladi; ishlayotgan bazani oddiy fayl nusxalash bilan tiklamang.

Tiklashda eski baza, WAL va SHM fayllarini birga alohida nusxa sifatida saqlang; yangi backup bazasi yoniga eski WAL/SHM ni qaytarmang. Admin hisoblari backup bazada mavjud; hozirgi `admin-access.txt` keyinchalik o‘zgartirilgan parolni aks ettirmasligi mumkin.

## Muhim amaliy chegaralar

- GrabCut oddiy va ko‘plab murakkab fonlarda yordam beradi; o‘xshash rang, to‘r, soch va soyada qo‘lda tuzatish kerak. Istalgan suratda mukammal bir bosishli ajratish kafolatlanmaydi. Asl kiyimning RGB rangi/naqshi qayta chizilmaydi.
- **Qoralamani saqlash** manba, asl/current piksellar, niqob, belgilar, kesish/aylantirish holati va kompozitsiyani shu brauzerning IndexedDB xotirasida saqlaydi. Undo tarixi sessiyalar orasida tiklanmaydi. Brauzer qoralamasi server backupiga kirmaydi; tayyor va asl media mahsulotga saqlansa serverda qoladi.
- Demo fotosi kiyim turi va ko‘rinadigan rangga mos saralangan. Narx, qoldiq va S/M/L/XL o‘lchamlari namuna; mato tarkibi va kiyim o‘lchovlari taxmin qilib yozilmagan. Haqiqiy assortiment egasi bilan tekshiriladi. Foto yetishmagan modellar qoralamada.
- AI yoki har bir rasm uchun pullik xizmat yo‘q. Lokal ishlatishda tashqi xizmat xarajati yo‘q; domen va ommaviy hostingni doim bepul bo‘ladi deb hisoblamaymiz.
- Bot, onlayn to‘lov va kuryer integratsiyasi ishlayotgandek ko‘rsatilmagan.
- So‘rovlar hozir admin panelda saqlanadi; telefon orqali javob beriladi. Telegram obunasi keyin bog‘lanadi.
- Baza `data/fashion.sqlite`; media `data/media`; barcha statik tasvir va shriftlar loyiha ichida.
- Admin eksporti JSON bo‘lib, to‘liq SQLite+media backup o‘rnini bosmaydi.
- Do‘kondagi sotuv qoldiq yangilanishi uchun panelga kiritilishi kerak.
- QR dagi `127.0.0.1` manzil boshqa telefondan ochilmaydi. Haqiqiy ommaviy domen sozlangach mijoz yorlig‘ini chiqaring; lokal QR demo kompyuteriga tegishli.
- Ommaviy foydalanishdan oldin haqiqiy kontakt/shartlar, parol, HTTPS, zaxira va joylashtirish muhiti tekshiriladi. `FASHION_PUBLIC_ORIGIN` haqiqiy origin uchun qo‘yiladi. Demo qidiruv indekslashidan yopilgan.

Rasm manbalari: `docs/ASSET_CREDITS.md`. Reja: `docs/IMPLEMENTATION_PLAN.md`. Sinov natijalari: `docs/QA_REPORT.md`. Studiyadan foydalanish: `docs/STUDIO_GUIDE.md`. OpenCV manba va litsenziyasi: `docs/THIRD_PARTY.md`.

Assortiment, dizayn va xaridor/admin qulayliklarini sayqallash rejasi: `docs/POLISH_PLAN_V2.md`. 1–6-bosqich natijasi: `docs/POLISH_IMPLEMENTATION_V2.md`.

## Yangi demo bazasi uchun assortiment

2026-10-11 yangilanishi: 36 ta yopiqroq bichimdagi demo model, 159 000–699 000 so‘m namunaviy narxlar va 3 ta kolleksiya. Tafsilot, manbalar va yangilash tartibi: [O‘zbekiston bozori uchun katalog](docs/UZ_MARKET_UPDATE.md).

Joriy baza allaqachon kengaytirilgan. Faqat yangi lokal demo yaratishda, birinchi `/api/catalog` chaqirig‘idan keyin `node scripts/expand-demo-catalog.mjs` bajariladi. U yangi demo ID larini qo‘shadi, mavjud buyurtma va variantlarni o‘chirmaydi. Haqiqiy do‘kon bazasiga bu demo skriptini avtomatik ishga tushirmang. Migratsiyalar `migration_versions` jadvalida qayd etiladi; yangilashdan oldin `BACKUP.cmd` ishlating.
