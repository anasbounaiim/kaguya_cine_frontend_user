/* components/ui/ChatButton.tsx */
"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* floating action button */}
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full
                   bg-[#E50914] text-white shadow-lg hover:bg-[#bf0811]
                   focus-visible:ring-2 focus-visible:ring-white/80"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="sr-only">
          Recevoir des recommandations de films (chatbot)
        </span>
      </Button>

      {/* simple dialog shell – replace content with your AI component */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
          <div className="text-center text-lg font-semibold mb-4">
            Chatbot Recos&nbsp;💬✨
          </div>

          {/* placeholder */}
          <p className="text-sm text-white/80">
            (Ici viendra votre composant de chat&nbsp;LLM pour recommander un
            film selon votre humeur.)
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
