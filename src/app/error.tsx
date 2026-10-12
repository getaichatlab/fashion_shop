'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="empty"><h1>Sahifani yuklab bo‘lmadi.</h1><p>Ma’lumotlaringizni saqlash uchun serverga ulanish zarur.</p><button onClick={reset}>Qayta urinish</button></main>;}
