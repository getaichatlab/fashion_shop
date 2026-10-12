# Tekshiruv hisoboti — 2026-10-10

## Muhit

Windows, Node.js 24.12.0, Next.js 16.4.0, React 19, lokal SQLite, Chromium. Sayt va admin `http://127.0.0.1:3100` da tayyor build orqali ishlaydi. Sinovlar do‘konning haqiqiy savdosi emas, QA bilan belgilangan demo ma’lumotlardan foydalanadi.

## Natijalar

- `npm.cmd run typecheck` — muvaffaqiyatli.
- `npm.cmd run test` — 15/15 qoida, katalog/CSV va niqob sinovi o‘tdi.
- `npm.cmd run test:e2e` — yakuniy production serverda **31/31** integratsiya va brauzer sinovi o‘tdi (53.8 s).
- Mahsulotlar oynasining boshlang‘ich filtri “Joriy assortiment”ga o‘zgartirilgach, tegishli admin forma/mobil menyu/studiya modalining 3/3 sinovi qayta o‘tdi (4.8 s); oxirgi build va typecheck ham muvaffaqiyatli.
- `npm.cmd run test:studio-photos` — 6 ta haqiqiy editorial surat, qo‘lda berilgan yashil/qizil ko‘rsatmalar va mayda qoldiq tozalash bilan tekshirildi. Har oltitasida aniq saqlash/o‘chirish belgilari natijada saqlandi. Bu universal yoki mukammal vizual sifat balli emas.
- `npm.cmd run build` — tayyor build muvaffaqiyatli yaratildi.
- `node scripts/backup.mjs` — yakuniy SQLite/media backup: `data/backups/2026-10-10T12-51-14-332Z`. Nusxadagi `PRAGMA integrity_check` — `ok`, media fayllarida yo‘qolish yo‘q; migratsiya versiyalari 2 va 3.
- `node scripts/verify-data.mjs data/backups/2026-10-10T06-25-43-762Z` — joriy baza `ok`, foreign key xatosi va yo‘qolgan media/havola yo‘q. Avvalgi 38 mahsulot, 158 variant va 19 buyurtma ID si saqlangan. Eski 24 modelning jami qoldig‘i o‘zgarmagan; muddati tugagan `p2-0-0` demo bandi 1 → 0 bo‘shagan. Natija `data-verification.json` da.
- `npm.cmd run test:performance` — sovuq brauzer keshi bilan ikki profil, har birida 3 o‘lchov; natija quyida va `site-performance.json` da.

## Tekshirilgan asosiy holatlar

