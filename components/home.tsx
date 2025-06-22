/* components/home.tsx */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link  from "next/link";           // ← NEW
import { Button } from "@/components/ui/button";

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
}

/* ───────────────────────────────────────── */
export default function HomePage({
  movies,
  genreMovies,
}: {
  movies: Movie[];
  genreMovies: Record<string, Movie[]>;
}) {
  /* tiny hero carousel */
  const slides = movies.slice(0, 5);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [slides.length]);

  const prev = () => setIdx((p) => (p - 1 + slides.length) % slides.length);
  const next = () => setIdx((p) => (p + 1) % slides.length);

  const featured = slides[idx];

  return (
    <div className="pb-20 bg-black text-white">
      {/* ╭────────────── Hero ──────────────╮ */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        {slides.map((m, i) => (
          <Image
            key={m.id}
            src={`https://image.tmdb.org/t/p/original${m.backdrop_path}`}
            alt={m.title}
            fill
            priority={i === 0}
            className={`absolute inset-0 object-cover transition-opacity duration-700 ${
              i === idx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        {featured && (
          <div className="absolute left-8 top-1/2 -translate-y-1/2 w-[min(100%,700px)] space-y-8 rounded-2xl px-10 py-12 bg-gradient-to-br from-white/10 via-black/70 to-black/40 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.65)]">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
              {featured.title}
            </h1>
            <p className="text-lg text-gray-200/90 line-clamp-3">
              {featured.overview}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-[#E50914] hover:bg-[#bf0811] px-6">
                Prendre un ticket 🎟️
              </Button>
              <Button
                variant="outline"
                className="border-white bg-white/10 text-white hover:bg-white hover:text-black px-6"
              >
                Bande-annonce ▶
              </Button>
            </div>
          </div>
        )}

        <HeroArrow dir="left"  onClick={prev} />
        <HeroArrow dir="right" onClick={next} />

        <div className="absolute bottom-8 left-8 right-8 flex gap-2">
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                i === idx ? "bg-[#E50914]" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ╭───────── Poster rails ─────────╮ */}
      <MovieRail title="Maintenant à l'affiche" movies={movies} />
      {Object.entries(genreMovies).map(([g, list]) => (
        <MovieRail key={g} title={g} movies={list} />
      ))}
    </div>
  );
}

/* ───────────────── helpers ───────────────── */

function HeroArrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      aria-label={dir === "left" ? "Slide previous" : "Slide next"}
      onClick={onClick}
      className="hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/20 hover:bg-white/40 text-black text-2xl backdrop-blur-sm transition"
      style={{ [dir === "left" ? "left" : "right"]: "1rem" }}
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  );
}

function RailArrow({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/70 hover:bg-black/90 text-white text-xl"
      style={{ [dir === "left" ? "left" : "right"]: "-18px" }}
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  );
}

/* poster rail */
function MovieRail({ title, movies }: { title: string; movies: Movie[] }) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section className="relative mx-auto mt-14 max-w-7xl px-4 md:px-10">
      <h2 className="mb-6 text-3xl font-bold">{title}</h2>

      <div
        ref={track}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 pr-6"
      >
        {movies.map((m) => (
          <Link
            key={m.id}
            href={`/movies/${m.id}`}          /* ← CLICKABLE */
            className="relative w-40 flex-shrink-0 snap-start hover:scale-105 transition-transform"
            style={{ aspectRatio: "2/3" }}
          >
            <Image
              src={
                m.poster_path
                  ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                  : "/images/default-poster.jpg"
              }
              alt={m.title}
              fill
              className="rounded-lg object-cover"
            />
            <span className="absolute left-2 top-2 rounded-md bg-[#E50914] px-2 py-0.5 text-xs font-semibold">
              NEW
            </span>
          </Link>
        ))}
      </div>

      <RailArrow dir="left"  onClick={() => scroll(-1)} />
      <RailArrow dir="right" onClick={() => scroll(1)} />
    </section>
  );
}
