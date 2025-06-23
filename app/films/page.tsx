/* components/films.tsx */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Calendar, ChevronLeft, ChevronRight, Filter, Grid3X3, List } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average?: number;
  overview?: string;
}

/* ─── config ─── */
const KEY = "8099992c2241e752e151a9908acef357";
const MAX_PAGES = 10; // hard-cap 10 TMDB pages => 200 items max
const PER_PAGE = 20; // what we show in one grid

/* ─── Films page ─── */
export default function FilmsPage() {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  /* fetch "popular" & keep only movies with poster_path */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const wantedStart = (page - 1) * PER_PAGE;
      const wantedEnd = wantedStart + PER_PAGE;

      const collected: Movie[] = [];
      let apiPage = page; // start at same index
      while (collected.length < PER_PAGE && apiPage <= MAX_PAGES) {
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=en-US&page=${apiPage}`;
        const res = await fetch(url).then((r) => r.json());
        const withPoster = (res.results as Movie[]).filter((m) => m.poster_path);
        collected.push(...withPoster);
        apiPage++;
      }
      if (!cancelled) {
        setMovies(collected.slice(0, PER_PAGE));
        setTPages(MAX_PAGES);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const skeletons = useMemo(() => Array.from({ length: 20 }), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#1a1a1a] text-white">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#E50914]/10 via-transparent to-[#E50914]/5">
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
               backgroundSize: '20px 20px'
             }} />
        <section className="relative mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                🎬 <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">Popular</span>
                <br />
                <span className="bg-gradient-to-r from-[#E50914] to-[#bf0811] bg-clip-text text-transparent">Movies</span>
              </h1>
              <p className="max-w-2xl text-lg text-white/70 leading-relaxed">
                Discover the most popular movies right now. From blockbusters to hidden gems,
                find your next favorite film.
              </p>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/5 hover:bg-white/10"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <div className="flex rounded-lg border border-white/20 bg-white/5 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-8 w-8 p-0 ${
                    viewMode === 'grid' 
                      ? 'bg-[#E50914] text-white hover:bg-[#E50914]' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-8 w-8 p-0 ${
                    viewMode === 'list' 
                      ? 'bg-[#E50914] text-white hover:bg-[#E50914]' 
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Movies Grid/List */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Stats Bar */}
        <div className="mb-8 flex items-center justify-between text-sm text-white/60">
          <span>Showing {movies.length} movies</span>
          <span>Page {page} of {totalPages}</span>
        </div>

        {/* Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
            : 'grid-cols-1 gap-4'
        }`}>
          {(loading ? skeletons : movies).map((m, i) =>
            loading ? (
              <SkeletonCard key={i} viewMode={viewMode} />
            ) : (
              <MovieCard key={(m as Movie).id} movie={m as Movie} viewMode={viewMode} />
            )
          )}
        </div>

        {/* Enhanced Pagination */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-30"
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "ghost"}
                    size="sm"
                    className={
                      page === pageNum
                        ? "bg-[#E50914] hover:bg-[#bf0811]"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="lg"
              className="border-white/20 bg-white/5 hover:bg-white/10 disabled:opacity-30"
              disabled={page === totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="text-center text-sm text-white/50">
            Page {page} of {totalPages} • {PER_PAGE * totalPages} total movies
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── card components ─── */
function MovieCard({ movie, viewMode }: { movie: Movie; viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <Link href={`/movies/${movie.id}`} className="block group">
        <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]">
          <div className="relative overflow-hidden rounded-xl shadow-lg flex-shrink-0">
            <Image
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              width={80}
              height={120}
              className="aspect-[2/3] w-20 object-cover"
            />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold group-hover:text-[#E50914] transition-colors">
              {movie.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-white/60">
              {movie.vote_average && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
              )}
              {movie.release_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              )}
            </div>
            {movie.overview && (
              <p className="text-sm text-white/70 line-clamp-2">{movie.overview}</p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/movies/${movie.id}`} className="block group">
      <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#E50914]/20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <Image
            src={`https://image.tmdb.org/t/p/w400${movie.poster_path}`}
            alt={movie.title}
            width={400}
            height={600}
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, (max-width:1280px) 25vw, 20vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Rating Badge */}
          {movie.vote_average && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium backdrop-blur-sm">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          )}

          {/* Title and Year */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <h3 className="font-semibold text-white text-sm leading-tight mb-1">
              {movie.title}
            </h3>
            {movie.release_date && (
              <p className="text-xs text-white/70">
                {new Date(movie.release_date).getFullYear()}
              </p>
            )}
          </div>
        </div>
        
        {/* Static Title (visible by default) */}
        <div className="p-3 bg-[#1a1a1a] border-t border-white/10">
          <p className="text-sm font-medium truncate group-hover:text-[#E50914] transition-colors">
            {movie.title}
          </p>
          <div className="flex items-center justify-between mt-1">
            {movie.release_date && (
              <span className="text-xs text-white/60">
                {new Date(movie.release_date).getFullYear()}
              </span>
            )}
            {movie.vote_average && (
              <div className="flex items-center gap-1 text-xs text-white/60">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard({ viewMode }: { viewMode: 'grid' | 'list' }) {
  if (viewMode === 'list') {
    return (
      <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="h-20 w-20 animate-pulse rounded-xl bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
          <div className="h-3 w-full animate-pulse rounded bg-white/10" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-[2/3] w-full animate-pulse rounded-2xl bg-white/10" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-white/10" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
      </div>
    </div>
  );
}