1. Himoyalangan admin API, egasi kirishi, boshqa origin so‘rovini rad qilish.
2. Tasdiqsiz mahsulotni e’lon qilishni rad etish.
3. Oxirgi dona, qayta yuborilgan buyurtmani takror yaratmaslik, bekor qilinganda band qoldiqni bo‘shatish.
4. Yetkazish hududi, kelishiladigan narxni bepul sifatida ko‘rsatmaslik, mos to‘lov usuli.
5. Do‘kondagi sotuv va yetarli bo‘lmagan qoldiqni rad etish.
6. Yoqtirganlarni sahifa almashishi va qayta yuklashda saqlash, o‘lchov jadvali, savatcha.
7. Hisobsiz buyurtma, olib ketishda yetkazish/manzil maydonlarining yo‘qligi, shaxsiy holat sahifasi.
8. Mahsulot formasi va admin navigatsiyasi.
9. 10 ta asosiy va 8 ta yangi sayt/admin yo‘li × 320, 390, 768, 1024, 1440 px: 90 ta sahifa/kenglik tekshiruvida gorizontal sahifa chiqishi yo‘q. Jadval ichidagi gorizontal aylantirish ruxsat etiladi.
10. Telefon suratini yuklash, ramka bilan mahalliy GrabCut ajratish, kiyimning namuna RGB piksellarini saqlash, yashil/qizil cho‘tka va belgilardan qayta hisoblash. Ajratish internet uzilganda ham qayta hisoblandi; studiya hech qanday tashqi xizmatga so‘rov yubormadi.
11. Cho‘tka, kesish va aylantirishni undo/redo bilan tiklash; asl suratga qaytish; zoom, taqqoslash, qora fonda tekshirish, shaxsiy fon, yozuv va soya.
12. 1200 × 1500, 1080 × 1080, 1080 × 1920 PNG eksport fayllari jonli preview bilan baytlar bo‘yicha aynan bir xil. Bo‘sh niqob, kadrdan chiqqan yoki yozuv bantlari bilan to‘silgan kiyim eksporti bloklanadi.
13. Mahsulotga nusxa qo‘shishda admin tasdig‘i qayta talab qilinadi. Qoralama media ommaga ochilmaydi. Tasdiqlangan nashr ishlaydi. Asl yuklangan fayl baytlar bo‘yicha o‘zgarmagan.
14. Mayda qoldiq tozalash asosiy siluet, yashil belgili alohida detal va diagonal tutashgan kiyim qismini saqlaydi. Niqob chetini qisqartirish/kengaytirish tegishli manba pikselida ishlaydi.
15. Ulashiladigan tanlov, mavjudlik/savol so‘rovlari, admin javob holatini saqlash.
16. Oq matn bilan o‘qilmaydigan aksent va yetkazishga mos kelmaydigan to‘lov konfiguratsiyasini rad etish.
17. Tanlangan variantning alohida narxi; rang tanlanganda shu rang fotosi va o‘lchami; tayyor foto faqat asl manbaga bog‘langan rangni meros olishi.
18. Kirim preview bazani o‘zgartirmasligi, takror SKU ni rad etish, parallel sotuv/eski mahsulot formasini aniqlash, tasdiqni qayta yuborishning xavfsizligi.
19. Asl sotuvga qaytarish, qayta sotuvga yaroqli kiyim qoldig‘ining bir marta tiklanishi, ortiqcha qaytarishni rad etish.
20. Nusxalashning yangi ID/SKU va 0 qoldiqli qoralama yaratishi.
21. Qo‘shtirnoqli/vergulli CSV, bir modelga bir necha variant, atomik qoralama import, bir xil tasdiqda dublikat yo‘qligi.
22. Ommaviy narx preview holatini qayta tekshirish; QA sotuvlari haqiqiy hisobotdan chiqarilishi.
23. Mahalliy PNG QR, SKU yorlig‘i; sotuvchining egasiga tegishli API larni bajara olmasligi.
24. Tez ko‘rish, obraz, uslub tanlash va taqqoslashning joriy variantlar bilan ishlashi; 24 tadan katalog yuklash.
25. Mobil tez ko‘rish tugmasining 44 px maydoni, Escape orqali yopish va fokusni qaytarish; reduced-motion mobil admin menyusining yopilishi/ochilishi.
26. Filtr, yuklangan modellar va sahifa joyining mahsulotdan qaytilganda tiklanishi.
27. Server tayyor katalogni JavaScriptdan oldin HTML da berishi; qoralamalar ommaviy HTML ga kirmasligi.
28. Yakunlangan onlayn buyurtma qoldig‘i va uning harakat tarixiga faqat bir marta yozilishi.
29. Brauzer qoralamasidan yuklangan asl manba, piksellar, niqob va kompozitsiyaning sahifa yangilangandan keyin tiklanishi; tayyor nusxaning to‘g‘ri asl PNG bilan bog‘lanishi.

## Vizual tekshiruv

Asosiy sinov suratlari va yangilangan `polish-home-desktop.png`, `polish-home-mobile.png`, `polish-catalog-*.png`, `polish-quick-*.png`, `polish-product-form-*.png`, `polish-variants-*.png`, `polish-content-*.png` shu papkada. Bosh sahifa, katalog, mobil modal, variant jadvali va kontent oynasi ko‘zdan kechirildi. Yangilangan screenshot skriptida brauzer xatosi qayd etilmadi. Mobil tez ko‘rishni yashirgan eski CSS, reduced-motion menyuni berkitmay qo‘ygan umumiy transform qoidasi va ortga qaytishdagi scroll holati tuzatildi.

Studiyaning `studio-390.png`, `studio-1440.png`, `studio-modal-mobile.png` suratlari ham ko‘zdan kechirildi. Mobil studiyada ajratish/natija tablari, kompyuterda ikki ustun ishlaydi; boshlang‘ich ko‘rinishda butun surat oynaga sig‘adi. Cho‘tka vaqtida faqat o‘zgargan hudud qayta chiziladi, to‘liq eksport qo‘lni qo‘yib yuborgandan keyin yangilanadi.

