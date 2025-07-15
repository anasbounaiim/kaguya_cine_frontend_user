// app/layout.tsx
import "./globals.css";            // Tailwind base + shadcn
import { ReactNode } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ChatWidget from "@/components/ui/ChatWidget";
import { Toaster } from "react-hot-toast";
import AuthGuard from "@/components/Auth/AuthGuard";

export const metadata = {
  title: "KaguyaCiné",
  description: "Votre portail cinéma — billets, actus et bandes-annonces.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="bg-surface text-white">
      <body className="flex min-h-screen flex-col">
        <AuthGuard>
          <Header />
        </AuthGuard>
        <main className="flex-1">
          <Toaster position="bottom-right" />
          {children}
        </main>
        <Footer />

        <ChatWidget />
      </body>
    </html>
  );
}
