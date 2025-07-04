/* app/ticket/page.tsx
   ─────────────────────────────────────────────────────────────── */
   'use client'

   import { useSearchParams } from 'next/navigation'
   import { useEffect, useState } from 'react'
   import Image from 'next/image'
   import Link from 'next/link'
   import QRCode from 'react-qr-code'
   import { Download, Home, MapPin, Calendar, Clock, User, Ticket } from 'lucide-react'
   import { Button } from '@/components/ui/button'
   
   /* ---------- Constantes locales ---------- */
   const TMDB = 'https://api.themoviedb.org/3'
   const KEY  = '8099992c2241e752e151a9908acef357'
   
   /* plan de la salle pour retrouver prix / type */
   const MASK = [
     '0011111111111000','0011111111111000','0011111111111000',
     '0001111111110000','0001111111110000','0000111111100000','0000111111100000'
   ]
   const VIP=['F','G'], PREMIUM=['D','E']
   type Seat = { id:string; row:string; price:number; type:'vip'|'premium'|'standard' }
   
   const seatLookup:Record<string,Seat> = (() => {
     const out:Record<string,Seat> = {}
     MASK.forEach((row,r) => {
       const L = String.fromCharCode(65 + r)
       let n   = 1
       row.split('').forEach(bit => {
         if (bit === '1') {
           const type  = VIP.includes(L) ? 'vip' : PREMIUM.includes(L) ? 'premium' : 'standard'
           const price = type === 'vip' ? 120 : type === 'premium' ? 75 : 50
           out[`${L}${n}`] = { id:`${L}${n}`, row:L, price, type }
           n++
         }
       })
     })
     return out
   })()
   
   /* ---------- Composant page ---------- */
   export default function TicketPage () {
     const qs = useSearchParams()
   
     /* Récupération des query params */
     const movieId  = qs.get('movie')       ?? ''
     const time     = qs.get('time')        ?? ''
     const cinema   = qs.get('cinema')      ?? '—'
     const seatIds  = (qs.get('seats')      ?? '').split(',').filter(Boolean)
     const seatObjs = seatIds.map(id => seatLookup[id]).filter(Boolean)
     const seatText = seatObjs.map(s => s.id).join(', ')
     const first    = qs.get('firstName')   ?? ''
     const last     = qs.get('lastName')    ?? ''
     const email    = qs.get('email')       ?? ''
     const phone    = qs.get('phone')       ?? ''
     const holder   = `${first} ${last}`.trim()
     const booking  = qs.get('bid') ?? Math.random().toString(36).substring(2,8).toUpperCase()
   
     /* Prix */
     const subtotalCalculated = seatObjs.reduce((s,st)=>s+st.price,0)
     const fees   = 5
     const total  = Number(qs.get('total')) || subtotalCalculated + fees
   
     /* Fetch film */
     const [movie,setMovie] = useState<any|null>(null)
     useEffect(()=>{
       if (!movieId) return
       fetch(`${TMDB}/movie/${movieId}?api_key=${KEY}&language=fr-FR`)
         .then(r=>r.json()).then(setMovie)
     },[movieId])
   
     /* QR payload */
     const qrPayload = JSON.stringify({
       booking, movieId, seatIds, holder, total
     })
   
     /* Download JSON */
     const [downloading,setDl] = useState(false)
     const download = async () => {
       setDl(true)
       await new Promise(r=>setTimeout(r,1200))          // petite anim/attente
       const blob = new Blob([qrPayload],{type:'application/json'})
       const url  = URL.createObjectURL(blob)
       const a    = document.createElement('a')
       a.href = url
       a.download = `ticket-${movieId}.json`
       a.click()
       URL.revokeObjectURL(url)
       setDl(false)
     }
   
     /* ---------------- UI ---------------- */
     return (
       <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900/80 to-black text-white flex flex-col items-center py-10 px-4">
         {/* Header simple */}
         <header className="flex items-center gap-2 mb-8">
           <Link href="/" className="p-2 rounded-full hover:bg-white/20"><Home className="h-5 w-5"/></Link>
           <Ticket className="h-5 w-5 text-red-500"/>
           <span className="font-semibold">Billet</span>
         </header>
   
         {/* Ticket container */}
         <div
           className={`
             w-[330px] sm:w-[380px] bg-white text-black rounded-[32px] shadow-2xl overflow-hidden
             before:absolute before:-left-6 before:top-1/2 before:-translate-y-1/2 before:w-12 before:h-12 before:rounded-full before:bg-[#0B0B0B]
             after:absolute after:-right-6 after:top-1/2 after:-translate-y-1/2 after:w-12 after:h-12 after:rounded-full after:bg-[#0B0B0B]
             relative
           `}
         >
           {/* Bandeau film */}
           {movie && (
             <div className="relative h-44">
               <Image
                 src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                 fill
                 alt={movie.title}
                 className="object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent"/>
               <h2 className="absolute bottom-3 left-4 text-white text-xl font-bold">{movie.title}</h2>
             </div>
           )}
   
           {/* Infos */}
           <div className="px-6 py-6 space-y-6 text-sm">
             {/* grid infos */}
             <div className="grid grid-cols-2 gap-4">
               <Info icon={<MapPin className="h-4 w-4 text-red-500"/>} label="Cinéma" value={cinema}/>
               <Info icon={<Calendar className="h-4 w-4 text-red-500"/>} label="Date" value={qs.get('date') ?? '—'}/>
               <Info icon={<Clock className="h-4 w-4 text-red-500"/>} label="Séance" value={time}/>
               <Info icon={<User className="h-4 w-4 text-red-500"/>} label="Sièges" value={seatText}/>
             </div>
   
             {/* Titulaire */}
             {holder && (
               <div>
                 <p className="text-xs text-gray-500 uppercase mb-1">Titulaire</p>
                 <p className="font-semibold">{holder}</p>
               </div>
             )}
   
             {/* Booking ID */}
             <div>
               <p className="text-xs text-gray-500 uppercase mb-1">Réservation</p>
               <p className="font-mono text-red-600 tracking-wider">{booking}</p>
             </div>
   
             {/* Prix */}
             <div className="space-y-1">
               <PriceRow label="Sous-total" value={total - fees}/>
               <PriceRow label="Frais" value={fees} dim/>
               <PriceRow label="Total" value={total} bold/>
             </div>
   
             {/* QR code */}
             <div className="flex justify-center pt-4">
               <QRCode value={qrPayload} size={128} title={''} />
             </div>
           </div>
         </div>
   
         {/* Bouton DL */}
         <Button onClick={download} disabled={downloading} className="mt-8">
           {downloading ? 'Téléchargement…' : <><Download className="h-4 w-4 mr-2"/>Télécharger</>}
         </Button>
       </div>
     )
   }
   
   /* -------- petits composants -------- */
   function Info({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){
     return(
       <div className="flex items-start gap-2">
         {icon}
         <div>
           <p className="text-xs text-gray-500 uppercase">{label}</p>
           <p className="font-medium break-words">{value}</p>
         </div>
       </div>
     )
   }
   function PriceRow({label,value,bold,dim}:{label:string;value:number;bold?:boolean;dim?:boolean}){
     return(
       <div className="flex justify-between">
         <span className={`${dim?'text-gray-500':''}`}>{label}</span>
         <span className={`${bold?'font-bold text-red-600':''}`}>{value} DH</span>
       </div>
     )
   }
   