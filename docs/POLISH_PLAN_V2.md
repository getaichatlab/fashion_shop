# Fashion Shop — assortiment va foydalanishni sayqallash rejasi

Sana: 2026-10-10. Holat: foydalanuvchi tasdiqlagan reja. Quyida boshlang‘ich talab va maqsadlar saqlangan; bajarilgan natija va materialga bog‘liq qolgan ishlar `POLISH_IMPLEMENTATION_V2.md` da.

## Boshlang‘ich holat va maqsad

Joriy ommaviy katalog API tekshiruvida 24 model, 144 rang/o‘lcham varianti, 5 kategoriya va 6 ta takroriy editorial surat bor. Kategoriya suratlari va ayrim mahsulot nomlari bir xil tasvirlardan foydalanadi; masalan, ko‘ylak nomi ostidagi foto ko‘proq palto/shimdan iborat obrazni ko‘rsatishi mumkin. Shu sabab assortiment kengayishi mahsulotga mos materialdan boshlanadi.

Katalog, asosiy filtrlar, mahsulot galereyasi, o‘lchov jadvali, yoqtirganlar, ulashilgan tanlov, savatcha, mehmon buyurtma, yetkazish/olib ketish sozlamalari, qoldiq, hisobot va mahalliy rasm studiyasi mavjud. Reja shu asosni kengaytiradi.

Maqsad: xaridor kerakli kiyim/rang/o‘lchamni tez topishi; do‘kon egasi assortiment va sotuvni kamroq takroriy kiritish bilan boshqarishi; demo ko‘rinishi haqiqiy butik uchun ishonchli bo‘lishi.

Boshlang‘ich assortiment hozirgi ayollar kiyimi yo‘nalishida rejalashtirilgan. Erkaklar, bolalar va aksessuar bo‘limlari do‘konning haqiqiy yo‘nalishiga qarab keyin yoqiladi. Brend, kolleksiya va kategoriyalar yangi egaga moslab o‘zgartiriladigan bo‘ladi.

## 1. Assortiment: 72 ta modelga bosqichma-bosqich kengaytirish

Model — alohida kiyim turi/dizayni. Variant — shu modelning rang × o‘lcham kombinatsiyasi. Masalan: “Midi ko‘ylak → qora → M”. Mavjud bo‘lmagan kombinatsiya uchun soxta qoldiq yaratilmaydi.

| Kategoriya | Rejadagi model soni |
|---|---:|
| Ko‘ylaklar | 12 |
| Kostyum va komplektlar | 8 |
| Shimlar | 8 |
| Jinsi kiyimlar | 6 |
| Yubkalar | 6 |
| Top va futbolkalar | 8 |
| Ko‘ylak va bluzkalar | 6 |
| Sviter va kardiganlar | 8 |
| Palto va trenchlar | 6 |
| Kurtkalar | 4 |
| **Jami** | **72** |

Ko‘pchilik model uchun 2–4 rang va 3–5 mos o‘lcham rejalashtiriladi; tanlangan mavjud kombinatsiyalarga qarab demo taxminan 500–900 variant bo‘lishi mumkin. XS–XXL, 36–44 yoki One size kategoriya va haqiqiy kiyim yorlig‘iga qarab qo‘llanadi.

Har bir model kartasi: nom/SKU, kategoriya, mato tarkibi, bichim, mavsum, foydalanish vaziyati, narx, mavjud variantlar va parvarish ko‘rsatmasi. Rangga mos media bog‘lanadi. Rang tanlanganda shu rangning rasmlari ochiladi; shu rang uchun mavjud o‘lchamlar ko‘rsatiladi. Rangga tegishli rasm bo‘lmasa, shu rang tasdiqlanganidek boshqa rang fotosi ko‘rsatilmaydi; holat tushuntiriladi.

Rasm maqsadi: har modelga old ko‘rinish va kamida yana bitta mos ko‘rinish; material bo‘lsa orqa, detal va 5–10 soniyalik video. Suratning nom, kategoriya va rangga mosligi sonni ko‘paytirishdan ustun. Bir modelning rasmi turli nomdagi mahsulotlarni sun’iy ko‘paytirish uchun ishlatilmaydi. Telefon fotosi rasm studiyasida tayyorlanadi. Ranglar dastur orqali bo‘yab yaratilmaydi.

