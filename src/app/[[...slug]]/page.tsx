import Shop from '@/components/shop';
import {connection} from 'next/server';
import {publicCatalog} from '@/lib/operations';
import {withStorage} from '@/lib/cloud-storage';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export default async function Page(){await connection();const initialData=await withStorage(()=>publicCatalog());return <Shop initialData={initialData}/>;}
