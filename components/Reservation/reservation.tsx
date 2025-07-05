/* app/reservation/page.tsx
   ─────────────────────────────────────────────────────────────── */
   'use client'

   import { useSearchParams, useRouter } from 'next/navigation'
   import { useEffect, useMemo, useState } from 'react'
   import Image from 'next/image'
   import Link from 'next/link'
   
   import {
     Dialog, DialogContent, DialogDescription,
     DialogHeader, DialogTitle,
   } from '@/components/ui/dialog'
   import { Button } from '@/components/ui/button'
   import { Badge } from '@/components/ui/badge'
   import { 
     X,
     MapPin, 
     Calendar, 
     Clock, 
     Users, 
     Star,
     ArrowLeft,
     CreditCard,
     Ticket,
     Eye,
     Volume2,
     Zap,
     Shield
   } from 'lucide-react'
   
   /* ───────────────────────── constants ──────────────────────────── */
   const TMDB = 'https://api.themoviedb.org/3'
   const KEY = '8099992c2241e752e151a9908acef357'
   
   /* Enhanced auditorium contour with VIP section */
   const MASK = [
     '0011111111111000',   // row A
     '0011111111111000',   // row B
     '0011111111111000',   // row C
     '0001111111110000',   // row D
     '0001111111110000',   // row E
     '0000111111100000',   // row F (VIP)
     '0000111111100000'    // row G (VIP)
   ]
   
   const VIP_ROWS = ['F', 'G'] // VIP rows
   const PREMIUM_ROWS = ['D', 'E'] // Premium rows
   
   type Seat = {
     id: string      // "E7"
     row: string      // "E"
     col: number      // column index (0-based)
     colDisplay: number      // human number printed inside seat
     taken: boolean
     type: 'standard' | 'premium' | 'vip'
     price: number
   }
   
   /* buildSeats() — turns MASK → array of seat objects */
   function buildSeats(): Seat[] {
     const out: Seat[] = []
     MASK.forEach((maskRow, rIdx) => {
       const letter = String.fromCharCode(65 + rIdx)   // A, B, C…
       let seatNum = 1
       maskRow.split('').forEach((bit, cIdx) => {
         if (bit === '1') {
           const seatType = VIP_ROWS.includes(letter) ? 'vip' : 
                           PREMIUM_ROWS.includes(letter) ? 'premium' : 'standard'
           const price = seatType === 'vip' ? 120 : seatType === 'premium' ? 75 : 50
           
           out.push({
             id: `${letter}${seatNum}`,
             row: letter,
             col: cIdx,
             colDisplay: seatNum,
             taken: Math.random() < 0.18,
             type: seatType,
             price: price
           })
           seatNum++
         }
       })
     })
     return out
   }
   
   /* Enhanced screen path for curved cinema screen */
   const SCREEN_PATH = 'M0 0 Q340 50 680 0'
   
   /* ───────────────────────────────── page component ─────────────── */
   export default function Reservation() {
     /* ─ query params & router ─ */
     const qs = useSearchParams()
     const router = useRouter()
   
     const movieId = qs.get('movieId') ?? '385687'
     const when = qs.get('time') ?? '13:00 VF'
     const cinema = qs.get('cinema') ?? 'Pathé Californie'
   
     /* ─ movie meta fetch ─ */
     type Movie = {
       backdrop_path?: string;
       title?: string;
       vote_average?: number;
       // Add other properties you use from the movie object if needed
     };
     const [movie, setMovie] = useState<Movie | null>(null)
     const [loading, setLoading] = useState(true)
     
     useEffect(() => {
       fetch(`${TMDB}/movie/${movieId}?api_key=${KEY}&language=fr-FR`)
         .then(r => r.json())
         .then(setMovie)
         .finally(() => setLoading(false))
     }, [movieId])
   
     /* ─ seat data & selection ─ */
     const [seats] = useState<Seat[]>(buildSeats)
     const [chosen, setChosen] = useState<Set<string>>(new Set())
     const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)
   
     const toggle = (id: string, taken: boolean) => {
       if (taken) return
       setChosen(p => {
         const n = new Set(p)
         if (n.has(id)) {
           n.delete(id)
         } else {
           n.add(id)
         }
         return n
       })
     }
   
     /* group seats by row for rendering */
     const rowsGrouped = useMemo(() => {
       const map: Record<string, Seat[]> = {}
       seats.forEach(seat => (map[seat.row] ??= []).push(seat))
       return map
     }, [seats])
   
     const freeCount = seats.filter(s => !s.taken && !chosen.has(s.id)).length
     const totalPrice = seats
       .filter(s => chosen.has(s.id))
       .reduce((sum, seat) => sum + seat.price, 0)
   
     /* ─ confirmation dialog ─ */
     const [open, setOpen] = useState(false)
     const confirm = () => {
       setOpen(false)
       router.push(
         `/confirmation?movie=${movieId}&time=${when}&seats=${Array.from(chosen).join(',')}`
       )
     }
   
     /* ─────────────────────────── JSX ────────────────────────────── */
     return (
       <div className='flex'>
   
         {/* ░░ Enhanced Left Sidebar ░░ */}
         <aside className="w-full max-w-[380px] bg-black/60 backdrop-blur-xl border-r border-white/10">
           {/* Movie Header */}
           <div className="relative h-80 overflow-hidden">
             {loading ? (
               <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-800 to-gray-700" />
             ) : (
               movie?.backdrop_path && (
                 <>
                   <Image
                     src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                     alt={movie.title ?? 'Affiche du film'}
                     fill priority
                     className="object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                 </>
               )
             )}
   
             <div className="absolute inset-0 flex flex-col justify-between p-6">
               <Link 
                 href="/" 
                 className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 
                            flex items-center justify-center transition-all duration-300 hover:scale-110
                            border border-white/20"
               >
                 <ArrowLeft className="h-5 w-5" />
               </Link>
   
               <div className="space-y-3">
                 <div className="flex items-center gap-2">
                   <Badge className="bg-red-500/80 hover:bg-red-500">
                     En cours
                   </Badge>
                   {movie?.vote_average && (
                     <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                       <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                       <span className="text-xs font-medium">{(movie.vote_average / 2).toFixed(1)}</span>
                     </div>
                   )}
                 </div>
                 
                 <h2 className="text-2xl font-bold drop-shadow-lg line-clamp-2">
                   {movie?.title || 'Chargement...'}
                 </h2>
                 
                 <div className="flex items-center gap-2 text-white/80">
                   <MapPin className="h-4 w-4" />
                   <p className="text-sm drop-shadow">{cinema}</p>
                 </div>
   
                 <Button size="sm" variant="outline" asChild
                         className="bg-white/10 border-white/25 hover:bg-white/20 backdrop-blur-sm rounded-full">
                   <Link href="/films">
                     <Ticket className="h-4 w-4 mr-2" />
                     Changer de film
                   </Link>
                 </Button>
               </div>
             </div>
           </div>
   
           {/* Enhanced Info Section */}
           <div className="p-6 space-y-6">
             <EnhancedInfo 
               icon={<MapPin className="h-5 w-5 text-blue-400" />}
               label="Cinéma" 
               value={cinema}
               subtitle="Salle 7 - Audio Dolby Atmos"
             />
             <EnhancedInfo 
               icon={<Calendar className="h-5 w-5 text-green-400" />}
               label="Date" 
               value="mardi 24 juin 2025"
               subtitle="Séance de soirée"
             />
             <EnhancedInfo 
               icon={<Clock className="h-5 w-5 text-orange-400" />}
               label="Séance" 
               value={when}
               subtitle="Durée: 2h 28min"
             />
             
             {/* Selection Summary */}
             {chosen.size > 0 && (
               <div className="mt-8 p-4 bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-2xl border border-red-500/20">
                 <div className="flex items-center gap-2 mb-3">
                   <Users className="h-5 w-5 text-red-400" />
                   <span className="font-semibold">Vos places sélectionnées</span>
                 </div>
                 <div className="flex flex-wrap gap-2 mb-3">
                   {Array.from(chosen).map(id => {
                     const seat = seats.find(s => s.id === id)
                     return (
                       <Badge key={id} variant="outline" className="border-red-400/50 bg-red-500/20">
                         {`${id[0]}${id.slice(1)}`}
                         {seat && (
                           <span className="ml-1 text-xs">({seat.price}DH)</span>
                         )}
                       </Badge>
                     )
                   })}
                 </div>
                 <div className="text-lg font-bold text-red-400">
                   Total: {totalPrice} DH
                 </div>
               </div>
             )}
           </div>
         </aside>
   
         {/* ░░ Enhanced Main Content ░░ */}
         <main className="flex-1 bg-gradient-to-b from-[#0F0F0F] to-[#1a1a1a]">
           <section className="mx-auto max-w-[1000px] p-6 md:p-12">
             {/* Enhanced Header */}
             <div className="text-center mb-12">
               <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                 Sélectionnez vos places
               </h1>
               <div className="flex items-center justify-center gap-6 text-white/70">
                 <div className="flex items-center gap-2">
                   <Users className="h-5 w-5" />
                   <span>{freeCount} places libres</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Eye className="h-5 w-5" />
                   <span>Vue optimale</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Volume2 className="h-5 w-5" />
                   <span>Son Dolby Atmos</span>
                 </div>
               </div>
             </div>
   
             {/* Pricing Legend */}
             <div className="flex justify-center mb-8">
               <div className="flex flex-wrap gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                 <PricingLegend type="standard" price={50} />
                 <PricingLegend type="premium" price={75} />
                 <PricingLegend type="vip" price={120} />
               </div>
             </div>
   
             {/* Enhanced Seat Grid */}
             <div className="flex justify-center mb-8">
               <div className="inline-block rounded-3xl bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] p-8 shadow-2xl border border-white/10">
                 
                 {/* Row Labels Header */}
                 <div className="text-center mb-6">
                   <h3 className="text-lg font-semibold text-white/80 mb-2">Plan de la salle</h3>
                   <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                     <span>← Entrée</span>
                     <span>Écran →</span>
                   </div>
                 </div>
   
                 {/* Seat Rows */}
                 <div className="space-y-3">
                   {Object.entries(rowsGrouped).map(([row, rowSeats]) => {
                     const isVip = VIP_ROWS.includes(row)
                     const isPremium = PREMIUM_ROWS.includes(row)
                     
                     return (
                       <div key={row} className="flex items-center justify-center gap-3">
                         {/* Left row label */}
                         <div className="w-8 flex items-center justify-center">
                           <span className={`text-sm font-bold ${
                             isVip ? 'text-purple-400' : isPremium ? 'text-blue-400' : 'text-gray-400'
                           }`}>
                             {row}
                           </span>
                         </div>
   
                         {/* Seats */}
                         <div className="flex gap-1">
                           {rowSeats.map(seat => {
                             const isSelected = chosen.has(seat.id)
                             const isHovered = hoveredSeat === seat.id
                             const state: 'free' | 'selected' | 'taken' | 'hovered' =
                               seat.taken ? 'taken' : 
                               isSelected ? 'selected' : 
                               isHovered ? 'hovered' : 'free'
   
                             const seatStyles = {
                               standard: {
                                 free: 'bg-gray-300 hover:bg-gray-100 text-gray-800',
                                 selected: 'bg-red-500 text-white shadow-lg shadow-red-500/30',
                                 taken: 'bg-gray-600 text-gray-400 cursor-not-allowed',
                                 hovered: 'bg-gray-100 text-gray-800 scale-110'
                               },
                               premium: {
                                 free: 'bg-blue-300 hover:bg-blue-200 text-blue-900',
                                 selected: 'bg-red-500 text-white shadow-lg shadow-red-500/30',
                                 taken: 'bg-gray-600 text-gray-400 cursor-not-allowed',
                                 hovered: 'bg-blue-200 text-blue-900 scale-110'
                               },
                               vip: {
                                 free: 'bg-gradient-to-b from-purple-400 to-purple-500 hover:from-purple-300 hover:to-purple-400 text-white',
                                 selected: 'bg-red-500 text-white shadow-lg shadow-red-500/30',
                                 taken: 'bg-gray-600 text-gray-400 cursor-not-allowed',
                                 hovered: 'bg-gradient-to-b from-purple-300 to-purple-400 text-white scale-110'
                               }
                             }
   
                             return (
                               <button
                                 key={seat.id}
                                 onClick={() => toggle(seat.id, seat.taken)}
                                 onMouseEnter={() => setHoveredSeat(seat.id)}
                                 onMouseLeave={() => setHoveredSeat(null)}
                                 disabled={seat.taken}
                                 title={`${seat.row}${seat.colDisplay} • ${seat.type.toUpperCase()} • ${seat.price}DH • ${
                                   state === 'taken'
                                     ? 'Occupée'
                                     : state === 'selected'
                                       ? 'Sélectionnée'
                                       : 'Libre'
                                 }`}
                                 className={`relative h-8 w-8 rounded-lg text-xs font-bold transition-all duration-200
                                            ${seatStyles[seat.type][state]}
                                            ${seat.type === 'vip' ? 'border-2 border-purple-600' : ''}
                                            ${seat.type === 'premium' ? 'border border-blue-400' : ''}
                                            ${isSelected ? 'ring-2 ring-red-400 ring-offset-1 ring-offset-black' : ''}
                                            hover:z-10`}
                               >
                                 {seat.colDisplay}
                                 {seat.type === 'vip' && !seat.taken && !isSelected && (
                                   <Zap className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400" />
                                 )}
                                 {seat.type === 'premium' && !seat.taken && !isSelected && (
                                   <Shield className="absolute -top-1 -right-1 h-3 w-3 text-blue-400" />
                                 )}
                               </button>
                             )
                           })}
                         </div>
   
                         {/* Right row label */}
                         <div className="w-8 flex items-center justify-center">
                           <span className={`text-sm font-bold ${
                             isVip ? 'text-purple-400' : isPremium ? 'text-blue-400' : 'text-gray-400'
                           }`}>
                             {row}
                           </span>
                         </div>
                       </div>
                     )
                   })}
                 </div>
   
                 {/* Enhanced Screen */}
                 <div className="mt-12 text-center">
                   <svg viewBox="0 0 680 60" className="h-12 w-full max-w-md mx-auto">
                     <defs>
                       <linearGradient id="screenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                         <stop offset="0%" stopColor="#E50914" stopOpacity="0.8" />
                         <stop offset="50%" stopColor="#FF6B6B" stopOpacity="1" />
                         <stop offset="100%" stopColor="#E50914" stopOpacity="0.8" />
                       </linearGradient>
                     </defs>
                     <path d={SCREEN_PATH} fill="none" stroke="url(#screenGradient)" strokeWidth="6" />
                     <text x="50%" y="50" textAnchor="middle"
                           className="fill-white text-sm font-bold">ÉCRAN IMAX</text>
                   </svg>
                   <p className="text-xs text-white/60 mt-2">Meilleure vue depuis les rangées D-E</p>
                 </div>
               </div>
             </div>
   
             {/* Enhanced Legend */}
             <div className="flex flex-wrap justify-center gap-6 text-sm mb-8">
               <SeatLegend color="bg-red-500" label="Mes places" />
               <SeatLegend color="bg-gray-300" label="Standard (50 DH)" />
               <SeatLegend color="bg-blue-300" label="Premium (75 DH)" />
               <SeatLegend color="bg-gradient-to-r from-purple-400 to-purple-500" label="VIP (120 DH)" />
               <SeatLegend color="bg-gray-600" label="Occupées" />
             </div>
   
             {/* Enhanced CTA */}
             <div className="text-center">
               <Button 
                 className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                            rounded-full px-12 py-6 text-lg font-bold transition-all duration-300 
                            hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 disabled:opacity-50 
                            disabled:cursor-not-allowed disabled:hover:scale-100"
                 disabled={!chosen.size} 
                 onClick={() => setOpen(true)}
               >
                 <CreditCard className="h-6 w-6 mr-3" />
                 Confirmer la réservation ({chosen.size} {chosen.size === 1 ? 'place' : 'places'})
                 {totalPrice > 0 && (
                   <span className="ml-3 bg-white/20 px-3 py-1 rounded-full">
                     {totalPrice} DH
                   </span>
                 )}
               </Button>
               
               {chosen.size === 0 && (
                 <p className="text-white/60 text-sm mt-3">
                   Sélectionnez au moins une place pour continuer
                 </p>
               )}
             </div>
           </section>
         </main>
   
         {/* Enhanced Confirmation Dialog */}
         <Dialog open={open} onOpenChange={setOpen}>
           <DialogContent className="max-w-md rounded-3xl bg-black/90 backdrop-blur-xl border border-white/20 text-white">
             <DialogHeader className="text-center">
               <DialogTitle className="text-2xl font-bold mb-2">Confirmation de réservation</DialogTitle>
               <DialogDescription className="text-white/70">
                 Vous allez réserver <span className="font-bold text-red-400">{chosen.size} place(s)</span> pour{' '}
                 <span className="font-bold text-white">{movie?.title}</span>
               </DialogDescription>
             </DialogHeader>
   
             <div className="my-6 space-y-4">
               {/* Selected seats */}
               <div className="bg-white/5 rounded-2xl p-4">
                 <h4 className="font-semibold mb-3 flex items-center gap-2">
                   <Ticket className="h-4 w-4" />
                   Places sélectionnées
                 </h4>
                 <div className="flex flex-wrap gap-2">
                   {Array.from(chosen).map(id => {
                     const seat = seats.find(s => s.id === id)
                     return (
                       <span key={id} className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1 text-sm">
                         <span className="font-mono">{`${id[0]}${id.slice(1)}`}</span>
                         {seat && (
                           <span className="text-white/70">({seat.price}DH)</span>
                         )}
                         <X size={14} className="cursor-pointer hover:text-red-400 transition-colors" 
                            onClick={() => toggle(id, false)} />
                       </span>
                     )
                   })}
                 </div>
               </div>
   
               {/* Price breakdown */}
               <div className="bg-white/5 rounded-2xl p-4">
                 <h4 className="font-semibold mb-3 flex items-center gap-2">
                   <CreditCard className="h-4 w-4" />
                   Récapitulatif
                 </h4>
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span>Sous-total ({chosen.size} places)</span>
                     <span>{totalPrice} DH</span>
                   </div>
                   <div className="flex justify-between text-white/70">
                     <span>Frais de service</span>
                     <span>5 DH</span>
                   </div>
                   <div className="border-t border-white/20 pt-2 flex justify-between font-bold text-lg">
                     <span>Total</span>
                     <span className="text-red-400">{totalPrice + 5} DH</span>
                   </div>
                 </div>
               </div>
             </div>
   
             <div className="flex gap-3">
               <Button variant="outline" onClick={() => setOpen(false)} 
                       className="flex-1 border-white/30 bg-white/5 hover:bg-white/15 rounded-2xl">
                 Modifier
               </Button>
               <Button onClick={confirm} 
                       className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 
                                  hover:from-emerald-600 hover:to-emerald-700 rounded-2xl">
                 <CreditCard className="h-4 w-4 mr-2" />
                 Payer {totalPrice + 5} DH
               </Button>
             </div>
           </DialogContent>
         </Dialog>
       </div>
     )
   }
   
   /* ──────────────────────── Enhanced Components ───────────────────────── */
   function EnhancedInfo({ icon, label, value, subtitle }: { 
     icon: React.ReactNode; 
     label: string; 
     value: string;
     subtitle?: string;
   }) {
     return (
       <div className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
         <div className="flex items-start gap-3">
           <div className="mt-1">{icon}</div>
           <div className="flex-1">
             <p className="text-xs uppercase text-white/60 font-medium">{label}</p>
             <p className="mt-1 font-semibold">{value}</p>
             {subtitle && <p className="text-xs text-white/50 mt-1">{subtitle}</p>}
           </div>
         </div>
       </div>
     )
   }
   
   function PricingLegend({ type, price }: { type: 'standard' | 'premium' | 'vip'; price: number }) {
     const config = {
       standard: { bg: 'bg-gray-300', label: 'Standard', icon: null },
       premium: { bg: 'bg-blue-300', label: 'Premium', icon: <Shield className="h-3 w-3" /> },
       vip: { bg: 'bg-gradient-to-r from-purple-400 to-purple-500', label: 'VIP', icon: <Zap className="h-3 w-3" /> }
     }
   
     return (
       <div className="flex items-center gap-2 text-sm">
         <div className={`h-6 w-6 rounded ${config[type].bg} flex items-center justify-center`}>
           {config[type].icon}
         </div>
         <span>{config[type].label}</span>
         <span className="font-bold text-green-400">{price} DH</span>
       </div>
     )
   }
   
   function SeatLegend({ color, label }: { color: string; label: string }) {
     return (
       <span className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-full">
         <span className={`inline-block h-4 w-4 rounded ${color}`} />
         <span className="text-sm">{label}</span>
       </span>
     )
   }