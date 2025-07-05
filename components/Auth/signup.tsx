// app/auth/signup/page.tsx  – Sign-up
"use client";

import { useRouter } from "next/navigation";
import { useState }  from "react";
import Link          from "next/link";

export default function SignUp() {
  const router       = useRouter();
  const [form,set]   = useState({ email:"", pass:"", confirm:"" });
  const [err,setErr] = useState("");
  const [loading,setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    
    if(form.pass!==form.confirm){ 
      setErr("Les mots de passe ne correspondent pas."); 
      setLoading(false);
      return; 
    }
    
    try {
      const res = await fetch("/api/auth/register",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({ email:form.email, password:form.pass }),
      });
      
      if(!res.ok){ 
        const errorData = await res.json();
        setErr(errorData.error || "Une erreur s'est produite"); 
        setLoading(false);
        return; 
      }
      
      const { jwt } = await res.json();
      localStorage.setItem("token", jwt);
      router.push("/account");
    } catch {
      setErr("Erreur de connexion. Veuillez réessayer.");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-medium text-white mb-2">Créer un compte</h1>
          <p className="text-gray-400 text-base">Saisissez vos informations pour commencer</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            value={form.email}
            onChange={v=>set(f=>({...f,email:v}))}
            placeholder="nom@exemple.com"
          />
          
          <Input 
            label="Mot de passe" 
            type="password" 
            value={form.pass}
            onChange={v=>set(f=>({...f,pass:v}))}
            placeholder="Mot de passe"
          />
          
          <Input 
            label="Confirmer le mot de passe" 
            type="password" 
            value={form.confirm}
            onChange={v=>set(f=>({...f,confirm:v}))}
            placeholder="Confirmer le mot de passe"
          />

          {err && (
            <div className="text-red-400 text-sm text-center py-2">
              {err}
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white font-medium py-4 rounded-lg transition-all duration-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-red-200 border-t-white rounded-full animate-spin"></div>
                  Création...
                </div>
              ) : (
                "Créer un compte"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Déjà inscrit ?{" "}
            <Link href="/auth/signin" className="text-red-400 hover:text-red-300 hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Input({label,value,onChange,type="text",placeholder}:{
  label:string; 
  value:string; 
  onChange:(v:string)=>void; 
  type?:string;
  placeholder?:string;
}){
  const [focused, setFocused] = useState(false);

  return(
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        className={`w-full px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 transition-all duration-200 outline-none ${
          focused 
            ? 'border-red-500/70 bg-gray-800 shadow-lg shadow-red-500/10' 
            : 'hover:border-gray-600 hover:bg-gray-800/70'
        }`}
        required 
        type={type} 
        value={value}
        placeholder={placeholder}
        onChange={e=>onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}