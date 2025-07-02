// components/layout/footer.tsx
"use client";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

const navLinks = [
  { href: "/", label: "Main" },
  { href: "/movies", label: "Catalog" },
  { href: "/reservation", label: "Reservation" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="rounded-t-[56px] bg-white/10 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-3 md:px-12">
        {/* col 1 */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 ">
            <img
              src="/KaguyaCine_logo.svg"
              alt="KaguyaCiné Logo"
              className="h-12 w-12 bg-[#E50914] rounded-md"
            />
            <span className="text-2xl font-extrabold font-outfit">
              .
            </span>
          </div>
          <p className="max-w-xs text-sm text-white/80">
            Votre portail cinéma — billets, actus et bandes-annonces en un clic.
          </p>
        </div>

        {/* col 2 – nav */}
        <nav className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Navigation
          </h3>
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block text-sm text-white/90 transition hover:text-[#E50914]"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* col 3 – info + socials */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
              Information
            </h3>
            {["Privacy&nbsp;policy", "Cookie&nbsp;policy", "About&nbsp;us"].map(
              (txt) => (
                <Link
                  key={txt}
                  href="#"
                  className="block text-sm text-white/90 transition hover:text-[#E50914]"
                  dangerouslySetInnerHTML={{ __html: txt }}
                />
              )
            )}
          </div>

          <div className="flex gap-5">
            {[Facebook, Instagram, Twitter].map((Icon) => (
              <Link
                key={Icon.displayName}
                href="#"
                aria-label={Icon.displayName}
                className="rounded-full bg-white/15 p-2 transition hover:bg-[#E50914]"
              >
                <Icon size={18} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/15 py-6 text-center text-xs text-white/70">
        © {new Date().getFullYear()} KaguyaCiné — All rights reserved.
      </div>
    </footer>
  );
}
