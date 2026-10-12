import type {Metadata} from 'next';
import './fonts.css';
import './globals.css';
import './studio.css';
import './polish.css';
import './uz-market.css';
export const metadata:Metadata={title:{default:'Fashion Shop — sizning uslubingiz',template:'%s | Fashion Shop'},description:'Nafis kiyimlar, aniq o‘lchamlar va qulay buyurtma. Fashion Shop kiyim do‘koni uchun ishlaydigan demo.',robots:{index:false,follow:false}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="uz" data-scroll-behavior="smooth"><body>{children}</body></html>;}
