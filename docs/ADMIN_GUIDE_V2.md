# Sayqallangan demo — egasi uchun qo‘llanma

Sayt: http://127.0.0.1:3100. Panel: http://127.0.0.1:3100/admin. Login/parol `data/admin-access.txt` da; uni mijozga yoki ommaga ulashmang.

## Demo ko‘rsatish: xaridor tomoni

1. Bosh sahifada kategoriya yoki vaziyatni tanlang. Katalogdan SKU yoki “koylak” deb qidiring; M o‘lcham, budjet va mavjudlikni belgilang.
2. **Tez ko‘rish** ni oching, haqiqiy rang/o‘lchamni tanlang va savatchaga qo‘shing. Rangning fotosi yo‘q bo‘lsa ogohlantirish chiqadi. Tugagan variantni olish mumkin emas.
3. Ikki modelda **Taqqoslash** ni bosing. Narx, tarkib, bichim, mavjud o‘lcham va berilgan kiyim o‘lchovlarini solishtiring. Ma’lumot yo‘q bo‘lsa sotuvchidan aniqlashtiriladi.
4. **Uslubimni topish** da vaziyat, bitta model uchun budjet va o‘lchamni tanlang. Natija kiritilgan teg va mavjud variantlardan olinadi.
5. **Tayyor obrazlar** da har qism uchun variantni tanlang. Qismlarni alohida ham olish mumkin; jami tanlangan variantlarning narxidir.
6. Demo buyurtma bering. Yetkazish yoqilmagan bo‘lsa manzil so‘ralmaydi. Savatcha kiyimni band qilmaydi; buyurtma saqlanganda server narx/qoldiqni tekshiradi va variant band qilinadi.
7. Paneldan demo buyurtmani bekor qiling yoki yakunlang; bekor qilish band qoldiqni bo‘shatadi. Haqiqiy savdo hisobotini namuna buyurtma bilan aralashtirmang.

## Bitta mahsulotni tayyorlash

Mahsulotlar oynasi dastlab **Joriy assortiment** — e’lon qilingan va qoralamalarni ko‘rsatadi. Arxiv yoki barcha yozuvlar holat filtridan ochiladi.

**Mahsulotlar → Yangi mahsulot**. Nom, kategoriya, narx, tavsif, ma’lum mato tarkibi, bichim, mavsum va vaziyatni kiriting. Haqiqiy o‘lchovlar bo‘lsa jadvalga yozing. **Demo mahsulot** belgisi namuna kartalarini haqiqiy savdodan ajratadi.

Rang va o‘lchamlar bilan kombinatsiyalarni bir marta yarating. Yangi kataklar 0 qoldiqdan boshlanadi. Har variantning SKU si takrorlanmasin; kerak bo‘lsa variant narxini yozing, bo‘sh qoldirilsa model narxi ishlaydi. Band son kamaytiriladigan jami qoldiqdan oshmasligi kerak. Pastdagi variant ro‘yxati orqali rang/tusni tuzating yoki mavjud bo‘lmagan kombinatsiyani olib tashlang. Eski variantning tarixiy ID si bazada saqlanadi.

Bir nechta real suratni yuklang; ular navbat bilan saqlanadi. Tartib tugmalari bilan asosiy suratni tanlang va fotosuratni o‘z rangiga bog‘lang. Boshqa rangga bo‘yab “yangi foto” yaratilmaydi. **Fon / reklama** studiyasida natijani tayyorlab, nusxani mahsulotga qo‘shing. Bu asl faylni saqlaydi va nashr tasdig‘ini qayta talab qiladi. Foto/narx/variantlarni tekshirib, tasdiq qo‘ying va e’lon qiling.

Nusxalash yangi ID/SKU, 0 qoldiq va qoralama beradi. Nusxa nomi, media, variant va tovar qoldig‘ini alohida tekshiring. Boshqa xodim sotuv/qoldiqni o‘zgartirgan bo‘lsa eski ochiq forma saqlanmaydi: qayta ochib, yangilangan ma’lumotga o‘zgartirish kiriting.

## Mahsulot CSV importi

Egasi uchun **Mahsulotlar → CSV import**. UTF-8, vergul bilan ajratilgan CSV; bir modelning rang/o‘lchami alohida qatorlarda, bir xil kod/nom/kategoriya/narx bilan keladi:

