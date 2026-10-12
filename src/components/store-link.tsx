'use client';
import Link from 'next/link';
import type {ComponentProps} from 'react';

export default function StoreLink({href,scroll,onNavigate,...props}:ComponentProps<typeof Link>){
 const catalog=typeof href==='string'&&href.split(/[?#]/)[0]==='/catalog';
 return <Link {...props} href={href} scroll={catalog?false:scroll} onNavigate={event=>{
  // An explicit catalog link starts a fresh selection. Browser Back keeps its saved position.
  if(catalog){
   const query=new URLSearchParams((href as string).split('?')[1]?.split('#')[0]||'').toString();
   try{sessionStorage.removeItem('fs-catalog:'+query);}catch{}
   if(location.pathname==='/catalog'&&new URLSearchParams(location.search).toString()===query)window.scrollTo({top:0,behavior:'instant'});
  }
  onNavigate?.(event);
 }}/>;
}
