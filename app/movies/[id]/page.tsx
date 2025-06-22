/* app/movies/[id]/page.tsx */
"use client";

import { useParams }           from "next/navigation";
import Image                   from "next/image";
import Link                    from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft, ChevronRight,
  Calendar as CalIcon, Filter, SlidersHorizontal, Info,
  Home, Clapperboard, Ticket, Phone, Search, Globe,
  Facebook, Instagram, Twitter
} from "lucide-react";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  NavigationMenu, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList
} from "@/components/ui/navigation-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Input }   from "@/components/ui/input";
import { Switch }  from "@/components/ui/switch";
import { Button }  from "@/components/ui/button";

/* ─────────  config ───────── */
const TMDB = "https://api.themoviedb.org/3";
const KEY  = "8099992c2241e752e151a9908acef357";

const sortOptions = ["New in cinema", "By newest", "By oldest", "A - Z"] as const;
const genreList: Record<string, number> = {
  "All genres": 0, Action: 28, Comedy: 35, Drama: 18, Horror: 27, "Science Fiction": 878,
};

/* ╭──────────────── Header ───────────────╮ */
function SiteHeader() {
  const NAV = [
    { href: "/",         label: "Main",        icon: Home },
    { href: "/films",    label: "Catalog",     icon: Clapperboard },
    { href: "/reservation", label: "Reservation", icon: Ticket },
    { href: "/contact",  label: "Contact",     icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#141414]/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-10">
        <Link href="/" className="text-xl font-extrabold">🎬 KaguyaCiné</Link>

        <NavigationMenu>
          <NavigationMenuList className="gap-4">
            {NAV.map(({ href, label, icon: Icon }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={href}
                    className="flex flex-col items-center text-sm text-white/90 transition hover:text-[#E50914]"
                  >
                    <Icon size={18} />{label}
                  </Link>
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
          <Button className="rounded-full bg-[#E50914] px-5 hover:bg-red-700">Sign in</Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Globe size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
}

/* ╭──────────────── Footer ───────────────╮ */
function SiteFooter() {
  return (
    <footer className="rounded-t-[56px] bg-white/10 backdrop-blur-xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-3 md:px-12">
        <div className="space-y-5">
          <div className="text-2xl font-extrabold">🎬 KaguyaCiné</div>
          <p className="max-w-xs text-sm text-white/80">
            Votre portail cinéma — billets, actus et bandes-annonces en un clic.
          </p>
        </div>

        <nav>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/70">
            Navigation
          </h3>
          {[
            { href: "/", label: "Main" },
            { href: "/films", label: "Catalog" },
            { href: "/reservation", label: "Reservation" },
            { href: "/contact", label: "Contact" },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="block py-0.5 text-sm text-white/90 transition hover:text-[#E50914]">
              {l.label}
            </Link>
          ))}
        </nav>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/70">
            Suivez-nous
          </h3>
          <div className="flex gap-5">
            {[Facebook, Instagram, Twitter].map((Icon) => (
              <a key={Icon.displayName} href="#"
                 className="rounded-full bg-white/15 p-2 transition hover:bg-[#E50914]">
                <Icon size={18} className="text-white" />
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

/* ╭──────────────── Movie page ───────────────╮ */
export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();

  /* state */
  const [movie,  setMovie]  = useState<any | null>(null);
  const [loadingMovie, setLoadingMovie] = useState(true);

  const [date,   setDate]   = useState(new Date());
  const [open,   setOpen]   = useState(false);
  const [sort,   setSort]   = useState("New in cinema");
  const [genre,  setGenre]  = useState("All genres");
  const [originals, setOriginals] = useState(false);

  /* demo show-times */
  const [cinemas, setCinemas] = useState<any[]>([]);

  /* fetch movie */
  useEffect(() => {
    setLoadingMovie(true);
    fetch(`${TMDB}/movie/${id}?api_key=${KEY}&language=en-US`)
      .then(r => r.json())
      .then(setMovie)
      .finally(() => setLoadingMovie(false));
  }, [id]);

  /* mock times (replace with real API later) */
  useEffect(() => {
    setCinemas([
      {
        id: 1,
        name: "Pathé Californie",
        address: "Casablanca CT 1029 Aïn Chock",
        times: ["16:15", "18:00", "21:00"],
      },
    ]);
  }, [date, sort, genre, originals]);

  /* 7-day strip */
  const days = useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => {
      const d = new Date(date);
      d.setDate(date.getDate() - 4 + i);
      return d;
    });
  }, [date]);

  /* ─────────────── render ─────────────── */
  return (
    <>
      <SiteHeader />

      <div className="min-h-screen bg-[#141414] text-white">
        {/* Hero */}
        <section className="relative h-[55vh] sm:h-[65vh]">
          {loadingMovie ? (
            <div className="absolute inset-0 animate-pulse bg-white/10" />
          ) : (
            movie?.backdrop_path && (
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                fill
                priority
                className="object-cover"
              />
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/30" />

          {movie && (
            <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-12 space-y-5">
              <h1 className="text-4xl md:text-6xl font-extrabold uppercase leading-none">
                {movie.title}
              </h1>

              <p className="max-w-xl text-white/80 line-clamp-4">
                {movie.overview}
              </p>

              {/* ===== Reserve button */}
              <Link href={`/reservation?movieId=${movie.id}`}
                    className="inline-block rounded-full bg-[#E50914] px-6 py-3 text-lg font-semibold
                               hover:bg-[#bf0811] transition">
                 Réserver des billets 🎟️
              </Link>

              <button className="flex items-center gap-1 text-sm hover:text-[#E50914]">
                <Info size={16} /> Infos, vidéos & détails
              </button>
            </div>
          )}
        </section>

        {/* Date strip */}
        <div className="overflow-x-auto bg-black/60 backdrop-blur-md">
          <div className="flex min-w-max items-center gap-2 px-4 py-4">
            <Button variant="outline" size="icon"
                    className="bg-white/10 hover:bg-white/20"
                    onClick={() => setOpen(true)}>
              <Filter size={18} />
            </Button>

            <Button variant="outline" size="icon"
                    className="bg-white/10 hover:bg-white/20"
                    onClick={() => setDate(d => new Date(d.setDate(d.getDate() - 1)))}>
              <ChevronLeft size={18} />
            </Button>

            {days.map(d => {
              const active = d.toDateString() === date.toDateString();
              return (
                <button key={d.toDateString()} onClick={() => setDate(d)}
                  className={`w-24 shrink-0 rounded-lg px-3 py-2 text-center ${
                    active ? "bg-white text-black" : "bg-white/10 hover:bg-white/20"
                  }`}>
                  <span className="block text-[11px] uppercase">
                    {d.toLocaleDateString("fr-FR", { weekday: "short" })}
                  </span>
                  <span className="block text-xl font-bold leading-none">
                    {d.getDate()}
                  </span>
                  <span className="block text-[10px] uppercase">
                    {d.toLocaleDateString("fr-FR", { month: "short" })}
                  </span>
                </button>
              );
            })}

            <Button variant="outline" size="icon"
                    className="bg-white/10 hover:bg-white/20"
                    onClick={() => setDate(d => new Date(d.setDate(d.getDate() + 1)))}>
              <ChevronRight size={18} />
            </Button>

            <Button variant="outline" size="sm"
                    className="ml-2 bg-white/10 hover:bg-white/20">
              <CalIcon size={16} className="mr-2" /> Calendrier
            </Button>
          </div>
        </div>

        {/* Sort select */}
        <div className="mx-auto max-w-7xl flex justify-end px-4 md:px-10 py-6">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-40 rounded-popover bg-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-popover bg-white/10 backdrop-blur-md">
              {sortOptions.map(s => (
                <SelectItem key={s} value={s} className="text-white">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cinemas & times */}
        <div className="mx-auto max-w-7xl space-y-10 px-4 md:px-10 pb-20">
          {cinemas.map(c => (
            <div key={c.id}>
              <h2 className="text-xl font-bold flex items-center gap-1">
                {c.name} <span className="text-white/50">›</span>
              </h2>
              <p className="mb-4 text-sm text-white/60">{c.address}</p>

              <div className="flex flex-wrap gap-4">
                {c.times.map(t => (
                  <Link key={t}
                        href={`/reservation?movieId=${movie?.id}&time=${t}`}
                        className="h-20 w-24 rounded-card bg-white/10 hover:bg-[#E50914]
                                   flex items-center justify-center text-lg font-bold transition">
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile filter sheet */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-sm rounded-popover bg-white/10 backdrop-blur-xl border border-white/20">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <SlidersHorizontal size={16} /> Filters
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span>RWV Originals</span>
                <Switch checked={originals} onCheckedChange={setOriginals} />
              </div>

              <div className="space-y-2">
                <span className="text-sm text-white/70">Genre</span>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger className="rounded-popover bg-white/10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-popover bg-white/10 backdrop-blur-md">
                    {Object.keys(genreList).map(g => (
                      <SelectItem key={g} value={g} className="text-white">
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <SiteFooter />
    </>
  );
}
