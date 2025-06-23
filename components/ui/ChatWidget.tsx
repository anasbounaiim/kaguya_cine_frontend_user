/* components/ui/ChatWidget.tsx */
"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

/* ───── types ───── */
type Msg = { role: "user" | "assistant"; content: string };

/* ───── component ───── */
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  /* auto-scroll on new message */
  useEffect(() => {
    scroller.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [msgs]);

  const send = () => {
    if (!draft.trim()) return;
    const q = draft.trim();
    setDraft("");
    setMsgs((m) => [...m, { role: "user", content: q }]);

    // demo reply — replace with API call
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: "💡 Je réfléchis à une reco…" },
      ]);
    }, 700);
  };

  const welcome = msgs.length === 0;

  return (
    <>
      {/* ─── floating action button ─── */}
      <Button
        size="icon"
        onClick={() => setOpen(true)}
        className="fixed bottom-7 right-7 z-50 h-16 w-16 rounded-full
                   bg-[#E50914] text-white shadow-2xl transition-all duration-300
                   hover:bg-[#bf0811] hover:scale-110 hover:shadow-[0_0_30px_rgba(229,9,20,0.6)]"
      >
        <MessageCircle className="h-8 w-8" />
        <span className="sr-only">Chatbot recommandations</span>
      </Button>

      {/* ─── modal ─── */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="flex h-[90vh] w-[95vw] max-w-5xl flex-col rounded-3xl
                     bg-[#141414]/95 backdrop-blur-xl border border-white/20
                     p-0 shadow-2xl
                     sm:h-[92vh] sm:w-[90vw] 
                     md:w-[85vw] md:max-w-4xl
                     lg:w-[80vw] lg:max-w-5xl
                     xl:w-[75vw] xl:max-w-6xl"
        >
          <DialogHeader className="py-6 border-b border-white/10">
            <DialogTitle className="mx-auto text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              🎬 Recos&nbsp;cinéma&nbsp;✨
            </DialogTitle>
          </DialogHeader>

          {/* ─── message list ─── */}
          <div
            ref={scroller}
            className="flex-1 overflow-y-auto space-y-6 px-6 py-8
                       scrollbar-thin scrollbar-track-transparent
                       scrollbar-thumb-[#E50914]/40 hover:scrollbar-thumb-[#E50914]/60
                       sm:px-8 sm:space-y-8
                       md:px-12"
          >
            {welcome ? (
              <Welcome setDraft={setDraft} />
            ) : (
              msgs.map((m, i) => <Bubble key={i} msg={m} />)
            )}
          </div>

          {/* ─── composer ─── */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-4 border-t border-white/15
                       bg-[#141414]/90 backdrop-blur-sm p-6
                       sm:px-8 md:px-12"
          >
            <div className="relative flex-1">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Demande-moi un film pour ce soir…"
                className="h-14 pr-4 pl-6 border border-white/20 bg-white/5 text-base
                           rounded-2xl backdrop-blur-sm
                           focus-visible:ring-2 focus-visible:ring-[#E50914]/50
                           focus-visible:border-[#E50914]/50
                           placeholder:text-white/50"
              />
            </div>
            <Button
              type="submit"
              size="icon"
              disabled={!draft.trim()}
              className="h-14 w-14 rounded-2xl bg-gradient-to-r from-[#E50914] to-[#bf0811]
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:from-[#bf0811] hover:to-[#9a0610]
                         transition-all duration-200 hover:scale-105
                         shadow-lg hover:shadow-[0_0_20px_rgba(229,9,20,0.4)]"
            >
              <Send className="h-6 w-6" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

/* ───── bubble component ───── */
function Bubble({ msg }: { msg: Msg }) {
  const mine = msg.role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} px-2`}>
      <div
        className={`max-w-2xl rounded-2xl px-6 py-4 text-base leading-relaxed shadow-lg
                    transition-all duration-200 hover:scale-[1.02] ${
          mine
            ? "rounded-br-md bg-gradient-to-r from-[#E50914] to-[#bf0811] text-white shadow-[#E50914]/20"
            : "rounded-bl-md bg-white/10 text-white/90 backdrop-blur-sm border border-white/10 shadow-black/20"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

/* ───── welcome panel ───── */
function Welcome({ setDraft }: { setDraft: (d: string) => void }) {
  const quick = [
    ["Soirée frissons", "Horror · Thriller"],
    ["Feel-good", "Comédie familiale"],
    ["Chef-d'œuvre", "Note IMDb > 8"],
  ];

  return (
    <div className="mt-8 flex flex-col items-center text-center max-w-4xl mx-auto">
      {/* enhanced brand-colored glow ring */}
      <div className="mb-12 relative">
        <div className="absolute inset-0 h-36 w-36 rounded-full bg-gradient-to-br
                        from-[#E50914] to-[#bf0811] blur-xl opacity-30 animate-pulse" />
        <div className="relative h-36 w-36 rounded-full bg-gradient-to-br
                        from-[#E50914] to-[#bf0811] p-1 shadow-2xl">
          <div className="h-full w-full rounded-full bg-[#141414]/90 backdrop-blur-sm
                          flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-4xl font-extrabold tracking-tight">
        Salut&nbsp;<span className="bg-gradient-to-r from-[#E50914] to-[#bf0811] bg-clip-text text-transparent">cinéphile</span>&nbsp;!
      </h2>
      <p className="mb-16 max-w-2xl text-lg text-white/70 leading-relaxed">
        Dis-moi ton humeur, un acteur ou un genre ; je te trouverai le film
        parfait pour ta soirée.
      </p>

      <div className="mb-16 grid gap-6 w-full max-w-3xl
                      grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {quick.map(([title, hint], index) => (
          <button
            key={title}
            onClick={() => setDraft(title)}
            className="group rounded-2xl bg-white/5 backdrop-blur-sm p-8 text-sm 
                       border border-white/10 hover:bg-white/10 hover:border-white/20
                       transition-all duration-300 hover:scale-105 hover:shadow-xl
                       hover:shadow-[#E50914]/10"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-2 text-lg font-semibold group-hover:text-[#E50914] transition-colors">
              {title}
            </div>
            <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
              {hint}
            </p>
          </button>
        ))}
      </div>

      <div className="mx-auto flex max-w-md justify-between text-base">
        {["Général", "Genre", "Humeur", "Acteur"].map((t, i) => (
          <span
            key={t}
            className={`cursor-pointer pb-2 px-3 transition-all duration-200 ${
              i === 0
                ? "border-b-2 border-[#E50914] text-white font-medium"
                : "text-white/50 hover:text-white/80 hover:scale-105"
            }`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}