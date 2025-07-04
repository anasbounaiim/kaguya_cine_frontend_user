/* app/confirmation/page.tsx
   ─────────────────────────────────────────────────────────────── */
   'use client'

   import { useSearchParams, useRouter } from 'next/navigation'
   import { useEffect, useMemo, useState } from 'react'
   import Image from 'next/image'
   import Link from 'next/link'
   
   import {
     Dialog, DialogContent, DialogHeader, DialogTitle,
     DialogDescription
   } from '@/components/ui/dialog'
   import { Button } from '@/components/ui/button'
   import { Badge } from '@/components/ui/badge'
   import {
     Home, MapPin, Calendar, Clock, Star, Ticket, Download,
     ArrowLeft, QrCode, Users
   } from 'lucide-react'
   
   /* ───────────────────────── constants ──────────────────────────── */
   const TMDB  = 'https://api.themoviedb.org/3'
   const KEY   = '8099992c2241e752e151a9908acef357'
   
   const MASK = [
     '0011111111111000',
     '0011111111111000',
     '0011111111111000',
     '0001111111110000',
     '0001111111110000',
     '0000111111100000',
     '0000111111100000'
   ]
   const VIP_ROWS      = ['F', 'G']
   const PREMIUM_ROWS  = ['D', 'E']
   
   type Seat = {
     id: string
     row: string
     price: number
     type: 'standard' | 'premium' | 'vip'
   }
   
   /* Reconstruit la grille pour retrouver prix & type d’après l’ID */
   function buildSeatLookup (): Record<string, Seat> {
     const lookup: Record<string, Seat> = {}
     MASK.forEach((maskRow, rIdx) => {
       const letter  = String.fromCharCode(65 + rIdx)      // A, B…
       let seatNum   = 1
       maskRow.split('').forEach(bit => {
         if (bit === '1') {
           const type = VIP_ROWS.includes(letter)
             ? 'vip'
             : PREMIUM_ROWS.includes(letter)
               ? 'premium'
               : 'standard'
           const price = type === 'vip' ? 120 : type === 'premium' ? 75 : 50
           const id = `${letter}${seatNum}`
           lookup[id] = { id, row: letter, price, type }
           seatNum++
         }
       })
     })
     return lookup
   }
   
   const SEAT_LOOKUP = buildSeatLookup()
   
   /* ───────────────────────────── page ───────────────────────────── */
   export default function ConfirmationPage () {
     const qs      = useSearchParams()
     const router  = useRouter()
   
     /* Params */
     const movieId = qs.get('movie')   ?? '385687'
     const when    = qs.get('time')    ?? '13:00 VF'
     const cinema  = qs.get('cinema')  ?? 'Pathé Californie'
     const seatIds = qs.get('seats')   ?.split(',').filter(Boolean) ?? []
   
     /* Fetch film */
     const [movie, setMovie]   = useState<any | null>(null)
     const [loading, setLoad]  = useState(true)
   
     useEffect(() => {
       fetch(`${TMDB}/movie/${movieId}?api_key=${KEY}&language=fr-FR`)
         .then(r => r.json())
         .then(setMovie)
         .finally(() => setLoad(false))
     }, [movieId])
   
     /* Infos places */
     const seats: Seat[] = useMemo(
       () => seatIds.map(id => SEAT_LOOKUP[id]).filter(Boolean),
       [seatIds]
     )
     const total = seats.reduce((s, seat) => s + seat.price, 0)
     const fees  = 5
     const grand = total + fees
   
     /* ─────────────── JSX ─────────────── */
     return (
       <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#1a1a1a] text-white">
   
         {/* Barre supérieure */}
         <header className="flex items-center gap-4 p-4 border-b border-white/10">
           <Link href="/" className="p-2 hover:bg-white/10 rounded-full">
             <ArrowLeft className="h-5 w-5" />
           </Link>
           <h1 className="text-xl font-bold tracking-wide">Confirmation de réservation</h1>
         </header>
   
         {/* Contenu */}
         <main className="flex-1 flex flex-col items-center p-6">
           <div className="w-full max-w-3xl bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
   
             {/* Bandeau film */}
             <div className="relative h-56">
               {loading ? (
                 <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-800 to-gray-700" />
               ) : (
                 movie?.backdrop_path && (
                   <>
                     <Image
                       src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                       alt={movie.title}
                       fill
                       priority
                       className="object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                   </>
                 )
               )}
               <div className="absolute bottom-4 left-4 flex items-center gap-3">
                 <Badge className="bg-green-600/80">Confirmé</Badge>
                 {movie?.vote_average && (
                   <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                     <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                     <span className="text-xs font-medium">{(movie.vote_average / 2).toFixed(1)}</span>
                   </div>
                 )}
               </div>
               <h2 className="absolute bottom-4 right-6 text-2xl md:text-3xl font-extrabold text-right">
                 {movie?.title}
               </h2>
             </div>
   
             {/* Informations */}
             <section className="grid md:grid-cols-2 gap-6 p-8">
               {/* Billet visuel */}
               <div className="bg-white/5 rounded-2xl p-6 flex flex-col justify-between">
                 <div>
                   <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                     <Ticket className="h-5 w-5" />
                     Vos billets
                   </h3>
                   <div className="flex flex-wrap gap-2">
                     {seats.map(seat => (
                       <Badge
                         key={seat.id}
                         className="border-red-400/30 bg-red-500/20"
                       >
                         {seat.id} · {seat.price} DH
                       </Badge>
                     ))}
                   </div>
                 </div>
   
                 {/* QR Code factice */}
                 <div className="mt-8 flex flex-col items-center gap-3">
                   <div className="h-28 w-28 bg-white rounded relative">
                     <QrCode className="absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] text-black" />
                   </div>
                   <span className="text-xs text-white/60">Présentez ce QR Code en salle</span>
                 </div>
               </div>
   
               {/* Détails séance & paiement */}
               <div className="space-y-6">
                 <InfoRow icon={<MapPin className="h-5 w-5 text-blue-400" />} label="Cinéma" value={cinema} />
                 <InfoRow icon={<Calendar className="h-5 w-5 text-green-400" />} label="Date"  value="mardi 24 juin 2025" />
                 <InfoRow icon={<Clock className="h-5 w-5 text-orange-400" />} label="Séance" value={when} />
                 <InfoRow icon={<Users className="h-5 w-5 text-red-400" />} label="Places" value={`${seats.length} place(s)`} />
   
                 {/* Paiement */}
                 <div className="bg-white/5 rounded-2xl p-4">
                   <h4 className="font-semibold mb-3">Récapitulatif</h4>
                   <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                       <span>Sous-total</span><span>{total} DH</span>
                     </div>
                     <div className="flex justify-between text-white/70">
                       <span>Frais de service</span><span>{fees} DH</span>
                     </div>
                     <div className="border-t border-white/20 pt-2 flex justify-between font-bold text-lg">
                       <span>Total payé</span><span className="text-red-400">{grand} DH</span>
                     </div>
                   </div>
                 </div>
               </div>
             </section>
   
             {/* CTA */}
             <div className="flex flex-col md:flex-row gap-4 p-8 border-t border-white/10">
               <Button asChild className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:to-red-700 rounded-full">
                 <Link href="/">
                   <Home className="h-4 w-4 mr-2" />
                   Retour à l’accueil
                 </Link>
               </Button>
               <Button variant="outline" className="flex-1 rounded-full border-white/30">
                 <Download className="h-4 w-4 mr-2" />
                 Télécharger le ticket
               </Button>
             </div>
           </div>
         </main>
       </div>
     )
   }
   
   /* ──────────────────── sous-composant ─────────────────── */
   function InfoRow ({
     icon, label, value
   }: { icon: React.ReactNode; label: string; value: string }) {
     return (
       <div className="flex items-start gap-3">
         {icon}
         <div>
           <p className="text-xs uppercase text-white/60">{label}</p>
           <p className="font-medium">{value}</p>
         </div>
       </div>
     )
   }
   