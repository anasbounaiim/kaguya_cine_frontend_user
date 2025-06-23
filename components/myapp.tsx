/* components/myapp.tsx */
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Globe } from "lucide-react";
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
  const [movies, setMovies]     = useState<Movie[]>([]);
  const [genreMovies, setGenre] = useState<Record<string, Movie[]>>({});
  const [screen, setScreen]     = useState<Screen>("home");

  /* helper: change section + scroll up (still used by logo) */
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

  return (
    <div className="flex min-h-screen flex-col bg-surface text-white">


      {/* ── Main ── */}
      <main className="flex-1">
        {screen === "home"        && <HomePage movies={movies} genreMovies={genreMovies} />}
        {screen === "films"       && <FilmsPage />}
        {screen === "reservation" && <Stub title="📝 Réservation" text="Réservez vos billets ici." />}
        {screen === "contact"     && <Stub title="📬 Contact"     text="Formulaire ou informations pour nous contacter." />}
      </main>
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
