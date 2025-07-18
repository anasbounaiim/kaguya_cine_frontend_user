"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Grid3X3,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import apiCatalog from "@/utils/catalogApiFetch";

interface Movie {
  movieId: number;
  title: string;
  posterUrl: string;
  releaseDate: string;
  voteAverage?: number;
  overview?: string;
}

const PER_PAGE = 10;

export default function Films() {
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await apiCatalog.get(
          `/api/movies?page=${page - 1}&size=${PER_PAGE}&sortBy=releaseDate&direction=desc`
        );


        if (!cancelled) {
          setMovies(res.content);
          setTotalPages(res.totalPages);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch movies", err);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const skeletons = useMemo<undefined[]>(() => Array.from({ length: PER_PAGE }), []);

  return (
    <div>
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#E50914]/10 via-transparent to-[#E50914]/5">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
        <section className="relative mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                🎬 <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">Available</span>
                <br />
                <span className="bg-gradient-to-r from-[#E50914] to-[#bf0811] bg-clip-text text-transparent">Movies</span>
              </h1>
              <p className="max-w-2xl text-lg text-white/70 leading-relaxed">
                Explore all the movies available in our cinema system. Updated regularly from our internal catalog.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-white/20 bg-white/5 hover:bg-white/10">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <div className="flex rounded-lg border border-white/20 bg-white/5 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`h-8 w-8 p-0 ${
                    viewMode === "grid"
                      ? "bg-[#E50914] text-white hover:bg-[#E50914]"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`h-8 w-8 p-0 ${
                    viewMode === "list"
                      ? "bg-[#E50914] text-white hover:bg-[#E50914]"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Movies Section */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="mb-8 flex items-center justify-between text-sm text-white/60">
          <span>Showing {movies.length} movies</span>
          <span>Page {page} of {totalPages}</span>
        </div>

        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              : "grid-cols-1 gap-4"
          }`}
        >
          {(loading ? skeletons : movies).map((m, i) =>
            loading ? (
              <SkeletonCard key={i} viewMode={viewMode} />
            ) : (
              <MovieCard key={(m as Movie).movieId} movie={m as Movie} viewMode={viewMode} />
            )
          )}
        </div>

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
            Page {page} of {totalPages}
          </div>
        </div>
      </section>
    </div>
  );
}

function MovieCard({ movie, viewMode }: { movie: Movie; viewMode: "grid" | "list" }) {
  const year = new Date(movie.releaseDate).getFullYear();

  if (viewMode === "list") {
    return (
      <Link href={`/movies/${movie.movieId}`} className="block group">
        <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]">
          <div className="relative overflow-hidden rounded-xl shadow-lg flex-shrink-0">
            <Image
              src={movie.posterUrl}
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
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{year}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/movies/${movie.movieId}`} className="block group">
      <div className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#E50914]/20">
        <Image
          src={movie.posterUrl}
          alt={movie.title}
          width={400}
          height={600}
          className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="p-3 bg-[#1a1a1a] border-t border-white/10">
          <p className="text-sm font-medium truncate group-hover:text-[#E50914] transition-colors">
            {movie.title}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-white/60">{year}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard({ viewMode }: { viewMode: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="h-20 w-20 animate-pulse rounded-xl bg-white/10 flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/4 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
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
