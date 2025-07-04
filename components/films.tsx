/* components/films.tsx */
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link  from "next/link";
import { Button } from "@/components/ui/button";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
}

/* ─── config ─── */
const KEY        = "8099992c2241e752e151a9908acef357";
const MAX_PAGES  = 10;      // hard-cap 10 TMDB pages => 200 items max
const PER_PAGE   = 20;      // what we show in one grid

/* ─── Films page ─── */
export default function FilmsPage() {
  const [page, setPage]          = useState(1);
  const [movies, setMovies]      = useState<Movie[]>([]);
  const [totalPages, setTPages]  = useState(1);
  const [loading, setLoading]    = useState(true);

  /* fetch “popular” & keep only movies with poster_path */
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);

      const collected: Movie[] = [];
      let apiPage = page;
      while (collected.length < PER_PAGE && apiPage <= MAX_PAGES) {
        const url = `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=en-US&page=${apiPage}`;
        const res = await fetch(url).then(r => r.json());
        const withPoster = (res.results as Movie[]).filter(m => m.poster_path);
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
    return () => { cancelled = true; };
  }, [page]);

  const skeletons = useMemo(() => Array.from({ length: 10 }), []);

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <section className="mx-auto max-w-7xl p-6 md:p-10">
        <h1 className="mb-8 text-3xl font-bold">🎞️ Most Popular Movies</h1>

        {/* grid */}
        <div className="grid auto-rows-max gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          {(loading ? skeletons : movies).map((m, i) =>
            loading ? <SkeletonCard key={i} /> : <MovieCard key={(m as Movie).id} movie={m as Movie} />
          )}
        </div>

        {/* pagination */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 hover:bg-white/20"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <span className="text-sm">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 hover:bg-white/20"
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </section>
    </div>
  );
}

/* ─── card components ─── */
function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movies/${movie.id}`} className="block">
      <div className="relative overflow-hidden rounded-card shadow-md shadow-black/50 transition hover:scale-[1.03]">
        <Image
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
          width={300}
          height={450}
          sizes="(max-width:640px) 50vw,
                 (max-width:1024px) 33vw,
                 20vw"
          placeholder="blur"
          blurDataURL="/blur-10px.png"
          className="aspect-[2/3] w-full object-cover"
        />
        <p className="mt-2 truncate px-1 text-sm">{movie.title}</p>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="aspect-[2/3] w-full animate-pulse rounded-card bg-white/10" />
  );
}
