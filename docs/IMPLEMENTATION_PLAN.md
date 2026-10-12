# Fashion Shop — bajarish tartibi

## Chegara

1. Hozir: haqiqiy ma’lumotlar bazasi bilan veb-sayt va admin panel.
2. Egasi demo tasdiqlagach: Telegram bot. Hozir xabar yoki kanal posti yuborilmaydi.
3. Virtual kiyib ko‘rish yo‘q. Pullik AI, SMS va onlayn to‘lov xizmati ulanmagan.

## Ketma-ket bosqichlar

- A: loyiha, dizayn ranglari, 24 namuna mahsulot, lokal media va shriftlar.
- B: baza, mahsulot/variantlar, xavfsiz seans, qoldiq, buyurtma va do‘kon sozlamalari.
- C: bosh sahifa, katalog/filtr, mahsulot, o‘lchovlar, yoqtirganlar, ulashilgan tanlov, savatcha, mehmon buyurtma, holat va yordam.
- D: mahsulotlar, buyurtmalar, sotuv/qoldiq, murojaatlar, hisobot, sayt kontenti, sozlamalar va xodimlar.
- E: asl suratni saqlaydigan fon ajratish, erase/restore, undo, eksport va majburiy nashr tasdig‘i.
- F: hisoblash, integratsiya, responsive va xavfsizlik sinovlari; ishlab chiqarish build.
- G: egasi ko‘rib chiqadigan sayt/admin demo va qo‘llanma.
- H: keyinchalik shu API va ma’lumotlarga ulangan Telegram bot.

## Savdo qoidalari

- Savatcha kiyimni band qilmaydi. Buyurtma yaratilishi paytida vaqtincha band qilinadi.
- Yangi buyurtma muddati tugasa qoldiq bo‘shaydi; sotuvchi tasdiqlagandan keyin avtomatik muddat qo‘llanmaydi.
- Tasdiqlangan buyurtma uchun keyingi bosqichlar olish usuliga mos.
- Tugallangan buyurtmada qoldiq kamayadi. Qaytarilgan kiyim sotuvchi tekshiruvidan keyin qo‘lda qoldiqqa qo‘shiladi.
- Buyurtmaning narxi, variant nomi va surati tarix sifatida saqlanadi.
- Yetkazish mavjud emasligi, hududlar, belgilangan/kelişilgan narx va bepul chegarasi sozlanadi.
- Olib ketish manzil talab qilmaydi. Yetkazish manzil va xizmat hududini talab qiladi.
- To‘lov usullari olish usuliga mos bo‘ladi. Buyurtma holati va to‘lov holati alohida.

## Telegramga tayyor asos

`events`, `requests`, mahsulot qoralamalari, qoldiq/sotuv amallari va buyurtma holatlari umumiy bazada. Bot bosqichida tekshirilgan foydalanuvchi bog‘lanishi, ruxsatlar, xabar navbati va yuborish belgilari qo‘shiladi. Demo davri voqealari avtomatik yuborilmaydi.

## Infratuzilma

Demo Node 24 ichidagi SQLite bilan lokal, tranzaksiyali va saqlanadigan tarzda ishlaydi. Avvalgi PostgreSQL tavsiyasiga o‘tish ommaviy ko‘p serverli joylashtirish kerak bo‘lganda bajariladi. SQLite ma’lumotlari vaqtinchalik serverless diskka joylashtirilmaydi. Lokal demo uchun Docker yoki pullik baza kerak emas.