Demo uchun foydalanishga ruxsatli, mahsulot turiga mos real suratlar; haqiqiy do‘kon uchun egasining tasdiqlangan tovar fotosi ishlatiladi. Demo ma’lumotlari namuna sifatida belgilanadi. Surat yetarli bo‘lmasa mahsulot qoralamada qoladi. Avval 36 ta yaxshi tayyorlangan model, keyin material bilan 72 ta modelga chiqish tavsiya qilinadi.

**Qabul mezoni:** bitta variant alohida SKU va qoldiqqa ega; rang almashtirish galereya hamda mavjud o‘lchamlarni moslashtiradi; tugagan kombinatsiyani savatchaga qo‘shib bo‘lmaydi; avvalgi buyurtma tarixi va variant identifikatorlari saqlanadi.

## 2. Dizayn: nafis butik va kundalik xarid qulayligi

Hozirgi iliq oq, to‘q matn va bordo aksentni tartibli dizayn tizimiga yig‘ish: sarlavha/matn o‘lchamlari, tugmalar, maydonlar, kartalar va xabarlar bir xil qoidalarga bo‘ysunadi. Kundalik matn 14–16 px, mobil forma maydonlari 16 px; asosiy mobil boshqaruvlar kamida 44 px bosish maydoniga ega bo‘ladi. Oq fonda juda xira matn qo‘llanmaydi.

Bosh sahifa tartibi:

1. Yangi kolleksiya uchun katta foto, qisqa sarlavha va aniq katalog tugmasi.
2. Kategoriyalar va “Kundalik / Ish uchun / Bayram / Mavsum” tanlovlari.
3. Yangi kelgan modellar.
4. Do‘kon tayyorlagan 2–4 kiyimdan iborat obrazlar.
5. Budjet bo‘yicha tanlovlar.
6. Eng ko‘p sotilganlar — haqiqiy yakunlangan sotuv bo‘lsa; aks holda egasining “Tanlangan modellar” kolleksiyasi.
7. Do‘kon, olish shartlari va bog‘lanish.

Katalog fotosi uchun bir xil 4:5 ramka; kiyimning yengi/etagi kesilmasligi tekshiriladi. Editorial banner rasmlari alohida ko‘rinishga ega. Kartada ranglar, mavjud o‘lchamlar, narx va ko‘rish tugmasi o‘qiladigan tartibda joylashadi.

Harakatlar: banner slayderida boshqarish/pauza, kartaning ikkinchi rasmini ochish, yengil paydo bo‘lish, 150–250 ms o‘tishlar, katta ekranlarda tanlangan elementga juda yengil perspektiva. Mobil variantda asosiy harakatlar tap va swipe orqali ishlaydi. Animatsiyani kamaytirish tanlanganda ortiqcha harakatlar to‘xtaydi. 3D dekor butun katalog yoki admin jadvallariga yuklanmaydi.

Mobil: pastki navigatsiya, mahsulotda ko‘rinib turadigan xarid paneli, filtrlarning pastdan ochiladigan oynasi, swipe galereya. Panellar bir-birini, narxni yoki oxirgi maydonni berkitmaydi; ekran xavfsiz chetlari hisobga olinadi. Katalogdan mahsulotga o‘tib qaytganda filtr va joylashuv tiklanadi.

**Qabul mezoni:** 320, 390, 768, 1024 va 1440 px da sahifa gorizontal chiqmaydi; uzun nom, ko‘p rang, xabar va bo‘sh holatlarda ustma-ust tushish yo‘q; klaviatura bilan ishlash va fokus ko‘rinishi saqlanadi.

## 3. Xaridor uchun ustuvor imkoniyatlar

