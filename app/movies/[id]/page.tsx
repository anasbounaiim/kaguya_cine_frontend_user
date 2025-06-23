/* app/movies/[id]/page.tsx */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  Filter,
  SlidersHorizontal,
  Info,
  Play,
  Plus,
  ThumbsUp,
  Star,
  Clock,
  MapPin,
  Share2,
  Heart,
  Download,
  Users,
  Award,
  Volume2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ───────── config ───────── */
const TMDB = "https://api.themoviedb.org/3";
const KEY = "8099992c2241e752e151a9908acef357";

const sortOptions = ["New in cinema", "By newest", "By oldest", "A - Z"] as const;
const genreList: Record<string, number> = {
  "All genres": 0,
  Action: 28,
  Comedy: 35,
  Drama: 18,
  Horror: 27,
  "Science Fiction": 878,
};

/* ╭──────────────── Movie page ───────────────╮ */
export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();

  /* state */
  const [movie, setMovie] = useState<any | null>(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState("New in cinema");
  const [genre, setGenre] = useState("All genres");
  const [originals, setOriginals] = useState(false);

  /* demo show-times */
  const [cinemas, setCinemas] = useState<any[]>([]);

  /* fetch movie */
  useEffect(() => {
    setLoadingMovie(true);
    fetch(`${TMDB}/movie/${id}?api_key=${KEY}&language=en-US`)
      .then((r) => r.json())
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
        distance: "2.5 km",
        rating: 4.2,
        times: ["16:15", "18:00", "21:00"],
        formats: ["2D", "3D", "IMAX"],
        prices: { "2D": 45, "3D": 55, "IMAX": 75 }
      },
      {
        id: 2,
        name: "Megarama Casablanca",
        address: "Boulevard Moulay Youssef, Casablanca",
        distance: "4.8 km",
        rating: 4.5,
        times: ["15:30", "17:45", "20:15", "22:30"],
        formats: ["2D", "3D", "VIP"],
        prices: { "2D": 50, "3D": 60, "VIP": 120 }
      },
    ]);
  }, [date, sort, genre, originals]);

  /* 9-day strip centred on selected date */
  const days = useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => {
      const d = new Date(date);
      d.setDate(date.getDate() - 4 + i);
      return d;
    });
  }, [date]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatRating = (rating: number) => {
    return (rating / 2).toFixed(1); // Convert from 10-point to 5-point scale
  };

  /* ─────────────── render ─────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#1a1a1a] text-white">

{/* ───────── Enhanced Hero Section ───────── */}
<section className="relative mt-2 h-[100vh] sm:h-[85vh] overflow-hidden">
  {/* backdrop with enhanced overlay */}
  {loadingMovie ? (
    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-800 to-gray-700" />
  ) : (
    movie?.backdrop_path && (
      <>
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          priority
          className="object-cover scale-105 transition-transform duration-700"
        />
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/30" />
      </>
    )
  )}

  {/* Floating action buttons */}
  <div className="absolute right-6 top-6 flex flex-col gap-3 z-20">
    <Button
      variant="outline"
      size="icon"
      className="h-12 w-12 rounded-full bg-black/40 border-white/20 backdrop-blur-md hover:bg-black/60 hover:scale-110 transition-all duration-300"
    >
      <Share2 className="h-5 w-5" />
    </Button>
    <Button
      variant="outline"
      size="icon"
      onClick={() => setIsLiked(!isLiked)}
      className={`h-12 w-12 rounded-full border-white/20 backdrop-blur-md hover:scale-110 transition-all duration-300 ${
        isLiked ? 'bg-red-500/80 hover:bg-red-500' : 'bg-black/40 hover:bg-black/60'
      }`}
    >
      <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
    </Button>
  </div>

  {/* Enhanced play trailer button */}
  {movie && (
    <Link
      href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
        movie.title + " trailer",
      )}`}
      target="_blank"
      className="group absolute right-6 top-1/2 hidden -translate-y-1/2
                 xl:flex h-20 w-20 items-center justify-center
                 rounded-full bg-white/15 backdrop-blur-md hover:bg-red-500/80 
                 transition-all duration-300 hover:scale-110 border border-white/20"
    >
      <Play className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300 ml-1" />
      <span className="sr-only">Voir la bande-annonce</span>
    </Link>
  )}

  {/* Enhanced title stack */}
  {movie && (
    <div className="relative z-10 flex h-full flex-col justify-end gap-6 p-6 md:p-12">
      {/* Enhanced badges */}
      <div className="flex flex-wrap gap-3">
        <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 text-sm font-semibold rounded-full">
          Nouveau
        </Badge>
        {movie.vote_average >= 7 && (
          <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-4 py-2 text-sm font-semibold rounded-full">
            <Award className="h-4 w-4 mr-1" />
            Populaire
          </Badge>
        )}
      </div>

      {/* Enhanced title with animation */}
      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-black uppercase leading-none tracking-tight 
                       bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent
                       animate-fade-in-up">
          {movie.title}
        </h1>
        
        {/* Rating display */}
        <div className="flex items-center gap-6 text-lg">
          <div className="flex items-center gap-2">
            <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-2xl">{formatRating(movie.vote_average)}</span>
            <span className="text-white/60">/5</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Users className="h-5 w-5" />
            <span>{movie.vote_count?.toLocaleString()} votes</span>
          </div>
        </div>
      </div>

      {/* Enhanced meta information */}
      <div className="flex flex-wrap items-center gap-6 text-base">
        {movie.runtime && (
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Clock className="h-4 w-4" />
            <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min</span>
          </div>
        )}
        {movie.adult && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-full px-4 py-2">
            16+
          </div>
        )}
        {movie.genres?.slice(0, 3).map((g) => (
          <Badge key={g.id} variant="outline" className="border-white/30 bg-white/5 hover:bg-white/10">
            {g.name}
          </Badge>
        ))}
      </div>

      {/* Enhanced synopsis */}
      <p className="max-w-2xl text-lg text-white/90 leading-relaxed line-clamp-4 font-light">
        {movie.overview}
      </p>

      {/* Enhanced CTAs */}
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={`/reservation?movieId=${movie.id}`}
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 
                     hover:from-red-600 hover:to-red-700 px-8 py-4 text-lg font-bold 
                     transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25"
        >
          🎟️ Réserver des billets
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Button
          variant="outline"
          onClick={() => setIsInWatchlist(!isInWatchlist)}
          className={`rounded-full border-white/30 backdrop-blur-sm px-6 py-4 text-lg font-medium
                     transition-all duration-300 hover:scale-105 ${
                       isInWatchlist 
                         ? 'bg-white/20 border-white/50 text-white' 
                         : 'bg-white/5 hover:bg-white/15'
                     }`}
        >
          <Plus className={`mr-2 h-5 w-5 transition-transform ${isInWatchlist ? 'rotate-45' : ''}`} />
          {isInWatchlist ? 'Dans ma liste' : 'Ma liste'}
        </Button>

        <Button
          variant="outline"
          className="rounded-full border-white/30 bg-white/5 backdrop-blur-sm px-6 py-4
                     text-lg font-medium hover:bg-white/15 transition-all duration-300 hover:scale-105"
        >
          <Download className="mr-2 h-5 w-5" />
          Télécharger
        </Button>

        <button className="flex items-center gap-2 text-lg hover:text-red-400 transition-colors duration-300">
          <Info size={20} />
          Plus d'infos
        </button>
      </div>
    </div>
  )}
</section>

      {/* Enhanced Date Strip */}
      <div className="sticky top-0 z-30 overflow-x-auto bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex min-w-max items-center gap-3 px-6 py-5">
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 bg-white/10 hover:bg-white/20 border-white/20 rounded-xl backdrop-blur-sm"
            onClick={() => setOpen(true)}
          >
            <Filter size={20} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 bg-white/10 hover:bg-white/20 border-white/20 rounded-xl backdrop-blur-sm"
            onClick={() =>
              setDate((d) => new Date(d.setDate(d.getDate() - 1)))
            }
          >
            <ChevronLeft size={20} />
          </Button>

          {days.map((d) => {
            const active = d.toDateString() === date.toDateString();
            const today = isToday(d);
            return (
              <button
                key={d.toDateString()}
                onClick={() => setDate(d)}
                className={`relative w-28 shrink-0 rounded-2xl px-4 py-4 text-center transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 scale-105"
                    : "bg-white/10 hover:bg-white/20 hover:scale-102 backdrop-blur-sm"
                } ${today ? 'ring-2 ring-yellow-400/50' : ''}`}
              >
                {today && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full font-bold">
                    Aujourd'hui
                  </div>
                )}
                <span className="block text-xs uppercase font-semibold opacity-80">
                  {d.toLocaleDateString("fr-FR", { weekday: "short" })}
                </span>
                <span className="block text-2xl font-bold leading-none my-1">
                  {d.getDate()}
                </span>
                <span className="block text-xs uppercase font-medium opacity-70">
                  {d.toLocaleDateString("fr-FR", { month: "short" })}
                </span>
              </button>
            );
          })}

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 bg-white/10 hover:bg-white/20 border-white/20 rounded-xl backdrop-blur-sm"
            onClick={() =>
              setDate((d) => new Date(d.setDate(d.getDate() + 1)))
            }
          >
            <ChevronRight size={20} />
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="ml-4 h-12 bg-white/10 hover:bg-white/20 border-white/20 rounded-xl backdrop-blur-sm px-6"
          >
            <CalIcon size={18} className="mr-2" />
            Calendrier
          </Button>
        </div>
      </div>

      {/* Enhanced Sort Section */}
      <div className="mx-auto max-w-7xl flex justify-between items-center px-6 py-8 md:px-12">
        <div>
          <h2 className="text-2xl font-bold mb-2">Séances disponibles</h2>
          <p className="text-white/60">
            {date.toLocaleDateString("fr-FR", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })}
          </p>
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-48 h-12 rounded-xl bg-white/10 backdrop-blur-sm border-white/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-black/90 backdrop-blur-xl border-white/20">
            {sortOptions.map((s) => (
              <SelectItem key={s} value={s} className="text-white hover:bg-white/10">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Cinemas & Times */}
      <div className="mx-auto max-w-7xl space-y-8 px-6 pb-20 md:px-12">
        {cinemas.map((c) => (
          <div key={c.id} className="group bg-white/5 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 border border-white/10">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold">{c.name}</h3>
                  <div className="flex items-center gap-1 bg-yellow-400/20 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">{c.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/70">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{c.address}</span>
                  </div>
                  <span className="text-green-400 font-medium">{c.distance}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-white/30 bg-white/5 hover:bg-white/15"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Itinéraire
              </Button>
            </div>

            {/* Format tabs */}
            <div className="flex gap-2 mb-6">
              {c.formats.map((format) => (
                <Badge key={format} variant="outline" className="border-white/30 bg-white/5 hover:bg-white/10 px-4 py-2">
                  {format}
                  <span className="ml-2 text-green-400 font-bold">{c.prices[format]}DH</span>
                </Badge>
              ))}
            </div>

            {/* Enhanced time slots */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {c.times.map((t) => (
                <Link
                  key={t}
                  href={`/reservation?movieId=${movie?.id}&time=${t}&cinema=${c.id}`}
                  className="group/time relative h-24 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 
                             hover:from-red-500/80 hover:to-red-600/80 border border-white/20
                             flex flex-col items-center justify-center transition-all duration-300 
                             hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                >
                  <span className="text-xl font-bold group-hover/time:scale-110 transition-transform">
                    {t}
                  </span>
                  <span className="text-xs text-white/60 group-hover/time:text-white/80">
                    Disponible
                  </span>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full opacity-0 group-hover/time:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Filter Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-3xl bg-black/90 backdrop-blur-xl border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <SlidersHorizontal size={20} />
              Filtres et options
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-8 py-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
              <div className="space-y-1">
                <span className="font-medium">RWV Originals</span>
                <p className="text-sm text-white/60">Films exclusifs et originaux</p>
              </div>
              <Switch checked={originals} onCheckedChange={setOriginals} />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <span className="font-medium">Genre</span>
                <p className="text-sm text-white/60">Filtrer par catégorie</p>
              </div>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="h-12 rounded-2xl bg-white/10 backdrop-blur-sm border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl bg-black/90 backdrop-blur-xl border-white/20">
                  {Object.keys(genreList).map((g) => (
                    <SelectItem key={g} value={g} className="text-white hover:bg-white/10">
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={() => setOpen(false)}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-2xl h-12"
              >
                Appliquer les filtres
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setGenre("All genres");
                  setOriginals(false);
                }}
                className="px-6 rounded-2xl border-white/30 bg-white/5 hover:bg-white/15 h-12"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}