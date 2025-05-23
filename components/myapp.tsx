"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import HomePage from "./home"; // ✅ Correct import path

interface Movie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date: string;
}

type Screen = "home" | "films" | "reservation" | "contact";

export default function CinematicHome() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [screen, setScreen] = useState<Screen>("home");
  const [genreMovies, setGenreMovies] = useState<Record<string, Movie[]>>({});

  const genreList = {
    Action: 28,
    Comedy: 35,
    Drama: 18,
    Horror: 27,
    "Science Fiction": 878,
  };

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
    <div className="bg-[#0D0D0D] text-white min-h-screen">
      <header className="border-b border-[#1f1f1f]">
        <div className="flex items-center justify-between md:px-12 py-4">
          <div className="text-2xl font-bold text-white cursor-pointer" onClick={() => setScreen("home")}>
            🎬 KaguyaCiné
          </div>
          <NavigationMenu>
            <NavigationMenuList className="gap-6 text-white">
              {["home", "films", "reservation", "contact"].map((tab) => (
                <NavigationMenuItem key={tab}>
                  <NavigationMenuLink asChild>
                    <span
                      onClick={() => setScreen(tab as Screen)}
                      className="cursor-pointer hover:text-[#E50914] transition"
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <Button className="bg-[#E50914] hover:bg-red-700 text-white">Connexion</Button>
        </div>
      </header>

      {/* ✅ Delegated HomePage */}
      {screen === "home" && featured && (
        <HomePage featured={featured} movies={movies} genreMovies={genreMovies} />
      )}

      {screen === "films" && (
        <main className="p-6 md:p-12">
          <h1 className="text-4xl font-bold mb-4">🎥 Films</h1>
          <p>Liste des films à venir ou actuellement au cinéma.</p>
        </main>
      )}

      {screen === "reservation" && (
        <main className="p-6 md:p-12">
          <h1 className="text-4xl font-bold mb-4">📝 Réservation</h1>
          <p>Réservez vos billets ici.</p>
        </main>
      )}

      {screen === "contact" && (
        <main className="p-6 md:p-12">
          <h1 className="text-4xl font-bold mb-4">📬 Contact</h1>
          <p>Formulaire ou informations pour nous contacter.</p>
        </main>
      )}
    </div>
  );
}
