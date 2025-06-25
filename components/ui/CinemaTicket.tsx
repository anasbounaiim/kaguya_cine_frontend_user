/* components/ui/CinemaTicket.tsx
   --------------------------------------------------------------- */
   "use client";

   import Image from "next/image";
   import {QRCodeSVG}  from "qrcode.react";
   import {
     MapPin,
     Calendar,
     Clock,
     Ticket as TicketIcon,
     Car,
   } from "lucide-react";
   
   type Props = {
     logoSrc: string;          // /public/logo.svg
     movie: string;            // "Dune: Part Two"
     cinema: string;           // "KaguyaCiné Casablanca"
     hall: string;             // "Salle 7 — IMAX"
     seat: string;             // "E 12"
     date: string;             // "24 juin 2025"
     time: string;             // "19 h 50"
     ticketId: string;         // "KC-3F2B-9D17"
     price: string;            // "120 DH"
   };
   
   export default function CinemaTicket(t: Props) {
     return (
       <section className="mx-auto w-full max-w-[720px] rounded-3xl border border-white/10 bg-zinc-900/80 text-white shadow-lg shadow-black/40 backdrop-blur-sm">
         {/* top strip */}
         <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
           <div className="flex items-center gap-3">
             <Image src={t.logoSrc} alt="logo" width={36} height={36} />
             <h1 className="text-lg font-semibold tracking-wide">E-Ticket</h1>
           </div>
           <span className="text-xs font-mono text-gray-400">{t.ticketId}</span>
         </header>
   
         {/* main block */}
         <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
           {/* movie / meta */}
           <div className="md:col-span-2 space-y-4">
             <h2 className="text-2xl font-bold leading-tight">
               {t.movie}
             </h2>
   
             <div className="flex flex-wrap gap-4 text-sm text-gray-300">
               <Meta icon={MapPin}>{t.cinema}</Meta>
               <Meta icon={Calendar}>{t.date}</Meta>
               <Meta icon={Clock}>{t.time}</Meta>
             </div>
   
             <div className="flex gap-4 pt-4">
               <Badge icon={Car}>{`Place ${t.seat}`}</Badge>
               <Badge icon={TicketIcon}>{t.price}</Badge>
             </div>
           </div>
   
           {/* QR */}
           <div className="flex items-center justify-center md:justify-end">
             <div className="rounded-xl border border-white/20 p-2">
               <QRCodeSVG
                 value={t.ticketId}
                 size={128}
                 bgColor="transparent"
                 fgColor="#ffffff"
                 level="M"
               />
             </div>
           </div>
         </div>
   
         {/* bottom perforation */}
         <footer className="relative h-10 overflow-hidden">
           <svg
             viewBox="0 0 100 10"
             preserveAspectRatio="none"
             className="absolute inset-0 h-full w-full text-zinc-900"
           >
             {/* little scalloped cut-out effect */}
             <circle cx="0" cy="5" r="5" fill="currentColor" />
             <circle cx="100" cy="5" r="5" fill="currentColor" />
             <line
               x1="5"
               y1="5"
               x2="95"
               y2="5"
               stroke="white"
               strokeDasharray="2 4"
               strokeWidth="0.5"
               opacity={0.5}
             />
           </svg>
         </footer>
       </section>
     );
   }
   
   /* helper sub-components ------------------------------------------- */
   function Meta({
     icon: Icon,
     children,
   }: {
     icon: React.ElementType;
     children: React.ReactNode;
   }) {
     return (
       <span className="inline-flex items-center gap-1.5">
         <Icon size={14} className="text-red-500" />
         {children}
       </span>
     );
   }
   
   function Badge({
     icon: Icon,
     children,
   }: {
     icon: React.ElementType;
     children: React.ReactNode;
   }) {
     return (
       <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm">
         <Icon size={14} />
         {children}
       </span>
     );
   }
   