'use client';
import {useEffect,useRef} from 'react';
import {X} from 'lucide-react';
async function uploadImage(file:File):Promise<File>{
 if(!file.type.startsWith('image/')||file.size<=3*1024*1024)return file;
 const source=URL.createObjectURL(file);
 try{
 const image=new Image();image.src=source;await image.decode();if(image.width*image.height>40000000)throw Error('Surat 40 megapikseldan kichik bo‘lsin.');
 let scale=Math.min(1,2400/Math.max(image.width,image.height));const mime=file.type==='image/png'?'image/png':'image/jpeg';
 for(let attempt=0;attempt<7;attempt++){
 const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));canvas.getContext('2d')!.drawImage(image,0,0,canvas.width,canvas.height);
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Suratni tayyorlab bo‘lmadi.')),mime,.9));
 if(blob.size<=3*1024*1024)return new File([blob],file.name.replace(/\.[^.]+$/,mime==='image/png'?'.png':'.jpg'),{type:mime});scale*=.8;
 }
 throw Error('Surat juda katta. Uni kichraytirib qayta yuklang.');
 }finally{URL.revokeObjectURL(source);}
}
export async function api(url:string,options:RequestInit={}):Promise<any>{
 if(url==='admin/upload'&&options.body instanceof FormData){
 const input=options.body.get('file');if(input instanceof File){
 if(input.size>25*1024*1024)throw Error('Fayl 25 MB dan kichik bo‘lsin.');const file=await uploadImage(input);
 if(file.size>3*1024*1024){
 const upload=await api('admin/upload-start',{method:'POST',body:JSON.stringify({name:file.name,size:file.size})});
 for(let offset=0,index=0;offset<file.size;offset+=upload.chunkSize,index++)await api(`admin/upload-chunk?id=${encodeURIComponent(upload.id)}&index=${index}`,{method:'PUT',body:file.slice(offset,offset+upload.chunkSize),headers:{'Content-Type':'application/octet-stream'}});
 return api('admin/upload-finish?id='+encodeURIComponent(upload.id),{method:'POST',body:'{}'});
 }
 const body=new FormData();body.set('file',file);options={...options,body};
 }
 }
 const response=await fetch('/api/'+url,{...options,headers:{...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...options.headers}});
 const data=await response.json().catch(()=>({error:'Server javobini o‘qib bo‘lmadi. Qayta urinib ko‘ring.'}));if(!response.ok)throw Error(data.error||'So‘rov bajarilmadi.');return data;
}
export function readLocal<T>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback;}catch{return fallback;}}
export function Modal({title,children,onClose}:{title:string;children:React.ReactNode;onClose:()=>void}){const ref=useRef<HTMLDialogElement>(null);useEffect(()=>{const d=ref.current,previousFocus=document.activeElement;d?.showModal();const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{if(d?.open)d.close();document.body.style.overflow=previous;if(previousFocus instanceof HTMLElement&&previousFocus.isConnected)previousFocus.focus({preventScroll:true});};},[]);return <dialog ref={ref} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===ref.current)onClose();}} className={title==='Rasmni tayyorlash'?'modal studio-modal':'modal'}><div className="modal-head"><h2>{title}</h2><button type="button" className="icon-button" aria-label="Yopish" onClick={onClose}><X/></button></div>{children}</dialog>;}
export function Empty({title,children}:{title:string;children?:React.ReactNode}){return <div className="empty"><span className="eyebrow">FASHION SHOP</span><h2>{title}</h2>{children}</div>;}
export function SafeImage({src,alt,...props}:React.ImgHTMLAttributes<HTMLImageElement>){return <img src={src||'/images/fallback.svg'} alt={alt||''} {...props} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src='/images/fallback.svg';}}/>;}
