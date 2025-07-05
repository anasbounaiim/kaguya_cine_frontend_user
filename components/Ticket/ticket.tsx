/* app/ticket/page.tsx
   —————————————————————————————————————————————————————————— */
   'use client'

   import { useSearchParams } from 'next/navigation'
   import Image from 'next/image'
   import Link  from 'next/link'
   import { useEffect, useState } from 'react'
   import { Home, Download } from 'lucide-react'
   import { Button } from '@/components/ui/button'
   
   /* ────────── mini helpers ────────── */
   const TMDB = 'https://api.themoviedb.org/3'
   const KEY  = '8099992c2241e752e151a9908acef357'
   
   /* price & seat lookup */
   const MASK=[ '0011111111111000','0011111111111000','0011111111111000','0001111111110000','0001111111110000','0000111111100000','0000111111100000']
   const VIP=['F','G'],PREM=['D','E']
   type Seat={id:string;row:string;price:number;type:'vip'|'premium'|'standard'}
   const seatLookup:Record<string,Seat>={}
   MASK.forEach((row,r)=>{const L=String.fromCharCode(65+r);let n=1
     row.split('').forEach(b=>{
       if(b==='1'){const type=VIP.includes(L)?'vip':PREM.includes(L)?'premium':'standard'
         seatLookup[`${L}${n}`]={id:`${L}${n}`,row:L,price:type==='vip'?120:type==='premium'?75:50,type};n++}
     })
   })
   
   /* Movie type definition */
   interface Movie {
     title: string;
     backdrop_path: string;
     // Add other fields as needed
   }

   /* ————————————————— component ————————————————— */
   export default function Ticket(){
     const qs = useSearchParams()
   
     /* fetch movie meta */
     const [movie,setMovie]=useState<Movie|null>(null)
     useEffect(()=>{
       const id=qs.get('movie'); if(!id) return
       fetch(`${TMDB}/movie/${id}?api_key=${KEY}&language=fr-FR`).then(r=>r.json()).then(setMovie)
     },[qs])
   
     /* data from query */
     const seatsId  =(qs.get('seats')??'').split(',').filter(Boolean)
     const seats    = seatsId.map(id=>seatLookup[id])
     const seatText = seatsId.join(', ')
     const holder   = `${qs.get('firstName')??'—'} ${qs.get('lastName')??''}`.trim()
     const version  = qs.get('version') ?? 'VF'
     const hall     = qs.get('hall')    ?? 'Salle 7'
     const showDate = qs.get('date')    ?? '24 Juin 2025'
     const showTime = qs.get('time')    ?? '21:00'
     const subtotal = seats.reduce((s,seat)=>s+seat.price,0)
     const fees     = 5
     const total    = subtotal + fees
     const booking  = qs.get('bid') ?? Math.random().toString(36).substring(2,8).toUpperCase()
     const ticketNo = Math.floor(100000 + Math.random()*900000).toString()
   
     /* DL as JSON (placeholder) */
     const download=()=>{
       const data={movie:movie?.title,seats:seatsId,holder,total}
       const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'})
       const url=URL.createObjectURL(blob);const a=document.createElement('a')
       a.href=url;a.download=`ticket-${movie?.title}.json`;a.click();URL.revokeObjectURL(url)
     }
   
     /* —————————————  UI  ————————————— */
     return(
       <div >
         <Link href="/" className="absolute left-4 top-4 p-2 rounded-full hover:bg-white/20 text-white"><Home/></Link>
   
         {/* ticket */}
         <div className={`
           relative w-[330px] sm:w-[380px] bg-white dark:bg-zinc-800 rounded-[32px] text-zinc-900 dark:text-white
           shadow-2xl overflow-hidden
           before:absolute before:-left-6 before:top-1/2 before:-translate-y-1/2 before:w-12 before:h-12 before:rounded-full before:bg-slate-100 dark:before:bg-zinc-900
           after:absolute after:-right-6 after:top-1/2 after:-translate-y-1/2 after:w-12 after:h-12 after:rounded-full after:bg-slate-100 dark:after:bg-zinc-900
         `}>
           {/* banner */}
           {movie && (
             <div className="relative h-44">
               <Image src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} fill alt={movie.title} className="object-cover"/>
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent"/>
               <h2 className="absolute bottom-3 left-4 text-white text-xl font-bold">{movie.title}</h2>
             </div>
           )}
   
           {/* details section 1 */}
           <div className="px-6 pt-5 pb-2 text-xs grid grid-cols-2 gap-y-3">
             <Meta label="Ticket #" value={ticketNo}/>
             <Meta label="Booking ID" value={booking}/>
             <Meta label="Holder" value={holder||'—'}/>
             <Meta label="Version" value={version}/>
           </div>
   
           {/* details section 2 */}
           <div className="px-6 py-4 grid grid-cols-2 gap-y-3 text-sm">
             <Meta label="Location" value={qs.get('cinema')??'—'}/>
             <Meta label="Hall"     value={hall}/>
             <Meta label="Date"     value={showDate}/>
             <Meta label="Time"     value={showTime}/>
             <Meta label="Seats"    value={seatText}/>
           </div>
   
           {/* prices */}
           <div className="px-6 pb-4 space-y-1 text-sm">
             <Row label="Subtotal" value={`${subtotal} DH`}/>
             <Row label="Fees"     value={`${fees} DH`} dim/>
             <Row label="Total"    value={`${total} DH`} bold/>
           </div>
   
           {/* separator dashed */}
           <div className="border-t border-dashed border-zinc-300 dark:border-zinc-500"/>
   
           {/* barcode */}
           <div className="h-24 bg-white dark:bg-zinc-800 flex items-center justify-center">
             <div className="h-20 w-[90%] bg-[repeating-linear-gradient(to_right,transparent_0_2px,black_2px_9px)] dark:bg-[repeating-linear-gradient(to_right,transparent_0_2px,white_2px_9px)]"/>
           </div>
         </div>
   
         <Button onClick={download} className="mt-8 flex items-center gap-2">
           <Download className="h-4 w-4"/> Télécharger
         </Button>
       </div>
     )
   }
   
   /* ----- helpers UI ----- */
   function Meta({label,value}:{label:string;value:string|undefined}){
     return(
       <div>
         <p className="uppercase tracking-wide text-[10px] text-zinc-500 dark:text-zinc-400">{label}</p>
         <p className="font-medium leading-snug">{value||'—'}</p>
       </div>
     )
   }
   function Row({label,value,bold,dim}:{label:string;value:string;bold?:boolean;dim?:boolean}){
     return(
       <div className="flex justify-between">
         <span className={` ${dim?'text-zinc-500 dark:text-zinc-400':''}`}>{label}</span>
         <span className={`${bold?'font-bold text-indigo-600 dark:text-indigo-400':''}`}>{value}</span>
       </div>
     )
   }
   