| Imkoniyat | Rejadagi ishlash tartibi | Foyda |
|---|---|---|
| Tez ko‘rish | Katalogning o‘zida foto, rang, o‘lcham va savatchaga qo‘shish; variant tanlash majburiy | Har model uchun alohida sahifa ochish kamayadi |
| Qidiruvni yaxshilash | SKU, nom, kategoriya, mato; apostrof variantlari va kelishilgan sinonimlar; 0 natijada mos alternativalar | “ko‘ylak/koylak” kabi yozuvlarda qidirish qulay |
| Kengaytirilgan filtr | Mavjud rang/o‘lcham, mato, bichim, mavsum, vaziyat va narx oralig‘i; faol filtrlar ko‘rinadi | Keraksiz modellar qisqaradi |
| Saralash va sahifalash | Haqiqiy kelgan sana, narx, sotilgan son; avval 24 karta, keyin yana yuklash | Katalog kattalashganda tezlik saqlanadi |
| Rangga mos galereya | Rang tanlansa aynan shu rang media va o‘lchamlari ochiladi | Xaridorga nima olayotgani aniq |
| 2–3 modelni taqqoslash | Narx, mato, bichim, o‘lchov va mavjudlik yonma-yon | O‘xshash modellarni tanlash oson |
| Ko‘rgan kiyimlar | Shu qurilmada yaqinda ko‘rilgan modellar; narx/qoldiq joriy ma’lumotdan | Yo‘qotilgan tanlov tez topiladi |
| O‘lchovni taqqoslash | Mavjud jadvalni rasmli o‘lchash yo‘riqnomasi va o‘zingizdagi kiyim o‘lchovi bilan solishtirish | S/M/L farqini tushunish oson |
| Buyurtma yo‘lini sayqallash | Narx, tanlangan variant, olish usuli va yakuniy tekshirish; xato joyi aniq ko‘rsatiladi | Rasmiylashtirishda chalkashlik kamayadi |

Mavjud yoqtirganlar, ulashilgan tanlov, mavjudlik so‘rovi va sotuvchiga savol yangi dizaynga moslanadi. Tavsiya kartalari kategoriya, bichim, narx oralig‘i va mavjudlik kabi oddiy qoidalardan foydalanadi; AI yoki pullik xizmat talab qilinmaydi.

O‘lchov jadvali bo‘lmagan mahsulotda avtomatik mos kelish da’vosi chiqmaydi; sotuvchidan aniqlashtirish imkoniyati qoladi. “Yangi”, “Ko‘p ko‘rilgan” va “Ko‘p sotilgan” belgilarining ma’nosi farqlanadi. Soxta qoldiq, reyting yoki xaridor soni yaratilmaydi.

**Qabul mezoni:** narx va qoldiq buyurtma serverida qayta tekshiriladi; tez ko‘rish, to‘liq sahifa va obrazdan qo‘shish bir xil variantni ishlatadi; ortga qaytish savatcha va filtrni yo‘qotmaydi.

## 4. Creative va foydali savdo imkoniyatlari

**A. Tayyor obrazlar — birinchi tavsiya.** Admin mos 2–4 ta mahsulotni bitta obrazga bog‘laydi: “Ish kuni”, “Kundalik sayr”, “Bayram”, “Kuzgi obraz”. Xaridor har bir mahsulot uchun o‘z rang/o‘lchamini tanlaydi; tanlangan qismlarni savatchaga qo‘shadi. Bitta qism tugasa qolganini olish va mavjud muqobilni ko‘rish mumkin. Umumiy narx tanlangan variantlar bo‘yicha hisoblanadi. Bu virtual kiyib ko‘rish funksiyasi emas.

**B. “Uslubimni topish” — ikkinchi tavsiya.** Uch qisqa tanlov: qayerga kiyiladi, budjet, o‘lcham. Natija admin kiritgan teglar va mavjud qoldiqdan chiqadi. Javoblar shu qurilmada ixtiyoriy saqlanadi; hisob yaratish talab qilinmaydi.

**C. Do‘konda kiyib ko‘rish uchun band qilish — ixtiyoriy.** Egasi yoqsa band muddati va ish vaqtiga mos kelish vaqtini belgilaydi. Xaridor tanlangan variantni so‘raydi; sotuvchi tasdiqlaydi. Band qoldiq sotuv bilan bir xil tranzaksiya qoidalariga bo‘ysunadi. Bu imkoniyat bo‘lmasa interfeysda ko‘rinmaydi.

