# Kiyim suratini tayyorlash — admin qo‘llanmasi

`http://127.0.0.1:3100/admin/studio` yoki mahsulot formasidagi **Fon / reklama** tugmasini oching. Admin kirish ma’lumotlari `data/admin-access.txt` ichida.

## Ish tartibi

1. Mahsulot suratini tanlang yoki **Boshqa surat yuklash** orqali telefon fotosini kiriting. JPG, PNG va WebP qabul qilinadi; asosiy surat 25 MB, fon 10 MB gacha. Asl fayl alohida saqlanadi.
2. **Ramka** bilan kiyim yoki model atrofini chizing. Barcha yeng, etak, kamar va kerakli detallar ramka ichida bo‘lsin. Ramka tashqarisidagi joy boshlang‘ich fon hisoblanadi.
3. **Fonni ajratish** tugmasini bosing. Vosita dastlab mahalliy fayldan yuklanadi. Kichik qurilmada **Tez**, oddiy holatda **Muvozanatli**, mayda chetlarda **Batafsil** aniqlikni tanlang.
4. Xato ajralgan qismlarni belgilang: **Kiyimni saqlash** yashil, **Fonni o‘chirish** qizil. Kiyim ichiga va noto‘g‘ri qolgan fon ichiga qisqa chiziqlar chizing. **Ajratishni qayta hisoblash** asl surat va barcha belgilardan foydalanadi. Kerak bo‘lsa takrorlang.
5. Cho‘tkalar natijani bevosita ham tuzatadi. Kattalashtirib, kichik radius va kerakli qattiqlikda yeng, tugma, kiyim naqshi va konturlarni tekshiring. Dumaloq kursor cho‘tka qamrovini ko‘rsatadi. **Surish** kattalashtirilgan suratni siljitadi; **Moslash** butun suratni oynaga joylaydi.
6. **Mayda qoldiqlarni tozalash** ajralib qolgan kichik bo‘laklarni olib tashlaydi. Eng katta bo‘lak va yashil bilan belgilangan bo‘laklar saqlanadi. Chegara surat maydonining 0.05–1% qismidir; standart 0.2%. Alohida kamar, aksessuar yoki tugmani avval yashil bilan belgilang. Kiyimga tutashgan yirik qoldiqni qizil cho‘tka bilan tuzating. Kerakli detal yo‘qolsa amalni bekor qiling.
7. **Oq**, **Qora** va shaffoflik fonlarida konturlarni tekshiring. **Oldin / keyin** ko‘rinishidagi suriladigan chegara orqali taqqoslang. Belgilarni yashirib, yakuniy chetlarni ko‘ring. **Chet yumshoqligi** alfa chegarasini yumshatadi. **Fon chetini tozalash** musbat qiymatda niqobni ichkariga, manfiy qiymatda tashqariga 1–3 manba pikseliga suradi. Kiyimning RGB rangi va naqshi qayta chizilmaydi.
8. Oq katalog, iliq oq, studiya, brend, shaffof yoki o‘zingiz yuklagan fonni tanlang. Kiyim masshtabi, chap/o‘ng, yuqori/past joylashuvi va soyasini sozlang. Brend, mahsulot nomi va narxni qo‘shish ixtiyoriy; yozuvlar o‘qiladigan oq bantlarda chiqadi.
9. Katalog — **1200 × 1500**, reklama — **1080 × 1080**, Story — **1080 × 1920**. Jonli eksport oynasi aynan yuklab olinadigan yoki saqlanadigan rasmni ko‘rsatadi. Kiyim kadrdan chiqsa, yozuv bantlari bilan to‘silsa yoki butunlay o‘chirilsa eksport bloklanadi; joylashuvni tuzating yoki kiyimni tiklang.
10. **Tayyor rasmni yuklab olish** PNG beradi. **Mahsulotga nusxa qo‘shish** tayyor nusxani mahsulot formasiga qo‘shadi, asl suratni saqlaydi. Mahsulotni tekshirib, tasdiq belgisini o‘zingiz qo‘ying va saqlang. Nusxa qo‘shish avtomatik e’lon qilmaydi; qoralama saqlash ham mumkin.

