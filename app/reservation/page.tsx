/* app/reservation/page.tsx
   ─────────────────────────────────────────────────────────────── */
   'use client'

   import { useSearchParams, useRouter } from 'next/navigation'
   import { useEffect, useMemo, useState } from 'react'
   import Image from 'next/image'
   import Link  from 'next/link'
   
   import {
     Dialog, DialogContent, DialogDescription,
     DialogHeader, DialogTitle,
   }                       from '@/components/ui/dialog'
   import { Button }       from '@/components/ui/button'
   import { X, Check }     from 'lucide-react'
   
   /* ───────────────────────── constants ──────────────────────────── */
   const TMDB = 'https://api.themoviedb.org/3'
   const KEY  = '8099992c2241e752e151a9908acef357'
   
   /* Exact auditorium contour – “1” = seat, “0” = gap               */
   const MASK = [
     '0011111111111000',   // row A
     '0011111111111000',   // row B
     '0011111111111000',   // row C
     '0001111111110000',   // row D
     '0001111111110000',   // row E
     '0000111111100000',   // row F
     '0000111111100000'    // row G
   ]
   
   type Seat = {
     id         : string      // “E7”
     row        : string      // “E”
     col        : number      // column index (0-based)
     colDisplay : number      // human number printed inside seat
     taken      : boolean
   }
   
   /* buildSeats() — turns MASK → array of seat objects               */
   function buildSeats(): Seat[] {
     const out: Seat[] = []
     MASK.forEach((maskRow, rIdx) => {
       const letter = String.fromCharCode(65 + rIdx)   // A, B, C…
       let seatNum  = 1
       maskRow.split('').forEach((bit, cIdx) => {
         if (bit === '1') {
           out.push({
             id: `${letter}${seatNum}`,
             row: letter,
             col: cIdx,
             colDisplay: seatNum,
             taken: Math.random() < 0.18          // demo occupancy
           })
           seatNum++
         }
       })
     })
     return out
   }
   
   /* simple 680-px “curve” path for the screen banner                */
   const SCREEN_PATH = 'M0 0 Q340 40 680 0'
   
   /* ───────────────────────────────── page component ─────────────── */
   export default function ReservationPage() {
     /* ─ query params & router ─ */
     const qs     = useSearchParams()
     const router = useRouter()
   
     const movieId = qs.get('movieId') ?? '385687'
     const when    = qs.get('time')    ?? '13:00 VF'
     const cinema  = qs.get('cinema')  ?? 'Pathé Californie'
   
     /* ─ movie meta fetch ─ */
     const [movie, setMovie] = useState<any | null>(null)
     useEffect(() => {
       fetch(`${TMDB}/movie/${movieId}?api_key=${KEY}&language=fr-FR`)
         .then(r => r.json())
         .then(setMovie)
     }, [movieId])
   
     /* ─ seat data & selection ─ */
     const [seats] = useState<Seat[]>(buildSeats)
     const [chosen, setChosen] = useState<Set<string>>(new Set())
   
     const toggle = (id: string, taken: boolean) => {
       if (taken) return
       setChosen(p => {
         const n = new Set(p)
         n.has(id) ? n.delete(id) : n.add(id)
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
       <div className="flex min-h-screen text-white">
   
         {/* ░░ Left rail ░░ */}
         <aside className="w-full max-w-[320px] bg-[#0D0D0D]/95">
           <div className="relative h-64">
             {movie?.backdrop_path && (
               <Image
                 src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                 alt={movie.title}
                 fill priority
                 className="object-cover opacity-30"
               />
             )}
   
             <div className="absolute inset-0 flex flex-col justify-between p-5">
               <Link href="/" className="h-10 w-10 rounded-full bg-black/60 flex items-center justify-center">
                 🏠
               </Link>
   
               <div>
                 <h2 className="text-xl font-bold drop-shadow-lg">{movie?.title}</h2>
                 <p className="text-sm drop-shadow">{cinema}</p>
   
                 <Button size="sm" variant="outline" asChild
                         className="mt-3 bg-white/10 border-white/25 hover:bg-white/20">
                   <Link href="/films">Changer de film</Link>
                 </Button>
               </div>
             </div>
           </div>
   
           <Info label="Cinéma"  value={cinema}/>
           <Info label="Date"    value="mardi 24 juin 2025"/>
           <Info label="Séance"  value={when}/>
         </aside>
   
         {/* ░░ Main ░░ */}
         <main className="flex-1 bg-[#0F0F0F]">
           <section className="mx-auto max-w-[900px] p-6 md:p-12 text-center">
             <h1 className="text-3xl font-bold">Sélectionnez vos places</h1>
             <p className="mt-1 text-sm text-gray-400">{freeCount} places libres</p>
   
             {/* seat-grid */}
             <div className="mt-8 inline-block rounded-xl bg-[#181818] p-6 shadow">
               {Object.entries(rowsGrouped).map(([row, rowSeats]) => (
                 <div key={row} className="mb-2 flex items-center justify-center gap-2">
                   {/* row letters on the left */}
                   <span className="w-4 text-xs text-gray-300">{row}</span>
   
                   {rowSeats.map(seat => {
                     const state: 'free' | 'sel' | 'busy' =
                       seat.taken ? 'busy' : chosen.has(seat.id) ? 'sel' : 'free'
   
                     const bg = {
                       free: 'bg-gray-300 hover:bg-gray-100',
                       sel : 'bg-[#E50914]',
                       busy: 'bg-gray-600 cursor-not-allowed'
                     }[state]
   
                     return (
                       <button
                         key={seat.id}
                         onClick={() => toggle(seat.id, seat.taken)}
                         disabled={seat.taken}
                         title={`${seat.row} ${seat.colDisplay} • ${
                           state === 'busy'
                             ? 'Occupée'
                             : state === 'sel'
                               ? 'Ma place'
                               : 'Libre'
                         }`}
                         className={`h-5 w-5 rounded-sm text-[10px] font-semibold leading-5
                                     ${bg} transition-colors`}
                       >
                         {seat.colDisplay}
                       </button>
                     )
                   })}
   
                   {/* row letters on the right */}
                   <span className="w-4 text-xs text-gray-300">{row}</span>
                 </div>
               ))}
   
               {/* screen banner */}
               <svg viewBox="0 0 680 50" className="mt-8 h-8 w-full">
                 <path d={SCREEN_PATH} fill="none" stroke="#E50914" strokeWidth="4" />
                 <text x="50%" y="47" textAnchor="middle"
                       className="fill-[#E50914] text-xs">Écran</text>
               </svg>
             </div>
   
             {/* legend */}
             <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
               <Legend clr="#E50914" label="Mes places"/>
               <Legend clr="#D1D5DB" label="Places libres"/>
               <Legend clr="#4B5563" label="Occupées"/>
             </div>
   
             {/* CTA */}
             <Button className="mt-8 bg-[#E50914] hover:bg-[#bf0811]"
                     disabled={!chosen.size} onClick={() => setOpen(true)}>
               Confirmer la réservation ({chosen.size})
             </Button>
           </section>
         </main>
   
         {/* confirmation dialog */}
         <Dialog open={open} onOpenChange={setOpen}>
           <DialogContent className="rounded-popover bg-[#1a1a1a] border border-white/10">
             <DialogHeader>
               <DialogTitle>Confirmation</DialogTitle>
               <DialogDescription>
                 Vous allez réserver {chosen.size} place(s) pour <b>{movie?.title}</b>.
               </DialogDescription>
             </DialogHeader>
   
             <div className="my-4 flex flex-wrap gap-2">
               {Array.from(chosen).map(id => (
                 <span key={id} className="inline-flex items-center gap-1 bg-white/10 rounded px-2 py-0.5 text-sm">
                   {`${id[0]} ${id.slice(1)}`}
                   <X size={12} className="cursor-pointer" onClick={() => toggle(id, false)} />
                 </span>
               ))}
             </div>
   
             <div className="flex justify-end gap-3">
               <Button variant="ghost" onClick={() => setOpen(false)}>Annuler</Button>
               <Button onClick={confirm} className="bg-emerald-600 hover:bg-emerald-700">
                 Payer <Check size={16} className="ml-1"/>
               </Button>
             </div>
           </DialogContent>
         </Dialog>
       </div>
     )
   }
   
   /* ──────────────────────── tiny helpers ───────────────────────── */
   function Info({ label, value }: { label: string; value: string }) {
     return (
       <div className="p-6 border-t border-white/10 first:border-t-0">
         <p className="text-xs uppercase text-white/60">{label}</p>
         <p className="mt-1">{value}</p>
       </div>
     )
   }
   
   function Legend({ clr, label }: { clr: string; label: string }) {
     return (
       <span className="flex items-center gap-2">
         <span className="inline-block h-4 w-4 rounded-sm" style={{ background: clr }}/>
         {label}
       </span>
     )
   }
   