**D. QR orqali mahsulotni ochish.** Mahsulot yorlig‘i yoki vitrina kartasidagi QR saytdagi haqiqiy modelga olib boradi: mavjud o‘lcham/rang va o‘lchov ko‘rinadi. Sotuvchi uchun SKU/QR tez qidiruv bilan bog‘lanadi.

**E. Keyingi bosqich: haqiqiy xaridor fikri va O‘zbekcha/Ruscha interfeys.** Fikr yakunlangan buyurtma bilan bog‘lanadi; demo uchun soxta sharh yaratilmaydi. Ikki tilda mahsulot matnlarini egasi kiritadi; barcha narx, variant va qoldiq umumiy qoladi.

Ustuvorlik: A va B birinchi demo uchun, D admin savdo oynasi bilan, C do‘kon siyosatiga qarab; E asosiy yangilanishdan keyin.

## 5. Egasi uchun admin panel

**Kundalik boshqaruv oynasi.** Bugungi tasdiq kutayotgan buyurtmalar, javobsiz savollar, kam qoldiq, tayyorlanmagan mahsulotlar va zarur amallar. Har karta tegishli ish oynasini ochadi. Mavjud hisobotlar shu vazifalarga bog‘lanadi.

**Rang × o‘lcham jadvali.** Rang qatorlari, o‘lcham ustunlari; har katakda qoldiq, band son va SKU. Ranglar hamda o‘lchamlar tanlanganda kombinatsiyalar bir marta yaratiladi, haqiqiy mavjud bo‘lmagan katak o‘chiriladi. Variantga kerak bo‘lsa alohida narx qo‘yiladi; aks holda model narxi ishlaydi. Sotilgan/band variantning identifikatori va tarixi yo‘qotilmaydi.

**Tezkor mahsulot kiritish.** Shablon, nusxalash, bir nechta surat, media tartibini surish, rangga bog‘lash va CSV import. Nusxalash yangi model/SKU yaratib, qoralama va 0 qoldiqdan boshlanadi. CSV avval preview qiladi; takroriy SKU, xato rang/o‘lcham, narx va qoldiqni ko‘rsatadi. Tasdiqlanmaguncha baza o‘zgarmaydi. Joriy qoldiqni almashtirish va yangi kirim kiritish amallari farqlanadi.

**Bir nechta mahsulot bilan ishlash.** Tanlangan modellarni kolleksiyaga qo‘shish, arxivlash yoki kelishilgan narx o‘zgarishini preview qilish. Nashr uchun foto/narx/variant tekshiruvi va tasdiq saqlanadi. Narxni ommaviy o‘zgartirish oldidan qancha mahsulotga tegishi aniq ko‘rinadi.

**Do‘kondagi tezkor sotuv.** SKU/QR yoki nom bilan qidirish → rang/o‘lcham → miqdor → to‘lov qaydi. Operatsiya muvaffaqiyatli saqlanganda qoldiq yangilanadi; takror yuborilgan so‘rov ikki marta sotuv yaratmaydi. Band qoldiq sotilmaydi. Qaytarish/almashish asl sotuv bilan bog‘lanib, kim va qachon bajargani qayd qilinadi.

**Kirim va inventar tekshiruvi.** Yangi kelgan tovarlar, tuzatish sababi va qoldiq harakati tarixi. Inventar sanash preview orqali ko‘rib chiqiladi. Savdo/band o‘zgargan bo‘lsa tasdiqlashda qayta tekshiriladi.

**Kolleksiya va kontent boshqaruvi.** Kategoriya, mavsum, obraz, banner va bosh sahifa bloklarini qo‘shish/tartiblash/yashirish. Mobil/kompyuter preview. Egasi ko‘rinishni kodga tegmasdan o‘zgartiradi; kontrast va uzun sarlavhalar tekshiriladi.

