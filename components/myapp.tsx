/* components/myapp.tsx */
"use client";

import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Home,
  Clapperboard,
  Ticket,
  Phone,
  Search,
  Globe,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import HomePage  from "./home";
import FilmsPage from "./films";

/* ───── types ───── */
interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
}
type Screen = "home" | "films" | "reservation" | "contact";

/* ───── component ───── */
export default function CinematicHome() {
  const [movies, setMovies]       = useState<Movie[]>([]);
  const [genreMovies, setGenre]   = useState<Record<string, Movie[]>>({});
  const [screen, setScreen]       = useState<Screen>("home");

  /* helper: change section + scroll up */
  const goto = (id: Screen) => {
    setScreen(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* fetch once */
  useEffect(() => {
    (async () => {
      const pop = await fetch(
        "https://api.themoviedb.org/3/movie/popular?api_key=8099992c2241e752e151a9908acef357&language=en-US&page=1"
      ).then(r => r.json());
      setMovies(pop.results);

      const genres: Record<string, number> = {
        Action: 28, Comedy: 35, Drama: 18, Horror: 27, "Science Fiction": 878,
      };
      const by: Record<string, Movie[]> = {};
      await Promise.all(
        Object.entries(genres).map(async ([name, id]) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=8099992c2241e752e151a9908acef357&with_genres=${id}&language=en-US&page=1`
          ).then(r => r.json());
          by[name] = res.results;
        })
      );
      setGenre(by);
    })();
  }, []);

  const NAV = [
    { id: "home",        label: "Main",        icon: Home },
    { id: "films",       label: "Catalog",     icon: Clapperboard },
    { id: "reservation", label: "Reservation", icon: Ticket },
    { id: "contact",     label: "Contact",     icon: Phone },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-surface text-white">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-surface/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-10">
          <span onClick={() => goto("home")} className="cursor-pointer text-xl font-extrabold">
            🎬 KaguyaCiné
          </span>

          <NavigationMenu>
            <NavigationMenuList className="gap-4">
              {NAV.map(({ id, label, icon: Icon }) => (
                <NavigationMenuItem key={id} onClick={() => goto(id)}>
                  <NavigationMenuLink
                    className="flex flex-col items-center text-sm transition hover:text-[#E50914] data-[active=true]:text-[#E50914]"
                    data-active={screen === id}
                  >
                    <Icon size={18} />
                    {label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* search + auth */}
          <div className="hidden items-center gap-3 lg:flex">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/60" />
              <Input
                placeholder="Search in the catalog"
                className="h-9 rounded-full bg-white/10 pl-10 pr-12 placeholder:text-white/60"
              />
            </div>
            <Button className="rounded-full bg-[#E50914] px-5 hover:bg-red-700">
              Sign in
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10">
              <Globe size={18} />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1">
        {screen === "home"        && <HomePage movies={movies} genreMovies={genreMovies} />}
        {screen === "films"       && <FilmsPage />}
        {screen === "reservation" && <Stub title="📝 Réservation" text="Réservez vos billets ici." />}
        {screen === "contact"     && <Stub title="📬 Contact"     text="Formulaire ou informations pour nous contacter." />}
      </main>

      <FooterGlass goto={goto} />
    </div>
  );
}

/* ── Stub small pages ── */
function Stub({ title, text }: { title: string; text: string }) {
  return (
    <section className="mx-auto max-w-7xl p-6 md:p-12">
      <h1 className="mb-4 text-4xl font-bold">{title}</h1>
      <p>{text}</p>
    </section>
  );
}

/* ── Glass Footer ── */
function FooterGlass({ goto }: { goto: (s: Screen) => void }) {
  const links: { id: Screen; label: string }[] = [
    { id: "home", label: "Main" },
    { id: "films", label: "Catalog" },
    { id: "reservation", label: "Reservation" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <footer className="rounded-t-[56px] bg-white/10 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-3 md:px-12">
        {/* col 1 */}
        <div className="space-y-5">
          <div className="text-2xl font-extrabold">🎬 KaguyaCiné</div>
          <p className="max-w-xs text-sm text-white/80">
            Votre portail cinéma — billets, actus et bandes-annonces en un clic.
          </p>
        </div>

        {/* col 2 – nav */}
        <nav className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
            Navigation
          </h3>
          {links.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => goto(id)}
              className="block text-left text-sm text-white/90 transition hover:text-[#E50914]"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* col 3 – info + socials */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
              Information
            </h3>
            {["Privacy policy", "Cookie policy", "About us"].map((txt) => (
              <a
                key={txt}
                href="#"
                className="block text-sm text-white/90 transition hover:text-[#E50914]"
              >
                {txt}
              </a>
            ))}
          </div>

          <div className="flex gap-5">
            {[
              { icon: Facebook, sr: "Facebook" },
              { icon: Instagram, sr: "Instagram" },
              { icon: Twitter, sr: "Twitter" },
            ].map(({ icon: Icon, sr }) => (
              <a
                key={sr}
                href="#"
                aria-label={sr}
                className="rounded-full bg-white/15 p-2 transition hover:bg-[#E50914]"
              >
                <Icon size={18} />
              </a>
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
