/* components/home.tsx */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Plus, 
  Info, 
  Star, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Bookmark,
  Share2
} from "lucide-react";

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
  vote_average?: number;
  runtime?: number;
  genre_ids?: number[];
}

/* ───────────────────────────────────────── */
export default function HomePage({
  movies,
  genreMovies,
}: {
  movies: Movie[];
  genreMovies: Record<string, Movie[]>;
}) {
  /* enhanced hero carousel */
  const slides = movies.slice(0, 5);
  const [idx, setIdx] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % slides.length), 8000);
    return () => clearInterval(t);
  }, [slides.length, isAutoPlay]);

  const prev = () => {
    setIdx((p) => (p - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };
  
  const next = () => {
    setIdx((p) => (p + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const featured = slides[idx];

  return (
    <div className="bg-gradient-to-b from-black via-[#0a0a0a] to-[#141414] text-white">
      {/* ╭────────────── Enhanced Hero ──────────────╮ */}
    
<section className="relative h-[80vh] lg:h-[86vh] w-full overflow-hidden">

  {/* backdrop images */}
  {slides.map((m, i) => (
    <div key={m.id} className="absolute inset-0">
      <Image
        src={`https://image.tmdb.org/t/p/original${m.backdrop_path}`}
        alt={m.title}
        fill
        priority={i === 0}
        className={`object-cover transition-all duration-1000 ${
          i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
        }`}
      />

      {/* toned-down gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
    </div>
  ))}

  {/* content */}
  {featured && (
    <div className="absolute inset-0 flex items-center">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl space-y-6">

          {/* badges + title */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs md:text-sm">
              <span className="rounded-full bg-[#E50914] px-3 py-[2px] font-semibold">
                NOUVEAUTÉ
              </span>
              {featured.vote_average && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  {featured.vote_average.toFixed(1)}
                </span>
              )}
              {featured.release_date && (
                <span className="flex items-center gap-1 text-white/70">
                  <Calendar className="h-4 w-4" />
                  {new Date(featured.release_date).getFullYear()}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                {featured.title}
              </span>
            </h1>
          </div>

          {/* overview */}
          <p className="text-base md:text-lg leading-relaxed text-white/90 lg:max-w-xl line-clamp-4">
            {featured.overview}
          </p>

          {/* actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              size="default"
              className="bg-white text-black hover:bg-white/90 px-6 py-2 font-semibold"
            >
              <Play className="mr-2 h-4 w-4 fill-current" />
              Regarder
            </Button>

            <Button
              variant="outline"
              size="default"
              className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 px-6 py-2"
            >
              <Info className="mr-2 h-4 w-4" />
              Plus d&#39;infos
            </Button>

            {/* icon fabs */}
            {[
              { Icon: Plus, label: "Ajouter" },
              { Icon: Share2, label: "Partager" },
            ].map(({ Icon, label }) => (
              <Button
                key={label}
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full border border-white/30 bg-white/10 p-0 backdrop-blur-sm hover:bg-white/20"
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}

  {/* nav arrows */}
  <HeroArrow dir="left"  onClick={prev} />
  <HeroArrow dir="right" onClick={next} />

  {/* mute toggle */}
  <button
    onClick={() => setIsMuted(!isMuted)}
    className="absolute bottom-7 right-7 h-10 w-10 flex items-center justify-center rounded-full
               border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20"
  >
    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
  </button>

  {/* progress pills */}
  <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex gap-1.5">
    {slides.map((_, i) => (
      <button
        key={i}
        onClick={() => { setIdx(i); setIsAutoPlay(false); }}
        className={`h-[3px] w-8 rounded-full transition-all
                    ${i === idx ? "bg-[#E50914]" : "bg-white/30 hover:bg-white/50"}`}
      />
    ))}
  </div>

  {/* autoplay status */}
  <button
    onClick={() => setIsAutoPlay(!isAutoPlay)}
    className="absolute bottom-7 left-7 flex items-center gap-2 rounded-full bg-white/10
               px-4 py-1.5 text-xs backdrop-blur-sm hover:bg-white/20"
  >
    <span className={`h-2 w-2 rounded-full ${isAutoPlay ? "bg-green-400" : "bg-red-400"}`} />
    {isAutoPlay ? "Auto" : "Manuel"}
  </button>
</section>


      {/* ╭───────── Enhanced Movie Rails ─────────╮ */}
      <div className="space-y-12 py-16">
        <MovieRail 
          title="🔥 Tendances" 
          subtitle="Les films les plus populaires en ce moment"
          movies={movies.slice(0, 15)} 
          featured 
        />
        
        {Object.entries(genreMovies).map(([genre, list]) => (
          <MovieRail 
            key={genre} 
            title={genre} 
            subtitle={`Découvrez les meilleurs films de ${genre.toLowerCase()}`}
            movies={list} 
          />
        ))}
        
        <MovieRail 
          title="⭐ Coups de cœur" 
          subtitle="Sélectionnés spécialement pour vous"
          movies={movies.slice(10, 25)} 
        />
      </div>
    </div>
  );
}

/* ───────────────── Enhanced Components ───────────────── */

function HeroArrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  
  return (
    <button
      aria-label={dir === "left" ? "Slide précédent" : "Slide suivant"}
      onClick={onClick}
      className="group absolute top-1/2 z-10 hidden -translate-y-1/2 md:flex"
      style={{ [dir === "left" ? "left" : "right"]: "2rem" }}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110 group-hover:border-white/40">
        <Icon className="h-8 w-8 text-white" />
      </div>
    </button>
  );
}

function RailArrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  
  return (
    <button
      onClick={onClick}
      className="group absolute top-1/2 z-10 hidden -translate-y-1/2 md:flex"
      style={{ [dir === "left" ? "left" : "right"]: "-24px" }}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/80 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/90 group-hover:scale-110">
        <Icon className="h-6 w-6 text-white" />
      </div>
    </button>
  );
}

/* Enhanced Movie Rail */
function MovieRail({ 
  title, 
  subtitle, 
  movies, 
  featured = false 
}: { 
  title: string; 
  subtitle?: string;
  movies: Movie[]; 
  featured?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => track.current?.scrollBy({ 
    left: dir * (featured ? 400 : 320), 
    behavior: "smooth" 
  });

  return (
    <section className="relative mx-auto max-w-7xl px-6 md:px-10">
      {/* Section Header */}
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
        {subtitle && (
          <p className="text-lg text-white/70">{subtitle}</p>
        )}
      </div>

      {/* Movie Track */}
      <div
        ref={track}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-6 pr-6 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {movies.map((movie, index) => (
          <Link
            key={movie.id}
            href={`/movies/${movie.id}`}
            className="group relative flex-shrink-0 transition-all duration-300 hover:scale-105"
            style={{ 
              width: featured ? '300px' : '200px',
              aspectRatio: featured ? '16/9' : '2/3'
            }}
          >
            {/* Movie Poster/Backdrop */}
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <Image
                src={
                  (featured ? movie.backdrop_path : movie.poster_path)
                    ? `https://image.tmdb.org/t/p/w500${featured ? movie.backdrop_path : movie.poster_path}`
                    : "/images/default-poster.jpg"
                }
                alt={movie.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              {/* Rating Badge */}
              {movie.vote_average && (
                <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              )}

              {/* NEW Badge */}
              {index < 3 && (
                <span className="absolute left-3 top-3 rounded-full bg-[#E50914] px-2 py-1 text-xs font-semibold">
                  NEW
                </span>
              )}

              {/* Hover Actions */}
              <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="mb-2 text-sm font-semibold text-white line-clamp-2">
                  {movie.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 w-8 rounded-full bg-white p-0 text-black hover:bg-white/90"
                    >
                      <Play className="h-3 w-3 fill-current" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full border border-white/30 bg-white/10 p-0 text-white hover:bg-white/20"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full border border-white/30 bg-white/10 p-0 text-white hover:bg-white/20"
                    >
                      <Bookmark className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {movie.release_date && (
                    <span className="text-xs text-white/70">
                      {new Date(movie.release_date).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Title (Always Visible) */}
            {!featured && (
              <div className="mt-3 space-y-1">
                <h3 className="text-sm font-medium text-white/90 line-clamp-2 group-hover:text-white">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  {movie.release_date && (
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  )}
                  {movie.vote_average && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Navigation Arrows */}
      <RailArrow dir="left" onClick={() => scroll(-1)} />
      <RailArrow dir="right" onClick={() => scroll(1)} />
    </section>
  );
}