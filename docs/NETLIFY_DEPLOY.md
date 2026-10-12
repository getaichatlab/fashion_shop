# Fashion Shop — Netlify demo

Asosiy sayt: https://fashion-shop-demo-tom.netlify.app

Admin: https://fashion-shop-demo-tom.netlify.app/admin

Netlify boshqaruvi: https://app.netlify.com/projects/fashion-shop-demo-tom

## Kirish va joriy holat

- Loyiha `boydullayevtolibjon2001` jamoasida; site ID `33a83608-582b-4581-8290-52f6960a53d9`.
- Production ommaga ochilgan. Netlify sozlamasi: `sso_login=true`, `sso_login_context=non_production`; preview versiyalar jamoa kirishini talab qiladi.
- Admin login: `owner`. Cloud paroli faqat `D:\fr_sayt\fashion_shop\data\netlify-admin-access.txt` ichida. Lokal demo paroli boshqa.
- Cookie HttpOnly, Secure, SameSite=Strict. Ommaviy sayt ochilishi admin API himoyasini olib tashlamaydi.
- 36 ta e’lon qilingan model va 36 ta qoralama mavjud. Barchasi demo assortiment. Deploy sinovining bitta QA mahsuloti arxivda, bekor qilingan QA buyurtmasi demo tarixida qolgan.
- Telegram bot ulanmagan; buyurtma va murojaatlar panelda boshqariladi.
- Pullik tarif yoki qo‘shimcha pullik xizmat tanlanmagan. Netlify hisobining bepul limitlari amal qiladi; cheksiz hosting deb hisoblamang.

## Doimiy saqlash

Lokal demo `data/fashion.sqlite` va `data/media` bilan ishlaydi. Netlify funksiyasining fayl tizimi doimiy emas; cloud ishlash uchun alohida saqlash qo‘shilgan:

1. Netlify Database Postgres `fashion_state` jadvalidagi `main` qatori SQLite holatini saqlaydi.
2. Har so‘rov qatorni tranzaksiyada qulflab, alohida vaqtinchalik SQLite nusxasida ishlaydi. O‘zgarish Postgresga COMMIT bo‘lgandan keyin javob qaytadi. Parallel buyurtmalar shu qulf orqali qoldiqni muvofiqlashtiradi.
3. Yuklangan surat/video site darajasidagi `fashion-media` Netlify Blobs omborida saqlanadi.
4. Qoralama mahsulot media fayllari egasi hisobiga kirilganda ochiladi. E’lon qilishda suratning admin tomonidan tasdiqlanishi talab qilinadi.
5. Rasm foni brauzerda OpenCV/Canvas bilan tahrirlanadi; AI API ulanmagan. Tahrir qoralamasi brauzer IndexedDB xotirasida qoladi, mahsulotga saqlangan media esa cloud omborida.

Bu arxitektura bitta do‘kon demosiga mo‘ljallangan. So‘rovlar bitta holat qatori orqali ketma-ket o‘tadi. Katta trafik uchun alohida Postgres mahsulot/variant/buyurtma jadvallariga o‘tish kerak; yuqori yuklama sinovi o‘tkazilmagan.

## Qayta deploy

```powershell
cd D:\fr_sayt\fashion_shop
npm.cmd run typecheck
npm.cmd run test
npx.cmd netlify status
npx.cmd netlify deploy --build --prod
```

Status to‘g‘ri hisob va yuqoridagi loyiha ID ni ko‘rsatishi kerak. Node.js 24 kerak. `netlify.toml` Next.js runtime bilan to‘liq sayt/API funksiyasini chiqaradi; statik export ishlatilmagan.

Netlify environment o‘zgaruvchilari:

- `FASHION_STORAGE=netlify`
- `AWS_LAMBDA_JS_RUNTIME=nodejs24.x`

Database native integratsiyasi funksiya uchun ulanishni avtomatik beradi. Token yoki database URL ni public environment, kod yoki hujjatlarga qo‘ymang. CLI orqali olingan `data/netlify/database.json` credentiali read-only bo‘lib chiqdi; u bilan seed yozish ishlatilmaydi.

Migration `20261010170000_fashion_state.sql` jadvalni yaratadi. `20261010171000_fashion_demo.sql` tozalangan dastlabki demo va hash qilingan owner hisobini joylaydi; `ON CONFLICT DO NOTHING` qayta deployda mavjud ma’lumotni almashtirmaydi. `netlify-seed.mjs` bir martalik tayyorlash vositasi, qayta deploy uchun ishga tushirilmaydi. Cloud parolni qo‘lda seed qayta yaratish bilan almashtirmang.

`data`, `.npm-cache` va `.browsers` server tracingdan chiqarilgan. Joriy deploy bundleida lokal SQLite, parol fayllari va backup nusxalari yo‘qligi tekshirildi. Loyiha manbalari/parol fayllarini alohida ochiq omborga yoki statik hostingga yuklamang.

## Yuklash chegaralari

Netlify funksiya so‘rovi hajmiga moslashish uchun katta fotosurat admin brauzerida 2400 px gacha kichraytiriladi; PNG shaffofligi saqlanadi. Katta MP4 3 MB bo‘laklarda yuklanadi, umumiy limit 25 MB. Cloud video javobi ham 3 MB oralig‘igacha beriladi. Jonli deployda surat yuklash tekshirildi; katta MP4 orqali to‘liq yuklash/ijro ushbu deploy sinoviga kirmadi.

## Tekshiruv va zaxira

`scripts/verify-netlify.mjs` aynan shu demo URL uchun 9 ta cloud tekshiruvini bajaradi. U yangi QA mahsulot va buyurtma yaratadi, yakunda buyurtmani bekor qilib mahsulotni arxivlaydi; sinov tarixi qoladi. Oddiy ishlatish uchun bu skriptni qayta-qayta bajarish shart emas.

Natijalar: `docs/deploy/netlify-smoke-results.json`. Production build, typecheck va 15 ta qoida testi ham o‘tgan. Oldingi 31 ta brauzer/integratsiya sinovi lokal production demo uchun o‘tkazilgan; ularni cloud sinovi deb hisoblamang.

Admin eksporti mahsulot/variant, sozlama, buyurtma va murojaatlarning JSON nusxasini beradi. Uni saqlash foydali, lekin foydalanuvchilar/sessionlar va media binary fayllari kirmaydi; to‘liq cloud backup/tiklash yechimi sifatida ishlatmang. Lokal `BACKUP.cmd` ham Netlify ma’lumotini emas, faqat lokal bazani zaxiralaydi. Haqiqiy savdoga o‘tishdan oldin Postgres va Blobs uchun alohida to‘liq backup/tiklash tartibi kerak.

Joriy deploy ID: `6acb3741c15d91b3903c0995`. Netlify deploy ro‘yxatida kodni oldingi versiyaga qaytarish database yoki media o‘zgarishlarini qaytarmaydi.

2026-10-11 katalog/dizayn yangilanishi: [UZ_MARKET_UPDATE.md](UZ_MARKET_UPDATE.md). 36 ta yopiqroq demo model va 45 ta tasvir jonli tekshirildi; stock/SKU va buyurtmalar tarixi saqlangan. Natija `deploy/uz-catalog-verification.json` da.

Dalil skrinshotlari: `docs/deploy/netlify-public-confirmed.jpg`, `docs/deploy/netlify-live-home.jpg`, `docs/deploy/netlify-live-admin.jpg`.