```csv
code,name,category,price,color,hex,size,stock,sku
SHOP-001,Oddiy oq top,Toplar,150000,Oq,#ffffff,S,3,SHOP-001-WHITE-S
SHOP-001,Oddiy oq top,Toplar,150000,Oq,#ffffff,M,5,SHOP-001-WHITE-M
```

**Importni tekshirish** ma’lumotni yozmaydi. Xatolarni tuzating, modellar va variant sonini ko‘ring, keyin tasdiqlang. Takroriy SKU/kod va mos kelmagan model maydonlari rad etiladi. Import to‘liq tranzaksiyada saqlanadi va faqat qoralama yaratadi; foto hamda nashr tasdig‘i keyin qo‘shiladi. Bir xil tasdiqni qayta yuborish ikkinchi nusxa yaratmaydi. Preview 10 daqiqa amal qiladi.

## Sotuv, kirim va qaytarish

**Qoldiq va sotuv** oynasida SKU, nom yoki QR dagi mahsulot havolasini qidiring. Variant, miqdor va Naqd/Terminal/O‘tkazma qaydini tanlab sotuvni saqlang. Bu to‘lov provayderidan pul yechmaydi — do‘kondagi haqiqiy to‘lov qaydidir. Band qoldiq savdoga berilmaydi.

CSV formati:

```csv
sku,quantity
SHOP-001-WHITE-S,4
SHOP-001-WHITE-M,7
```

- **Yangi kirim**: miqdorni jami qoldiqqa qo‘shadi; egasi va sotuvchi bajarishi mumkin.
- **Inventar sanash**: quantity jami qoldiq bo‘ladi; faqat egasi bajaradi. Band sondan past jami rad etiladi.

Avval oldingi/band/keyingi sonlarni tekshiring, sabab yozing va tasdiqlang. Previewdan keyin sotuv yoki band holati o‘zgarsa import rad etiladi; yangi preview oling. Harakat tarixida sabab, sana va kim bajargani qoladi.

**Qaytarish** asl do‘kon sotuviga bog‘lanadi; sotilganidan ortiq qaytarib bo‘lmaydi. **Qayta sotuvga yaroqli** belgisini faqat kiyim tekshirilgandan keyin yoqing — shundagina qoldiq qaytadi. Almashtirish: asl sotuvni qaytarish, keyin yangi variantga yangi sotuv. Onlayn buyurtma holatlari **Buyurtmalar** oynasida boshqariladi.

## Kontent, QR va hisobot

**Sayt kontenti** da kategoriya tartibi, 2–4 mahsulotli obraz, 5 tagacha banner va bosh sahifa bloklari o‘zgartiriladi. Bo‘limni yashirish mahsulotni arxivlamaydi. Saqlagach preview havolasini oching; telefon yoki kompyuter kengligida tekshiring. Do‘kon kontakti, bannerning umumiy sozlamalari, yetkazish va ish vaqti ham shu oynada/do‘kon sozlamalarida.

QR PNG shu brauzerda yaratiladi. Lokal manzil faqat shu kompyuter uchun; mijozlarga yorliq berishdan oldin haqiqiy domenni sozlang. Yorliqda model va variant SKU lari bor.

**Hisobotlar** dastlab haqiqiy ma’lumotni ko‘rsatadi. Demo/QA rejimini yoqsangiz namuna ko‘rish/buyurtma/sotuvlarni ko‘rasiz. Yangi ko‘rish va savatcha hodisalari yangilanishdan boshlab yig‘iladi; eski umumiy ko‘rilish soni orqaga sun’iy taqsimlanmaydi. “Tushum” yakunlangan onlayn va qaytarishlari hisobga olingan do‘kon savdosidir; tannarx ma’lum bo‘lmagani uchun foyda taxmin qilinmaydi.

Egasi mahsulot, import, ommaviy o‘zgarish, kontent, inventar sanash va xodimlarni boshqaradi. Sotuvchi buyurtma, murojaat, kundalik sotuv, kirim va qaytarishni bajaradi. Bu cheklovlar serverda ham tekshiriladi.

Studiyadan foydalanish: `STUDIO_GUIDE.md`. Zaxira: loyiha ichidagi `BACKUP.cmd`. Telegram bot demo tasdiqlangach alohida ishlab chiqiladi.
