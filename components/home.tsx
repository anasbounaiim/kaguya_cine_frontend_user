"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
}

const genreList: Record<string, number> = {
  Action: 28,
  Comedy: 35,
  Drama: 18,
  Horror: 27,
  "Science Fiction": 878,
};

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genreMovies, setGenreMovies] = useState<Record<string, Movie[]>>({});

  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=8099992c2241e752e151a9908acef357&language=en-US&page=1`
      );
      const data = await res.json();
      setMovies(data.results);
    }

    async function fetchByGenres() {
      const results: Record<string, Movie[]> = {};
      await Promise.all(
        Object.entries(genreList).map(async ([name, id]) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=8099992c2241e752e151a9908acef357&with_genres=${id}&language=en-US&page=1`
          );
          const data = await res.json();
          results[name] = data.results;
        })
      );
      setGenreMovies(results);
    }

    fetchMovies();
    fetchByGenres();
  }, []);

  const featured = movies.find((m) => m.backdrop_path) ?? movies[0];

  return (
    <div className="min-h-screen text-white p-6" style={{ backgroundColor: "#141414" }}>
      {/* Hero Section */}
      {featured && (
        <section className="relative h-[100vh] w-full overflow-hidden">
          <Image
            src={`https://image.tmdb.org/t/p/original${featured.backdrop_path}`}
            alt={featured.title}
            fill
            className="object-cover brightness-50"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-10 md:p-20 space-y-6 z-10">
            <h1 className="text-6xl font-black uppercase tracking-wide leading-tight">
              {featured.title}
            </h1>
            <p className="text-lg max-w-xl text-gray-300 backdrop-blur-sm">
              {featured.overview.slice(0, 220)}...
            </p>
            <div className="flex space-x-4 mt-4">
              <Button className="bg-[#E50914] hover:bg-red-700 text-white">Prendre un ticket 🎟️</Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black"
              >
                Voir la bande-annonce ▶
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Maintenant à l'affiche */}
      <section className="mt-12 px-6 md:px-12">
        <h2 className="text-3xl font-bold mb-6">Maintenant à l'affiche</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="relative min-w-[160px] bg-[#1c1c1c] p-2 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition"
            >
              <Image
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : "/images/default-poster.jpg"
                }
                alt={movie.title}
                width={160}
                height={240}
                className="rounded-md"
              />
              <h3 className="mt-2 text-sm font-semibold">{movie.title}</h3>
              <p className="text-xs text-gray-400">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Genre Sections */}
      {Object.entries(genreMovies).map(([genre, movies]) => (
        <section key={genre} className="mt-12 px-6 md:px-12">
          <h2 className="text-3xl font-bold mb-6">{genre}</h2>
          <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="relative min-w-[160px] bg-[#1c1c1c] p-2 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition"
              >
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : "/images/default-poster.jpg"
                  }
                  alt={movie.title}
                  width={160}
                  height={240}
                  className="rounded-md"
                />
                <h3 className="mt-2 text-sm font-semibold">{movie.title}</h3>
                <p className="text-xs text-gray-400">{movie.release_date}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