`studio-validation/real-photos.png` — 6 ta manba fotosi va belgilar/tozalashdan keyingi natija. `results.json` — ko‘rsatma soni, vaqt va tekshiruv natijalari. 1000 px gacha tayyorlangan fotosurat va 640 px hisoblash aniqligida ajratish shu kompyuterda 0.52–0.90 soniya bo‘ldi; birinchi OpenCV yuklanishi bu vaqtga kirmaydi. Telefon tezligi boshqacha bo‘lishi mumkin.

Surat 2 dagi och kiyim/och bino va surat 4 dagi qo‘l/och fon yashil-qizil ko‘rsatmalar bilan yaxshilandi. Surat 5–6 ning poyabzal/yer chetlarida ayrim mayda qoldiq yoki noaniq kontur hali ko‘rinadi; yakuniy nashr oldidan cho‘tka bilan qo‘shimcha tekshirish kerak. Asl rangdan kesilgan piksel o‘rniga sun’iy detal yaratilmaydi.

## Tezlik — lokal laboratoriya

Chromium, production server, yangi brauzer konteksti va sovuq HTTP keshi; reduced-motion. Mobil profil: 390 × 844 px, CPU 4 marta sekinlashtirilgan, 4 Mbps yuklash va 100 ms tarmoq kechikishi. Har profil 3 marta o‘lchandi; boshqa testlar bilan bir vaqtda ishlatilmadi.

| Profil | LCP median | CLS | Kuzatilgan maksimal interaction |
|---|---:|---:|---:|
| Kompyuter, lokal tarmoq | 0.420 s | 0 | 56–64 ms |
| Sun’iy sekinlashtirilgan mobil | 2.520 s | 0.0001 | 96–112 ms |

Serverdan tayyor sahifa berish mobil LCP medianini shu profilda 3.384 s dan 2.520 s gacha qisqartirdi. Natija rejaning 2.5 s maqsadiga yaqin, 20 ms yuqori; uni barcha telefon yoki ommaviy server uchun kafolat deb qabul qilmaymiz. Interaction ustuni navigatsiya/tez ko‘rishdagi laboratoriya Event Timing namunasi, haqiqiy trafikdagi INP emas. Ommaviy joylashtirilgach field LCP/INP/CLS va real telefonlarda o‘lchash kerak.

## Amaliy chegaralar

- Tekshiruvlar barcha qurilma va holatlarda xato bo‘lmasligini kafolatlamaydi. Safari/iPhone va real do‘kon media/materiallari bilan egasi demosidan keyin qo‘shimcha tekshirish kerak.
- GrabCut uchun ramka kerak; murakkab fon va kiyimga o‘xshash ranglarda yashil/qizil belgilar hamda qo‘lda tuzatish kerak. Oltita modeldagi editorial foto va sintetik naqshli/oddiy kiyimlar tekshirildi. Haqiqiy do‘konning osilgan kiyimi, flatlay, mayda to‘r va telefon kameralarining turli formatlari bilan alohida ko‘rik hali zarur.
- Mayda qoldiq tozalash semantik kiyim tanimasdan niqob bo‘laklari bo‘yicha ishlaydi. Belgilanmagan juda kichik haqiqiy detal ham o‘chishi mumkin; yashil belgi bilan himoyalang yoki undo qiling. Yirik, kiyimga tutashgan fon bo‘lagi uchun qizil cho‘tka kerak.
- 40 MP dan katta fotosurat rad etiladi. Asl fayl saqlanadi; tahrir nusxasining uzun tomoni 2200 px bilan cheklanadi. Qoralama manba/niqob/transform/kompozitsiyani IndexedDB da saqlaydi; undo tarixi tiklanmaydi. Brauzer qoralamasi server backupiga kirmaydi.
- 72 ta demo modeldan 36 tasi surat bilan e’lon qilingan, 36 tasi qoralamada. Narx/qoldiq/o‘lchamlar namuna; haqiqiy assortiment emas. Video yuklash/ko‘rish bor, lekin egasining telefon videosi formatlari bilan ko‘rik hali zarur.
- Onlayn to‘lov, kuryer va Telegram xabarlari ulanmagan. Telegram bot alohida keyingi bosqich.
- Buyurtmaga band qilingan qoldiq joriy so‘rovlar vaqtida tekshiriladi; do‘konning tashqi savdosi panelga kiritilishi kerak.
- Ommaviy joylashtirish, haqiqiy kontakt/shartlar, HTTPS va server muhiti bu lokal demo doirasiga kirmaydi.
