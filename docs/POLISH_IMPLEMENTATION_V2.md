# Fashion Shop — V2 bajarilgan natija

Sana: 2026-10-10. Manzil: `D:\fr_sayt\fashion_shop`. Tasdiqlangan talablar: `POLISH_PLAN_V2.md`. Sayt va admin lokal demo uchun ishlab chiqildi; Telegram bot demo tasdiqlangach alohida qo‘shiladi.

## 1. Ma’lumot va assortiment

- Yangilashdan oldingi baza/media zaxirasi: `data/backups/2026-10-10T06-25-43-762Z`.
- Additiv migratsiya variantga SKU, alohida narx va tarix uchun retired holatini qo‘shdi. Mahsulot/buyurtma/variant ID lari o‘chirilmagan; olib tashlangan variant tarixiy bazada qoladi.
- 36 ta mahsulot turiga mos real foto saralandi: `demo-v2-1..36`, `/product/collection-1..36`. Har birining ko‘rinadigan rangiga mos media va S/M/L/XL demo variantlari bor.
- 12 ta yangi media kutayotgan qoralama va 24 ta oldingi demo karta saqlandi. **Jami 72 ta demo model: 36 e’lon qilingan, 36 qoralama.** QA test mahsulotlari bu hisobga kirmaydi.
- Foto yetishmagan karta e’lon qilinmagan; qo‘shimcha rang sun’iy bo‘yab yaratilmagan. Narx/qoldiq/o‘lcham namuna, mato tarkibi va o‘lchov jadvali tasdiqlanmaguncha taxmin bilan to‘ldirilmaydi.
- Foto manbalari va mahalliy fayllar: `CATALOG_ASSETS.json`, `ASSET_CREDITS.md`. Ma’lumot/media saqlanganligi: `data-verification.json`.

## 2. Xaridor dizayni va tanlov

Iliq oq, bordo va o‘qiladigan to‘q matn asosidagi ko‘rinish, 4:5 katalog rasmlari, bosh sahifada kategoriya/vaziyat, yangi kelganlar, obraz, budjet, uslub tanlovi va do‘kon bloki. Slayderni almashtirish/to‘xtatish mumkin; reduced-motion rejimi bezak harakatlarini to‘xtatib, mobil menyu joylashuvini saqlaydi.

Katalog SKU/nom/kategoriya/mato va apostrof variantlarini qidiradi. Filtrlar: rang, o‘lcham, mato, bichim, mavsum, vaziyat, kolleksiya, narx va mavjudlik. 24 karta bilan boshlanadi, keyin yana yuklanadi. Filtr va yuklangan son/sahifa joyi mahsulotdan qaytilganda tiklanadi; shaxsiy filtr qurilmada saqlanadi.

Tez ko‘rish mobil va kompyuterda ishlaydi; modal klaviaturada yopilib, fokus avvalgi tugmaga qaytadi. Rangga tegishli galereya va o‘lchamlar, swipe, kattalashtirish, variant narxi, yoqtirganlar, ulashish va mavjudlik so‘rovi bir xil katalogdan ishlaydi. O‘lchash bo‘yicha rasmli yo‘riqnoma bor; o‘lchovsiz kartada moslik da’vosi chiqmaydi.

2–3 modelni taqqoslash va shu qurilmada yaqinda ko‘rgan kiyimlar qo‘shildi. Narx/qoldiq qayta ochilganda joriy katalogdan olinadi. Server tayyor boshlang‘ich katalogni HTML bilan beradi, keyin faol oynada har 30 soniya va fokusga qaytishda ma’lumot yangilanadi. Buyurtma paytida server yana tekshiradi.

## 3. Egasi va sotuvchi uchun kundalik ish

| Amal | Bajarilgan tartib |
|---|---|
| Rang × o‘lcham | Qoldiq/band/SKU/narx jadvali; mavjud kombinatsiyani saqlaydi, yangi katak 0 qoldiq |
| Foto | Ketma-ket ko‘p fayl yuklash, tartib tugmalari, rang bilan bog‘lash, asl nusxa saqlanishi |
| Nusxalash | Yangi ID/SKU, qoralama, 0 qoldiq |
| CSV yangi model | Tekshiruv va preview; dublikat/xato qatorlar; atomik import, faqat qoralama, takror tasdiqda yangi nusxa yo‘q |
| Ommaviy amal | Tanlangan model soni va narx/arxiv/kolleksiya preview; tasdiq paytida o‘zgarmagan holat talabi |
| Tezkor sotuv | SKU/QR/nom → variant → miqdor → to‘lov; band qoldiq sotilmaydi, takror so‘rov takror sotmaydi |
| Qaytarish | Asl sotuvga bog‘langan, sotilganidan ortiq emas; yaroqlilik tasdiqlansa qoldiq qaytadi |
| Kirim / sanash | Qo‘shish va jami almashtirish alohida; oldingi/band/keyingi preview, sabab va joriy holat tekshiruvi |
| Harakat tarixi | SKU, oldingi/keyingi qoldiq, sabab, kim, vaqt; do‘kon savdosi va yangi yakunlangan onlayn buyurtmalar |
| Ruxsat | Egasi mahsulot/ommaviy amal/import/sanash/kontent/xodim; sotuvchi kundalik savdo/kirim/qaytarish/buyurtma/murojaat |

