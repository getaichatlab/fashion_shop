# O‘zbekiston bozori uchun demo katalog — 2026-10-11

## Suratlar va assortiment

36 ta e’lon qilingan demo modelning barcha suratlari yopiqroq bichimdagi kiyimlarga almashtirildi. Uzun ko‘ylak, yengli bluzka, keng shim, uzun yubka, kardigan, blazer va paltolar tanlandi. Modelning ko‘rinadigan rangi, nomi, kategoriyasi va tavsifi fotosuratga moslashtirildi. 3 modelda shu kiyimning boshqa ko‘rinishi mavjud. 6 ta banner/kirish tasviri ham yangilandi.

Suratlar do‘konning haqiqiy tovarlari emas, uslub uchun stok namuna. Har bir suratning muallifi va manba sahifasi [UZ_CATALOG_ASSETS.json](UZ_CATALOG_ASSETS.json) da. Fotosuratning rangi va kiyim detali qayta chizilmagan. Haqiqiy mahsulot uchun egasining tasviri, tarkibi, o‘lchovlari, narxi va qoldig‘i tasdiqlanishi kerak.

24 ta eski qoralama kartadagi mos kelmaydigan rasmlar chiqarildi. Qoralamalarning ID va tarixi saqlangan. E’lon qilingan modellarning variant ID, SKU, qoldiq va band qilingan sonlari saqlanadi. Barcha eski narxlar nollandi; asossiz chegirma ko‘rsatilmaydi.

## Narxlar

Demo narxlar 159 000–699 000 so‘m. Har bir kiyim turi uchun alohida namunaviy narx berildi. Suratdagi aksessuarlar yoki boshqa kiyimlar, komplekt deb yozilmagan bo‘lsa, narxga kiritilmagan.

Mahalliy narxlar uchun yo‘nalish sifatida quyidagi savdo e’lonlari ko‘rildi; aynan fotosuratdagi mahsulotning sotuv narxi tasdiqlangan deb hisoblanmaydi:

- [Glotr — ayollar paltolari](https://glotr.uz/uz/ayollar-paltolari/)
- [Glotr — ayollar shalvarlari](https://glotr.uz/uz/ayollar-shalvarlari/)
- [Glotr — klassik shim va nimcha](https://glotr.uz/uz/klassik-ayollar-shimlari-va-nimchalari-p-1089447/)
- [Glotr — ko‘ylaklar](https://glotr.uz/uz/koylaklar/?page=3&per-page=40)

## Dizayn va qulaylik

- To‘liq kiyimni ko‘rsatadigan rasm joylashuvi, och bej fon va o‘qiladigan to‘q aksent.
- Nafis kundalik (30), Ish kuni (11) va Bayramona (6) kolleksiyalari. Ayrim modellar bir nechta kolleksiyaga kiradi.
- 200 000, 350 000 va 700 000 so‘mgacha budjet havolalari; 3 ta moslashtirilgan tayyor obraz.
- Katalogga aniq bosilgan havola yangi tanlovni yuqoridan ochadi. Mahsulotdan brauzerning Back tugmasi bilan qaytilganda avvalgi katalog joyi va ko‘rsatilgan model soni tiklanadi.
- Server va brauzerda so‘m narxlari bir xil formatlanadi; narx matni sababli hydration xatosi tuzatildi.
- Admin kirish fotosurati va yangi banner shablonlari ham yangilandi.
- Mahalliy shriftlar umumiy CSS bilan yuklanadi. Qo‘lda qo‘yilgan `head/link` olib tashlandi; Netlify’dagi React hydration xatosi jonli tekshiruvda qaytmadi. To‘liq server katalog renderi saqlangan.
- Netlify’ning suzuvchi reklama belgisi loyiha ko‘rinish sozlamasidan o‘chirildi. Tarif va sayt kirish ruxsatlari o‘zgartirilmadi.

## Yangilash va zaxira

Yangi tasvirlar: `public/images/uz-style-*.jpg`, `uz-editorial-*.jpg`.
Manifest: `data/uz-catalog-manifest.json`.
Mahalliy yangilash: `node scripts/apply-uz-catalog.mjs --local`.
Jonli yangilash: yangi fayllar deploy qilingach `node scripts/apply-uz-catalog.mjs --cloud`.
Bulut yangilanishi oddiy autentifikatsiyali admin API orqali bajariladi; bevosita ishlab turgan bazaga SQL yozilmaydi.

Yangilashdan oldingi lokal backup: `data/backups/2026-10-11T06-05-09-454Z`.
Bulut katalog/buyurtma/sozlamalar eksporti: `data/backups/cloud-2026-10-11T06-05-13-488Z`.
Bulut eksporti foydalanuvchilar va barcha media bilan to‘liq DB backup o‘rnini bosmaydi.

## Tekshiruv

15 ta domain/katalog/studiya sinovi va TypeScript tekshiruvi o‘tdi. Lokal va jonli desktop/375px mobile ko‘rinishlarda gorizontal ustma-ust tushish aniqlanmadi. Kolleksiya filtrlari va mahsulotdan Back orqali katalogga qaytish tekshirildi. Production build o‘tdi. Jonli admin panelda 36 ta e’lon qilingan modelning surat va narxlari ko‘rildi.

Jonli katalog natijasi: `deploy/uz-catalog-update.json`. 45 ta surat, nom/narx/rang, variant ID/SKU/qoldiq, barcha avvalgi buyurtma/murojaat va do‘kon shartlari saqlangani: `deploy/uz-catalog-verification.json`.

Yakuniy bosh sahifa va kolleksiya sahifasi: `deploy/uz-catalog-browser-checks.json` — yangi yuklanishdan keyin 0 ta brauzer xatosi, kolleksiya yuqoridan ochildi va sahifa eni viewportdan oshmadi.

Yakuniy deploy: `6acb3741c15d91b3903c0995`. Dalil suratlari: `deploy/uz-market-live-home.jpg`, `uz-market-live-catalog.jpg`, `uz-market-live-admin.jpg`, `uz-market-live-mobile.jpg`.

Netlify API o‘qish so‘rovlari vaqtincha uzilsa, faqat lokal build jarayonida `NODE_OPTIONS=--require D:\fr_sayt\fashion_shop\scripts\netlify-fetch-retry.cjs` bilan qayta urinish ishlatilishi mumkin. Bu helper faqat rasmiy Netlify API’lariga GET/HEAD so‘rovlarini qaytaradi, HTTPS tekshiruvini yoki token huquqlarini o‘zgartirmaydi; cloud runtime environmentiga yozilmagan.