**Rasm studiyasini qulaylashtirish.** Katalog/kvadrat/Story uchun brend presetlari, navbatdagi rasmlar, tahrir qoralamasini qayta ochish. Bir necha rasm ketma-ket hisoblanadi, har natija alohida tekshiriladi. Ko‘rinmagan natija avtomatik tasdiqlanmaydi. Qoralama manba, kesish/aylantirish, niqob va kompozitsiyani tiklaydi; saqlash cheklovi yoki xatosi aniq ko‘rsatiladi.

**Amaliy tahlil.** Ko‘rilgan → savatchaga qo‘shilgan → buyurtma → yakunlangan sotuv; topilmagan qidiruvlar; qaysi rang/o‘lcham ko‘p so‘ralgani; kam qolgan yoki uzoq sotilmagan modellar. Takroriy hodisalar kamaytiriladi, QA/demo yozuvlari haqiqiy savdo hisobiga aralashtirilmaydi. Hisobot “tushum”, “ko‘rilish” va “yakunlangan sotuv”ni alohida ko‘rsatadi. Ma’lumot yetarli bo‘lmasa foyda summasi taxmin qilib chiqarilmaydi.

**Ruxsatlar.** Egasi sozlama, xodim va ommaviy o‘zgarishlarni boshqaradi. Sotuvchi kundalik ruxsat berilgan vazifalarni bajaradi. Cheklovlar faqat tugmani yashirish bilan emas, API darajasida ham qo‘llanadi.

## 6. Do‘konga qarab o‘zgaradigan holatlar

| Do‘kon holati | Saytda va panelda kutiladigan natija |
|---|---|
| Yetkazish yo‘q | Olib ketish va amaldagi bog‘lanish; yetkazish manzili so‘ralmaydi |
| Yetkazish bor | Hudud va narx/shartlar; xizmat bo‘lmagan hududga buyurtma tasdiqlanmaydi |
| Narx kelishiladi | Yetkazish bepul deb yozilmaydi; jami aniqlashtirilishi ko‘rinadi |
| Telefon orqali xizmat | So‘rov panelda saqlanadi, belgilangan telefon orqali aloqa |
| Telegram/Instagram havolasi bor | Egasi kiritgan tasdiqlangan havola ko‘rsatiladi |
| Onlayn buyurtma vaqtincha yopiq | Katalog ochiq, qabul holati va bog‘lanish yo‘li aniq |
| Bir rang yoki One size | Keraksiz ko‘p bosqich bo‘lmaydi, tanlangan qiymat aniq ko‘rinadi |
| Variant tugagan | Buyurtmaga qo‘shilmaydi; mavjudlik so‘rovi yoki mos muqobil |
| Obrazning bir qismi tugagan | Qolgan qismlar alohida tanlanadi; mavjud alternativalar |
| Media/o‘lchov yetishmaydi | Soxta rang yoki moslik da’vosi chiqmaydi; admin tayyorlash ro‘yxatida ko‘radi |

Telegram bot demo tasdiqlangandan keyingi alohida bosqichligicha qoladi. Mahsulot/variant/buyurtma/obraz ma’lumotlari kelajakdagi bot bilan umumiy ishlashga tayyorlanadi.

## 7. Ketma-ket ishlab chiqish

| Bosqich | Asosiy ish | Tekshiriladigan natija |
|---|---|---|
| 1. Ma’lumot va material | Zaxira, kategoriya/atribut, rang media, SKU va narx tuzilmasi; 36 model uchun material saralash | Eski buyurtma/qoldiq saqlangan, rasmlar kiyimga mos |
| 2. Xaridor dizayni | Dizayn tizimi, bosh sahifa, katalog, qidiruv/filtr, tez ko‘rish va galereya | 5 ekran kengligi, rang/variant va navigatsiya to‘g‘ri |
| 3. Admin kundalik ish | Variant jadvali, nusxalash, import preview, kirim va tezkor sotuv | Band qoldiq himoyalangan, takror sotuv yo‘q, ruxsatlar ishlaydi |
| 4. Creative tanlash | Tayyor obrazlar, uslub/budjet tanlash, taqqoslash va ko‘rganlar | Barcha yo‘llar haqiqiy variant va narxga bog‘langan |
| 5. Assortiment va marketing | Material asosida 72 model, kolleksiyalar, brend presetlari va studiya qoralamasi | Har mahsulot tekshirilgan, avtomatik soxta nashr yo‘q |
| 6. Yakuniy demo | Responsive, accessibility, sotuv/import/qoldiq/eksport sinovlari, tezlik, production build | Xaridor va egasi asosiy ishlarni mustaqil bajara oladi |