Ochiq mahsulot formasi eski qoldiqni bosib yubormaydi: revision tekshiruvi o‘zgargan modelni qayta ochishni so‘raydi. Nashr tasdig‘i, origin/session himoyasi va server narx tekshiruvi saqlangan.

## 4. Creative tanlash

**Tayyor obraz** 2–4 haqiqiy modeldan tuziladi; xaridor har qism uchun o‘z variantini tanlaydi, tanlangan qismlarni oladi. Tugagan qism qolganlarini bloklamaydi; mavjud muqobilga havola bor. Jami variant narxlari bilan hisoblanadi.

**Uslubimni topish** vaziyat, budjet va o‘lchamni mavjud teg/qoldiq bilan solishtiradi. Ixtiyoriy tanlov brauzerda saqlanadi. AI xizmati yoki tavsiya uchun to‘lov yo‘q.

## 5. Kontent va rasm studiyasi

Admin kategoriya tartibi, obraz, 5 tagacha banner, bosh sahifa bloklari tartibi va ko‘rinishini boshqaradi. Preview saqlangan saytni ochadi. QR yorlig‘i mahsulot URL va SKU lar uchun brauzerda PNG yaratiladi; mijoz uchun ommaviy domen keyin sozlanadi.

GrabCut studiyasi loyiha ichidagi OpenCV/WASM bilan ishlaydi. Brend presetlari (katalog/kvadrat/Story), ketma-ket foto navbati va IndexedDB qoralama saqlash/ochish qo‘shildi. Manba, asl/current piksellar, transform, niqob, belgilar, ramka va kompozitsiya tiklanadi. Har natija admin tomonidan tekshirilib tasdiqlanadi. Asl kiyim rangi/naqshi qayta chizilmaydi.

## 6. Tahlil va yakuniy demo

Haqiqiy savdo va demo/QA hisoblari ajratildi. Ko‘rish/savatcha/buyurtma/yakunlangan sotuv, netto dona/tushum, topilmagan qidiruv, variant bo‘yicha mavjudlik so‘rovi, kam qoldiq va uzoq sotilmagan model ko‘rsatiladi. Sotuv bo‘lmasa bosh sahifada “Tanlangan modellar” ishlaydi. Tannarx bo‘lmagani uchun foyda yoki savdo o‘sishi taxmin qilinmaydi.

Tekshiruvlar, ekran kengliklari, ishlab turgan build va laboratoriya tezlik natijalari `QA_REPORT.md` hamda `site-performance.json` da. Egasi uchun amallar: `ADMIN_GUIDE_V2.md`; rasm tayyorlash: `STUDIO_GUIDE.md`.

## Material va keyingi bosqichga bog‘liq ishlar

- Qolgan 36 modelni ommaga chiqarish uchun har kiyimga mos foto, haqiqiy rang/o‘lcham/qoldiq, narx va tavsif kerak. Rejadagi kategoriya soni ham shu material bilan to‘ldiriladi. Ko‘pchilik modeldagi ikkinchi ko‘rinish/video egasining media materialiga bog‘liq.
- Do‘konda kiyib ko‘rish uchun band/vaqt belgilash, ikki til, tekshirilgan xaridor fikri, ommaviy SEO va Telegram bot tasdiqlangan rejaning keyingi bosqichlari.
- Haqiqiy to‘lov provayderi, kuryer va ommaviy hosting hozir ulanmagan. Yetkazish/olib ketish sozlamalari va paneldagi to‘lov qaydi mavjud.
- Murakkab fonda yashil/qizil belgi va qo‘lda kontur tekshirish kerak; universal bir bosishli mukammal ajratish da’vosi yo‘q. Brauzer qoralamasi server backupiga kirmaydi.
