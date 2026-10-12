export type Variant = {id:string; sku?:string; price?:number|null; color:string; hex:string; size:string; stock:number; reserved:number; available:number};
export type Product = {id:string; slug:string; code:string; name:string; category:string; price:number; oldPrice:number; description:string; fabric:string; fit?:string; season?:string; occasions?:string[]; collections?:string[]; colorMedia?:Record<string,string[]>; isDemo?:boolean; measurements:string; status:'draft'|'published'|'archived'; media:string[]; video:string; badge:string; variants:Variant[]; createdAt:string};
export type Look = {id:string; name:string; occasion:string; productIds:string[]; active:boolean};
export type StorefrontData = {products:Product[];settings:Settings;merchandising:Merchandising;sales:Record<string,number>};
export type Banner = {title:string;subtitle:string;image:string;href:string};
export type Merchandising = {looks:Look[]; categories:string[]; blocks:string[]; hiddenBlocks:string[];banners?:Banner[]};
export type Settings = {name:string; tagline:string; phone:string; address:string; hours:string; telegram:string; instagram:string; delivery:boolean; pickup:boolean; zones:string; deliveryMode:'fixed'|'quote'; deliveryFee:number; freeAbove:number; accepting:boolean; paymentMethods:string[]; reservationMinutes:number; returnPolicy:string; heroTitle:string; heroSubtitle:string; heroImage:string; accent:string};
export type CartItem = {productId:string; variantId:string; quantity:number; price:number};
export type Order = {isDemo?:boolean;id:string; token:string; customer:string; phone:string; method:string; address:string; zone:string; payment:string; note:string; status:string; paymentStatus:string; subtotal:number; fee:number|null; total:number; items:any[]; history:any[]; createdAt:string; reservedUntil:string};
// Browser and server ICU versions differ for uz-UZ grouping. Keep SSR and the
// hydrated UI identical, with the space separator used for local prices.
export const money=(value:number)=>new Intl.NumberFormat('en-US').format(value).replaceAll(',', '\u00a0')+' so‘m';
export const orderLabels:Record<string,string>={new:'Yangi',confirmed:'Tasdiqlangan',preparing:'Tayyorlanmoqda',ready:'Olib ketishga tayyor',shipped:'Yetkazishga topshirilgan',completed:'Yakunlangan',cancelled:'Bekor qilingan',expired:'Ajratish muddati tugagan',returned:'Qaytarilgan'};