Keyingi qo‘shimchalar: do‘konda kiyib ko‘rish bandi, ikki til, tekshirilgan xaridor fikri, real ommaviy saytda SEO va bot. Ular asosiy yangilanishni tugatishdan keyin alohida qo‘shiladi.

Texnik jihatdan mavjud Next.js/React va SQLite asosida davom etiladi. Joriy ID, URL va buyurtma yozuvlari saqlanadi; baza o‘zgarishi zaxira hamda migratsiya bilan bajariladi. Mavjud bazani yangidan demo bilan to‘ldirib, eski ma’lumotni almashtirish qo‘llanmaydi. Barcha loyiha, media va hujjatlar `D:\fr_sayt\fashion_shop` ichida.

## 8. Tayyorlikni baholash

- Xaridor bir modelni topib, rang/o‘lcham tanlab, savatchaga qo‘shishni ko‘rsatmasiz bajara olishi. Demo usability maqsadi: 2 daqiqa ichida.
- Egasi tayyor foto bilan bitta modelning narx va 6 variantini kiritib, qoralama saqlashi. Demo maqsadi: 3 daqiqa ichida; surat olish va qo‘lda ajratish bu vaqtga kirmaydi. Bu o‘lchanadigan maqsad, hozir olingan natija emas.
- 72 model soni material va model kartalari sifat mezonidan keyin baholanadi; soxta surat yoki variantlar bilan son to‘ldirilmaydi.
- 320–1440 px, uzun nomlar, ko‘p variant, bo‘sh natija, xato/uzilgan ulanish va sotuv vaqtida o‘zgarayotgan qoldiq tekshiriladi.
- Tezlik uchun LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 maqsad. Demo laboratoriya natijasi va haqiqiy ommaviy trafik alohida baholanadi.
- Savdo natijasi haqiqiy ma’lumot yig‘ilgandan keyin o‘lchanadi: mahsulotdan savatchaga o‘tish, buyurtmani yakunlash, rang/o‘lcham xatolari va mahsulot kiritish vaqti. Savdo o‘sishiga oldindan kafolat berilmaydi.

AI, pullik rasm API yoki har bir tavsiya uchun tashqi to‘lov talab qilinmaydi. O‘z serveridagi saqlash, domen/hosting va haqiqiy media tayyorlash ushbu funksiyalardan alohida xarajat/ish bo‘lib qoladi.

## Manbalardan olingan yo‘nalishlar

- MANGO — vaziyat/mavsum bo‘yicha kolleksiya, katalog ko‘rinishini boshqarish va kombinatsiyalash g‘oyalari: https://shop.mango.com/us/en/c/women/summer-outfits/9603ad09
- UNIQLO — mahsulotga bog‘langan tayyor kiyinish misollari: https://faq-us.uniqlo.com/articles/en_US/Knowledge/What-is-StyleHint/?fs=RelatedArticle&l=en_US&q=womens
- UNIQLO — mahsulot bichimiga qarab o‘lchovlarni taqqoslash: https://faq-uk.uniqlo.com/pkb_Home?fs=RelatedArticle&id=kA0Vh0000001QlF&l=en_US&q=womens+clothing+stores+columbus+ohio
- ZARA — rang/o‘lcham mavjudligi, tugagan variant haqida so‘rov va savatcha band qilmasligi: https://www.zara.com/us/en/help-center/ItemsAvailability
- Google web.dev — tezlik maqsadlari: https://web.dev/articles/vitals

Bu brendlarning funksional yondashuvlaridan namuna olinadi. Bizning ranglar, brend, sahifa tartibi va mahsulot materiallari do‘konga mos ishlab chiqiladi.
