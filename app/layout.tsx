import "./globals.css";
import { ReactNode } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ChatWidget from "@/components/ui/ChatWidget";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "KaguyaCiné",
  description: "Votre portail cinéma — billets, actus et bandes-annonces.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="bg-surface text-white">
      <body className="flex min-h-screen flex-col">
        <Header />
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
