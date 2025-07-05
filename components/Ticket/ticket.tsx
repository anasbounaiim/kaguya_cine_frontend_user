'use client';

   import { useSearchParams } from 'next/navigation';
   import { useEffect, useState } from 'react';
   import Image from 'next/image';
   import Link from 'next/link';
   import QRCode from 'react-qr-code';
   import {
     Download,
     ArrowLeft,
     MapPin,
     Calendar,
     Clock,
     User,
     Ticket as TicketIcon,
     AlertCircle,
     Check,
   } from 'lucide-react';
   import { Button } from '@/components/ui/button';
   
   /* ---------- Constantes locales ---------- */
   const TMDB = 'https://api.themoviedb.org/3';
   const KEY  = '8099992c2241e752e151a9908acef357';
   
   /* Plan de la salle → lookup siège / prix / type */
   const MASK = [
     '0011111111111000',
     '0011111111111000',
     '0011111111111000',
     '0001111111110000',
     '0001111111110000',
     '0000111111100000',
     '0000111111100000',
   ];
   const VIP_ROWS     = ['F', 'G'];
   const PREMIUM_ROWS = ['D', 'E'];
   
   type SeatType = 'vip' | 'premium' | 'standard';
   type Seat = { id: string; row: string; price: number; type: SeatType };
   
   const seatLookup: Record<string, Seat> = (() => {
     const out: Record<string, Seat> = {};
     MASK.forEach((row, r) => {
       const L = String.fromCharCode(65 + r);
       let n = 1;
       row.split('').forEach(bit => {
         if (bit === '1') {
           const type: SeatType =
             VIP_ROWS.includes(L) ? 'vip' : PREMIUM_ROWS.includes(L) ? 'premium' : 'standard';
           const price = type === 'vip' ? 120 : type === 'premium' ? 75 : 50;
           out[`${L}${n}`] = { id: `${L}${n}`, row: L, price, type };
           n++;
         }
       });
     });
     return out;
   })();
   
   interface Movie {
     id: number;
     title: string;
     backdrop_path: string | null;
     poster_path: string | null;
     overview: string;
     release_date: string;
     runtime: number;
     vote_average: number;
   }
   
   /* ---------- Helpers ---------- */
   const currency = new Intl.NumberFormat('fr-MA', {
     style: 'currency',
     currency: 'MAD',
   }).format;
   
   const formatDate = (dateString: string) => {
     if (!dateString) return '—';
     try {
       return new Intl.DateTimeFormat('fr-FR', {
         weekday: 'long',
         year: 'numeric',
         month: 'long',
         day: 'numeric',
       }).format(new Date(dateString));
     } catch {
       return dateString;
     }
   };
   
   /* ---------- Composant page ---------- */
   export default function Ticket() {
     const qs = useSearchParams();
   
     /* Query params */
     const movieId  = qs.get('movie')  ?? '';
     const time     = qs.get('time')   ?? '';
     const cinema   = qs.get('cinema') ?? 'Cinéma Megarama';
     const seatIds  = (qs.get('seats') ?? '').split(',').filter(Boolean);
     const seatObjs = seatIds.map(id => seatLookup[id]).filter(Boolean);
     const seatText = seatObjs.map(s => s.id).join(', ');
     const first    = qs.get('firstName') ?? '';
     const last     = qs.get('lastName')  ?? '';
     const holder   = `${first} ${last}`.trim();
     const booking  = qs.get('bid') ?? Math.random().toString(36).substring(2, 8).toUpperCase();
     const dateParam = qs.get('date') ?? '';
   
     /* Prix */
     const subtotalCalculated = seatObjs.reduce((s, st) => s + st.price, 0);
     const fees  = 5;
     const total = Number(qs.get('total')) || subtotalCalculated + fees;
   
     /* Film */
     const [movie, setMovie]   = useState<Movie | null>(null);
     const [loading, setLoad]  = useState(true);
     const [error, setError]   = useState<string | null>(null);
   
     useEffect(() => {
       if (!movieId) { setLoad(false); return; }
   
       setLoad(true); setError(null);
       fetch(`${TMDB}/movie/${movieId}?api_key=${KEY}&language=fr-FR`)
         .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
         .then(data => setMovie(data))
         .catch(() => setError('Impossible de charger les informations du film'))
         .finally(() => setLoad(false));
     }, [movieId]);
   
     /* QR payload */
     const qrPayload = JSON.stringify({ booking, movieId, seatIds, holder, total, timestamp: Date.now() });
   
     /* Download JSON */
     const [downloading, setDl] = useState(false);
     const download = async () => {
       setDl(true);
       try {
         const ticket = {
           booking, movie: movie?.title ?? 'Film', cinema, date: dateParam, time,
           seats: seatText, holder, total, qrCode: qrPayload, generated: new Date().toISOString(),
         };
         const blob = new Blob([JSON.stringify(ticket, null, 2)], { type: 'application/json' });
         const url = URL.createObjectURL(blob);
         const a = Object.assign(document.createElement('a'), {
           href: url,
           download: `billet-${booking}-${(movie?.title ?? 'cinema').replace(/[^a-z0-9]/gi,'-')}.json`,
         });
         document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
       } finally { setDl(false); }
     };
   
     /* Loading */
     if (loading) return (
       <div className="min-h-screen bg-black flex items-center justify-center">
         <div className="text-center">
           <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6" />
           <p className="text-white/60 text-sm font-medium">Loading your ticket...</p>
         </div>
       </div>
     );
   
     /* Error */
     if (error && !movie) return (
       <div className="min-h-screen bg-black flex items-center justify-center">
         <div className="text-center max-w-md px-6">
           <AlertCircle className="h-10 w-10 text-white/40 mx-auto mb-6" />
           <h2 className="text-xl font-semibold mb-3 text-white">Something went wrong</h2>
           <p className="text-white/60 mb-8 text-sm leading-relaxed">{error}</p>
           <Link href="/" className="text-white hover:text-white/80 transition-colors text-sm font-medium">
             ← Back to home
           </Link>
         </div>
       </div>
     );
   
     /* ---------------- UI ---------------- */
     return (
       <div className="min-h-screen bg-black text-white overflow-hidden">
         {/* Animated Background */}
         <div className="fixed inset-0 opacity-30">
           <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-red-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
         </div>
   
         {/* Header */}
         <header className="relative z-10 px-6 py-6">
           <div className="max-w-4xl mx-auto">
             <Link href="/" className="inline-flex items-center gap-3 text-white/60 hover:text-white transition-colors group">
               <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
               <span className="text-sm font-medium">Back</span>
             </Link>
           </div>
         </header>
   
         {/* Main Content */}
         <main className="relative z-10 px-6 pb-12">
           <div className="max-w-4xl mx-auto">
             {/* Success Badge */}
             <div className="flex justify-center mb-8">
               <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
                 <Check className="h-4 w-4 text-green-400" />
                 <span className="text-sm font-medium text-green-400">Ticket Confirmed</span>
               </div>
             </div>
   
             {/* Ticket Card - Horizontal Layout */}
             <div className="bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
               <div className="flex flex-col lg:flex-row min-h-[400px]">
                 {/* Left Side - Movie Poster/Backdrop */}
                 <div className="lg:w-2/5 relative">
                   <div className="relative h-64 lg:h-full overflow-hidden">
                     {movie?.backdrop_path && (
                       <Image
                         src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                         fill
                         alt={movie.title}
                         className="object-cover"
                         priority
                       />
                     )}
                     <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                     
                     {/* Movie Title Overlay */}
                     <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                       <h1 className="text-2xl lg:text-3xl font-bold mb-2 leading-tight">
                         {movie?.title ?? 'Movie Title'}
                       </h1>
                       <div className="flex items-center gap-4 text-white/60 text-sm">
                         {movie?.vote_average && (
                           <div className="flex items-center gap-1">
                             <span className="text-yellow-400">★</span>
                             <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
                           </div>
                         )}
                         {movie?.runtime && (
                           <span className="font-medium">
                             {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                           </span>
                         )}
                       </div>
                     </div>
   
                     {/* Booking ID Badge */}
                     <div className="absolute top-6 right-6">
                       <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                         <span className="font-mono text-sm font-semibold">#{booking}</span>
                       </div>
                     </div>
                   </div>
                 </div>
   
                 {/* Right Side - Ticket Details */}
                 <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-between">
                   <div className="flex-1">
                     {/* Header */}
                     <div className="mb-8">
                       <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Digital Ticket</p>
                       <div className="flex items-center gap-2">
                         <Check className="h-4 w-4 text-green-400" />
                         <span className="text-green-400 text-sm font-medium">Confirmed</span>
                       </div>
                     </div>
   
                     {/* Details Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                       <div className="space-y-6">
                         <DetailItem 
                           icon={<MapPin className="h-4 w-4" />} 
                           label="Cinema" 
                           value={cinema} 
                         />
                         <DetailItem 
                           icon={<Calendar className="h-4 w-4" />} 
                           label="Date" 
                           value={formatDate(dateParam)} 
                         />
                         <DetailItem 
                           icon={<Clock className="h-4 w-4" />} 
                           label="Time" 
                           value={time || '—'} 
                         />
                       </div>
                       <div className="space-y-6">
                         <DetailItem 
                           icon={<TicketIcon className="h-4 w-4" />} 
                           label="Seats" 
                           value={seatText || '—'} 
                         />
                         {holder && (
                           <DetailItem 
                             icon={<User className="h-4 w-4" />} 
                             label="Holder" 
                             value={holder} 
                           />
                         )}
                       </div>
                     </div>
                   </div>
   
                   {/* Bottom Section - QR & Pricing */}
                   <div className="flex items-end justify-between gap-8">
                     {/* QR Code */}
                     <div className="flex-shrink-0">
                       <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Entry Code</p>
                       <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                         <QRCode 
                           value={qrPayload}
                           size={80}
                           fgColor="#ffffff"
                           bgColor="transparent"
                           className="opacity-90" title={''}                         />
                       </div>
                     </div>
   
                     {/* Pricing */}
                     <div className="flex-1 max-w-xs">
                       <div className="space-y-3">
                         <div className="flex justify-between items-center text-sm">
                           <span className="text-white/60">Subtotal</span>
                           <span className="font-medium">{currency(subtotalCalculated)}</span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                           <span className="text-white/60">Service Fee</span>
                           <span className="font-medium">{currency(fees)}</span>
                         </div>
                         <div className="h-px bg-white/10 my-3" />
                         <div className="flex justify-between items-center">
                           <span className="font-semibold">Total</span>
                           <span className="text-xl font-bold">{currency(total)}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
   
             {/* Download Button */}
             <div className="flex justify-center mt-12">
               <Button
                 onClick={download}
                 disabled={downloading}
                 className="bg-white text-black hover:bg-white/90 px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 hover:scale-105 active:scale-95"
               >
                 {downloading ? (
                   <span className="flex items-center gap-2">
                     <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                     Downloading...
                   </span>
                 ) : (
                   <span className="flex items-center gap-2">
                     <Download className="h-4 w-4" />
                     Download Ticket
                   </span>
                 )}
               </Button>
             </div>
           </div>
         </main>
       </div>
     );
   }
   
   /* -------- Components -------- */
   function DetailItem({
     icon,
     label,
     value,
   }: {
     icon: React.ReactNode;
     label: string;
     value: string;
   }) {
     return (
       <div className="group">
         <div className="flex items-center gap-2 mb-2">
           <div className="text-white/40 group-hover:text-white/60 transition-colors">
             {icon}
           </div>
           <p className="text-white/40 text-xs font-medium uppercase tracking-wider">
             {label}
           </p>
         </div>
         <p className="text-base font-semibold ml-6 leading-tight">
           {value}
         </p>
       </div>
     );
   }