Mobil oynada **1. Ajratish** va **2. Tayyor natija** bo‘limlari orasida o‘ting. Katta oynada ikkala bo‘lim yonma-yon turadi.

## Amalni qaytarish va asl surat

Undo/redo cho‘tka, ramka, ajratish, mayda qoldiq tozalash, kesish, aylantirish, kompozitsiya va asl suratga qaytishni qamraydi. Tarix qurilma xotirasini asrash uchun ko‘pi bilan 12 amal va niqob/surat tarixiga taxminan 48 MB chegarasida saqlanadi. Yangi surat yuklash yangi tahrir boshlaydi. **Asl suratga qaytish** kesish va aylantirishni ham tiklaydi; shu amalni ham bekor qilish mumkin.

**Qoralamani saqlash** orqali tahrirni shu brauzerga yozing. **Qoralamani ochish** manba surat, asl va kesilgan/aylantirilgan piksellar, ramka, yashil/qizil belgilar, alfa niqob hamda kompozitsiyani tiklaydi. Surat manzili ham tiklangani uchun tayyor nusxa asl fayl bilan bog‘lanadi. Oxirgi undo/redo amallari yangi sessiyada tiklanmaydi.

Qoralama IndexedDB da, shu qurilma va brauzerga tegishli; serverning SQLite/media backupiga kirmaydi. Bitta qoralama ma’lumoti 60 MB gacha; xotira yetishmasa yoki brauzer yozishga ruxsat bermasa aniq xabar chiqadi. Brauzer ma’lumotlarini tozalash qoralamani ham o‘chiradi. Zarur asl va tayyor suratlarni mahsulotga saqlang yoki PNG sifatida yuklab oling.

## Brend presetlari va surat navbati

**Katalog**, **Kvadrat reklama** va **Story** presetlari format, fon, joylashuv va yozuv sozlamalarini boshlang‘ich tayyorlaydi. Keyin o‘zingiz tuzatishingiz mumkin. Mahsulot formasida bir nechta surat bo‘lsa studiya ketma-ket navbatni ko‘rsatadi; **Keyingi surat** har safar keyingi faylni ochadi. Har rasm uchun ramka/niqob va tayyor natijani alohida tekshiring. Natijalar avtomatik tasdiqlanib yoki e’lon qilinib ketmaydi.

## Surat olish uchun

- Yetarli yorug‘lik, oddiy va kiyimdan rangi farq qiladigan fon tanlang. Kuchli yer soyasi, kiyim ustidagi chuqur soya va fon bilan tutashgan buyumlarni kamaytiring.
- Kiyim butunligicha ko‘rinsin; kesilgan yeng yoki etakni dastur qayta yaratmaydi.
- Oq kiyimni oq devorda, qora kiyimni qora fonda olmaslik natijani ancha yaxshilaydi. Bunday suratlarda yashil/qizil belgilar va kontur tuzatishi zarur bo‘lishi mumkin.
- To‘r, shaffof mato, ingichka soch, yaltiroq yoki fokusdan chiqqan chetlar avtomatik usul uchun qiyin. Katta ekran va kichik cho‘tka bilan tekshiring.

## Xarajat va ishlash chegarasi

Ajratish klassik GrabCut hisoblash usuli bilan bajariladi. AI modeli, API kaliti, tashqi rasm xizmati va har bir rasm uchun to‘lov yo‘q. OpenCV/WASM fayli loyiha ichida, admin studiyasi ochilganda yuklanadi; birinchi yuklanish taxminan 11 MB. Hisoblash alohida Web Worker’da amalga oshadi. Yuklangan surat ustida qayta hisoblash internet uzilganda ham ishlaydi. Asl surat/fon va tayyor nusxani saqlash do‘konning o‘z serveriga ulanishni talab qiladi.

Universal, istalgan murakkab fonda mukammal bir bosishli ajratish kafolatlanmaydi. Dastur haqiqiy kiyim piksellarini saqlaydi; yetishmayotgan qismlarni yaratmaydi. Shu sabab yakuniy ko‘rinishni admin tasdiqlaydi. Domen va hosting xarajatlari rasm funksiyasidan alohida.

Sinov suratlari va aniq chegaralar: `QA_REPORT.md`, `studio-validation/real-photos.png` va `studio-validation/results.json`.
