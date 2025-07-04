/* app/confirmation/page.tsx
   ─────────────────────────────────────────────────────────────── */
   'use client'

   import { useSearchParams, useRouter } from 'next/navigation'
   import { useState } from 'react'
   import { useForm } from 'react-hook-form'
   import { z } from 'zod'
   import { zodResolver } from '@hookform/resolvers/zod'
   import {
     Shield, Loader2, Lock, CheckCircle, ArrowLeft, CreditCard, 
     Eye, EyeOff, Calendar, Hash
   } from 'lucide-react'
   import Image from 'next/image'
   import Link from 'next/link'
   import { Button } from '@/components/ui/button'
   import { Badge } from '@/components/ui/badge'
   
   /* ────────── constantes locales ────────── */
   const TMDB = 'https://api.themoviedb.org/3'
   const KEY  = '8099992c2241e752e151a9908acef357'
   
   /* plan de salle simplifié pour retrouver type & prix */
   const MASK = [
     '0011111111111000','0011111111111000','0011111111111000',
     '0001111111110000','0001111111110000','0000111111100000','0000111111100000'
   ]
   const VIP_ROWS=['F','G'];const PREMIUM_ROWS=['D','E']
   type Seat={id:string;row:string;price:number;type:'standard'|'premium'|'vip'}
   function buildSeatLookup():Record<string,Seat>{
     const out:Record<string,Seat>={}
     MASK.forEach((row,i)=>{const L=String.fromCharCode(65+i);let n=1
       row.split('').forEach(b=>{
         if(b==='1'){
           const type=VIP_ROWS.includes(L)?'vip':PREMIUM_ROWS.includes(L)?'premium':'standard'
           const price=type==='vip'?120:type==='premium'?75:50
           out[`${L}${n}`]={id:`${L}${n}`,row:L,price,type};n++
         }
       })
     });return out
   }
   const lookup=buildSeatLookup()
   
   /* Schemas */
   const UserSchema=z.object({
     firstName:z.string().min(2),
     lastName :z.string().min(2),
     email    :z.string().email(),
     phone    :z.string().regex(/^[0-9+\s()-]{8,}$/),
   })
   const PaymentSchema=z.object({
     cardNumber :z.string().regex(/^\d{16}$/),
     expiryDate :z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/),
     cvv        :z.string().regex(/^\d{3}$/),
     cardName   :z.string().min(2),
   })
   type UserForm=z.infer<typeof UserSchema>
   type PaymentForm=z.infer<typeof PaymentSchema>
   
   /* ───────────────────────── composant page ───────────────────────── */
   export default function ConfirmationPage(){
     const qs=useSearchParams();const router=useRouter()
   
     const movieId=qs.get('movie')??''
     const when   =qs.get('time')??''
     const cinema =qs.get('cinema')??''
     const seatIds=qs.get('seats')??''
     const seats  =seatIds.split(',').filter(Boolean).map(id=>lookup[id])
     const total  =seats.reduce((s,seat)=>s+seat.price,0)+5
   
     const [step,setStep]=useState<'personal'|'payment'|'done'>('personal')
     const [processing,setProc]=useState(false)
     const [personal,setPersonal]=useState<UserForm|null>(null)
     const [showCvv,setShowCvv]=useState(false)
   
     /* forms */
     const pf=useForm<UserForm>({resolver:zodResolver(UserSchema)})
     const onPersonal=(d:UserForm)=>{setPersonal(d);setStep('payment')}
   
     const pay=useForm<PaymentForm>({resolver:zodResolver(PaymentSchema)})
     const onPay=async ()=>{
       setProc(true);await new Promise(r=>setTimeout(r,2000));setProc(false)
       /* redirect */
       const params=new URLSearchParams({
         movie:movieId,time:when,cinema,seats:seatIds,total:String(total),
         firstName:personal!.firstName,lastName:personal!.lastName,
         email:personal!.email,phone:personal!.phone,
       }).toString()
       router.push(`/ticket?${params}`)
     }
   
     /* ────────── layout ────────── */
     return(
       <div className="min-h-screen flex flex-col bg-black text-white">
         {/* Top bar */}
         <header className="flex items-center gap-4 px-8 py-6 border-b border-white/10">
           <Link href="/" className="p-2 rounded-full hover:bg-white/10 transition-colors">
             <ArrowLeft className="h-5 w-5"/>
           </Link>
           <h1 className="text-lg font-medium">Finaliser la réservation</h1>
         </header>
   
         <main className="flex flex-1">
           {/* ----- left: stepper ----- */}
           <aside className="w-60 bg-black/40 border-r border-white/10 p-8 hidden lg:block">
             <Stepper current={step}/>
           </aside>
   
           {/* ----- center: form ----- */}
           <section className="flex-1 p-6 md:p-12 flex items-center justify-center">
             {step==='personal' && (
               <FormCard title="Informations personnelles" onSubmit={pf.handleSubmit(onPersonal)}>
                 <div className="grid gap-6">
                   <div className="grid grid-cols-2 gap-4">
                     <Field label="Prénom" name="firstName" register={pf.register} error={pf.formState.errors.firstName?.message}/>
                     <Field label="Nom" name="lastName" register={pf.register} error={pf.formState.errors.lastName?.message}/>
                   </div>
                   <Field label="E-mail" name="email" type="email" register={pf.register} error={pf.formState.errors.email?.message}/>
                   <Field label="Téléphone" name="phone" register={pf.register} error={pf.formState.errors.phone?.message}/>
                 </div>
                 <Button className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white font-medium py-4 rounded-xl transition-colors">
                   Continuer
                 </Button>
               </FormCard>
             )}
   
             {step==='payment' && (
               <FormCard title="Paiement sécurisé" subtitle={`Total : ${total} DH`}>
                 <div className="grid gap-6">
                   {/* Card Number */}
                   <div className="relative">
                     <Field 
                       label="Numéro de carte" 
                       name="cardNumber" 
                       register={pay.register} 
                       error={pay.formState.errors.cardNumber?.message} 
                       maxLength={16}
                       placeholder="1234 5678 9012 3456"
                       icon={<CreditCard className="h-5 w-5" />}
                     />
                   </div>
                   
                   {/* Expiry & CVV */}
                   <div className="grid grid-cols-2 gap-4">
                     <Field 
                       label="Expiration" 
                       name="expiryDate" 
                       register={pay.register} 
                       error={pay.formState.errors.expiryDate?.message} 
                       placeholder="MM/AA" 
                       maxLength={5}
                       icon={<Calendar className="h-5 w-5" />}
                     />
                     <div className="relative">
                       <Field 
                         label="CVV" 
                         name="cvv" 
                         register={pay.register} 
                         error={pay.formState.errors.cvv?.message} 
                         maxLength={3}
                         placeholder="123"
                         type={showCvv ? 'text' : 'password'}
                         icon={<Hash className="h-5 w-5" />}
                       />
                       <button
                         type="button"
                         onClick={() => setShowCvv(!showCvv)}
                         className="absolute right-4 top-9 text-white/60 hover:text-white transition-colors"
                       >
                         {showCvv ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                       </button>
                     </div>
                   </div>
                   
                   {/* Cardholder Name */}
                   <Field 
                     label="Nom du titulaire" 
                     name="cardName" 
                     register={pay.register} 
                     error={pay.formState.errors.cardName?.message}
                     placeholder="Nom complet"
                   />
                   
                   {/* Security Notice */}
                   <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                     <Shield className="h-5 w-5 text-green-400 flex-shrink-0"/>
                     <div className="text-sm">
                       <p className="text-white/90 font-medium">Paiement 100% sécurisé</p>
                       <p className="text-white/60">Vos données sont protégées par un cryptage SSL</p>
                     </div>
                   </div>
                 </div>
                 
                 <Button 
                   className="w-full mt-8 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-medium py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]" 
                   disabled={processing || pay.formState.isSubmitting} 
                   onClick={pay.handleSubmit(onPay)}
                 >
                   {processing ? (
                     <>
                       <Loader2 className="h-5 w-5 animate-spin mr-3"/>
                       Traitement en cours...
                     </>
                   ) : (
                     <>
                       <Lock className="h-5 w-5 mr-3"/>
                       Payer {total} DH
                     </>
                   )}
                 </Button>
               </FormCard>
             )}
   
             {step==='done' && (
               <div className="flex flex-col items-center gap-6 mt-24">
                 <div className="relative">
                   <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                   <CheckCircle className="h-24 w-24 text-green-400 relative"/>
                 </div>
                 <h2 className="text-3xl font-bold">Paiement réussi !</h2>
                 <p className="text-white/60">Redirection vers votre billet...</p>
               </div>
             )}
           </section>
   
           {/* ----- right: summary ----- */}
           <aside className="w-80 bg-black/40 border-l border-white/10 p-8 space-y-8 hidden lg:block">
             <h3 className="text-xl font-semibold">Récapitulatif</h3>
             
             <div className="space-y-4">
               <div className="text-sm text-white/60">
                 <p>Cinema: {cinema}</p>
                 <p>Séance: {when}</p>
               </div>
               
               <div className="space-y-3">
                 {seats.map(s=>(
                   <div key={s.id} className="flex items-center justify-between py-2 border-b border-white/10">
                     <div className="flex items-center gap-3">
                       <Badge variant={s.type === 'vip' ? 'default' : s.type === 'premium' ? 'secondary' : 'outline'} 
                              className={`
                                ${s.type === 'vip' ? 'bg-red-600/20 text-red-400 border-red-600/30' : ''}
                                ${s.type === 'premium' ? 'bg-white/10 text-white border-white/20' : ''}
                                ${s.type === 'standard' ? 'bg-transparent text-white/60 border-white/20' : ''}
                              `}>
                         {s.type}
                       </Badge>
                       <span className="font-medium">Siège {s.id}</span>
                     </div>
                     <span className="font-semibold">{s.price} DH</span>
                   </div>
                 ))}
               </div>
               
               <div className="pt-4 border-t border-white/20">
                 <div className="flex justify-between text-sm text-white/60 mb-2">
                   <span>Sous-total</span>
                   <span>{total - 5} DH</span>
                 </div>
                 <div className="flex justify-between text-sm text-white/60 mb-4">
                   <span>Frais de service</span>
                   <span>5 DH</span>
                 </div>
                 <div className="flex justify-between text-xl font-bold">
                   <span>Total</span>
                   <span className="text-red-400">{total} DH</span>
                 </div>
               </div>
             </div>
           </aside>
         </main>
       </div>
     )
   }
   
   /* ---------- Stepper ---------- */
   function Stepper({current}:{current:'personal'|'payment'|'done'}) {
     const steps=[
       {id:'personal',label:'Informations personnelles'},
       {id:'payment' ,label:'Paiement sécurisé'}
     ] as const
     
     return(
       <div className="space-y-8">
         <h3 className="text-lg font-semibold">Étapes</h3>
         <ol className="space-y-8 relative">
           {steps.map((s,i)=>{
             const isActive = current === s.id
             const isCompleted = steps.findIndex(st=>st.id===current) > i
             
             return(
               <li key={s.id} className="relative pl-8">
                 {/* ligne verticale */}
                 {i < steps.length-1 && (
                   <span className={`absolute left-[11px] top-6 h-12 w-px transition-colors ${
                     isCompleted ? 'bg-red-500' : 'bg-white/20'
                   }`}/>
                 )}
                 
                 {/* rond */}
                 <div className={`absolute left-0 top-0 h-6 w-6 rounded-full border-2 transition-all ${
                   isActive ? 'bg-red-600 border-red-600' : 
                   isCompleted ? 'bg-red-600 border-red-600' : 
                   'bg-transparent border-white/30'
                 }`}>
                   {isCompleted && (
                     <CheckCircle className="h-4 w-4 text-white absolute top-0.5 left-0.5"/>
                   )}
                 </div>
                 
                 <div className={`transition-colors ${
                   isActive ? 'text-red-400 font-semibold' : 
                   isCompleted ? 'text-white/90' : 
                   'text-white/60'
                 }`}>
                   {s.label}
                 </div>
               </li>
             )
           })}
         </ol>
       </div>
     )
   }
   
   /* ---------- Reusable card wrapper ---------- */
   function FormCard({title,subtitle,children,onSubmit}:{title:string;subtitle?:string;children:React.ReactNode;onSubmit?:React.FormEventHandler}) {
     return(
       <div className="w-full max-w-lg">
         <form onSubmit={onSubmit} className="bg-black/60 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
           <div className="text-center mb-8">
             <h2 className="text-2xl font-bold mb-2">{title}</h2>
             {subtitle && <p className="text-white/60 text-lg">{subtitle}</p>}
           </div>
           {children}
         </form>
       </div>
     )
   }
   
   /* ---------- Field ---------- */
   function Field({
     label,name,register,error,type='text',placeholder,maxLength,icon
   }:{
     label:string;name:string;register:any;error?:string;type?:string;placeholder?:string;maxLength?:number;icon?:React.ReactNode
   }) {
     return(
       <div className="space-y-2">
         <label className="text-sm font-medium text-white/90">{label}</label>
         <div className="relative">
           {icon && (
             <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40">
               {icon}
             </div>
           )}
           <input
             {...register(name)}
             type={type}
             placeholder={placeholder}
             maxLength={maxLength}
             className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-4 rounded-xl bg-white/5 border backdrop-blur-sm 
               transition-all duration-200 outline-none text-white placeholder-white/40
               focus:bg-white/10 focus:border-red-500/50 focus:shadow-lg focus:shadow-red-500/20
               ${error ? 'border-red-500/50 bg-red-500/10' : 'border-white/10 hover:border-white/20'}`}
           />
         </div>
         {error && (
           <p className="text-red-400 text-sm flex items-center gap-2">
             <span className="w-1 h-1 bg-red-400 rounded-full"></span>
             {error}
           </p>
         )}
       </div>
     )
   }