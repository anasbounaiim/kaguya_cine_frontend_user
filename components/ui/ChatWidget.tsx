"use client";

// ─── IMPORTS ──────────────────────────────────────────────────────────────
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  Send,
  Star,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Play,
  Plus,
  X,
  TrendingUp,
  Sparkles,
  ThumbsUp,
  Popcorn,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// ─── COLOR PALETTE & CONSTANTS ────────────────────────────────────────────
const NETFLIX_RED = "#E50914";
const NETFLIX_RED_LIGHT = "#FF2121";
const DEEP_BLACK = "#000000";
const DARK_GRAY = "#141414";
const MEDIUM_GRAY = "#232323";
const LIGHT_GRAY = "#B3B3B3";
const NEON_GLOW = `0 0 8px ${NETFLIX_RED_LIGHT}80, 0 0 16px ${NETFLIX_RED_LIGHT}40`;

// ─── TYPE DEFINITIONS ─────────────────────────────────────────────────────
type Msg = { role: "user" | "assistant"; content: React.ReactNode; id: string };
type Movie = {
  id: number;
  title: string;
  poster_path: string;
  tmdb_url: string;
  overview: string;
  director: string;
  main_cast: string[];
  runtime: number;
  release_date: string;
  genres: string[];
  vote_average: number;
  vote_count: number;
};

type ApiResponse = {
  movies: Movie[];
  assistant_message: string;
  mood: string;
  total_movies: number;
};

// ──────────────────────────────────────────────────────────────────────────
// ─── MOVIE CARD COMPONENT ────────────────────────────────────────────────
function MovieCard({
  movie,
  showReason = true,
  active,
  side,
  hidden,
  onClick,
}: {
  movie: Movie;
  showReason?: boolean;
  active?: boolean;
  side?: boolean;
  hidden?: boolean;
  onClick?: () => void;
}) {
  const reasons = [
    "Perfect for your mood",
    "Trending globally",
    "Curated for you",
    "Critics' favorite",
    "Audience choice",
    "Similar to your favorites",
  ];
  const match = Math.floor(Math.random() * 15) + 85;
  const reason = reasons[Math.floor(Math.random() * reasons.length)];

  let cardClass = "";
  if (active) cardClass = "scale-100 opacity-100 z-20 filter-none";
  else if (side) cardClass = "scale-90 opacity-70 z-10 grayscale";
  else if (hidden) cardClass = "scale-75 opacity-0 pointer-events-none z-0 grayscale";

  return (
    <motion.div
      className={cn(
        "w-[230px] h-[290px] transition-all duration-500 ease-out relative cursor-pointer group",
        cardClass
      )}
      style={{
        filter: active ? "none" : "grayscale(100%)",
        boxShadow: active ? `0 0 24px ${NETFLIX_RED}30, 0 8px 30px rgba(0,0,0,.5)` : "none",
      }}
      whileHover={active ? { scale: 1.025 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      onClick={onClick}
    >
      {/* Recommendation badge */}
      {showReason && active && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-3 left-3 right-3 z-30"
        >
          <div
            className="flex items-center justify-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-white shadow-lg border border-white/20"
            style={{
              background: `linear-gradient(135deg, ${NETFLIX_RED} 0%, ${NETFLIX_RED_LIGHT} 100%)`,
            }}
          >
            <TrendingUp className="w-3 h-3" />
            {reason}
          </div>
        </motion.div>
      )}

      {/* Main card */}
      <div
        className="relative h-full rounded-xl overflow-hidden group"
        style={{ backgroundColor: DARK_GRAY }}
      >
        {/* Movie poster */}
        <div className="absolute inset-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
            alt={movie.title + " poster"}
            fill
            priority={active}
            sizes="230px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>

        {/* Movie info and actions */}
        <div className="relative z-10 h-full flex flex-col justify-between p-3">
          <div className="flex items-start justify-between">
            <div
              className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-lg border border-white/20"
              style={{
                background: `linear-gradient(135deg, ${NETFLIX_RED} 0%, ${NETFLIX_RED_LIGHT} 100%)`,
              }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
              {match}% Match
            </div>
            <div
              className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white border border-white/20"
              style={{ backgroundColor: MEDIUM_GRAY }}
            >
              4K
            </div>
          </div>
          <div className="space-y-1 mt-1">
            <h3 className="text-base font-bold text-white leading-tight tracking-tight">
              {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-xs" style={{ color: LIGHT_GRAY }}>
              <span className="flex items-center gap-0.5">
                <Calendar className="w-3 h-3" />
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {movie.runtime}m
              </span>
              <span className="flex items-center gap-0.5 text-yellow-400">
                <Star className="w-3 h-3 fill-current" />
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: NETFLIX_RED_LIGHT,
                    color: NETFLIX_RED_LIGHT,
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
            <p className="text-xs line-clamp-2" style={{ color: LIGHT_GRAY }}>
              {movie.overview}
            </p>
            {active && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="flex gap-2 pt-1"
              >
                <a
                  href={movie.tmdb_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
                  style={{
                    background: `linear-gradient(135deg, ${NETFLIX_RED} 0%, ${NETFLIX_RED_LIGHT} 100%)`,
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <Play className="w-3 h-3 fill-current" />
                  Watch
                </a>
                <button
                  className="flex items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-bold transition hover:opacity-80 border"
                  style={{
                    backgroundColor: "transparent",
                    borderColor: NETFLIX_RED_LIGHT,
                    color: NETFLIX_RED_LIGHT,
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <Plus className="w-3 h-3" />
                  List
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ─── MOVIE DETAIL MODAL ──────────────────────────────────────────────────
function MovieDetailModal({ movie, onClose }: { movie: Movie; onClose: () => void }) {
  return (
    <div className="relative flex flex-col gap-0 md:gap-6 w-full p-4 md:p-8">
      <button 
        onClick={onClose} 
        className="absolute top-3 right-3 z-50 text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all hover:scale-110"
      >
        <X className="w-5 h-5" />
      </button>
      {/* Poster */}
      <div className="flex-shrink-0 w-full md:w-1/3 h-64 md:h-96 relative rounded-xl overflow-hidden shadow-lg border border-gray-800">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
          alt={movie.title + " poster"}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>
      {/* Movie info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">{movie.title}</h1>
          <div className="flex items-center gap-3 text-base mb-3">
            <span className="flex items-center gap-1 text-gray-400">
              <Calendar className="w-4 h-4" /> {new Date(movie.release_date).getFullYear()}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Clock className="w-4 h-4" /> {movie.runtime}m
            </span>
            <span className="flex items-center gap-1 text-yellow-400 font-semibold">
              <Star className="w-4 h-4 fill-current" /> {movie.vote_average.toFixed(1)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.genres.map((g) => (
              <span
                key={g}
                className="px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  borderColor: NETFLIX_RED_LIGHT,
                  color: NETFLIX_RED_LIGHT,
                }}
              >
                {g}
              </span>
            ))}
          </div>
          <p className="text-gray-200 text-base mb-4">{movie.overview}</p>
          <div className="text-sm mb-2">
            <span className="font-semibold">Director:</span>{" "}
            <span className="text-gray-300">{movie.director}</span>
          </div>
          <div className="text-sm mb-2">
            <span className="font-semibold">Main Cast:</span>{" "}
            <span className="text-gray-300">{movie.main_cast.join(", ")}</span>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <a
            href={movie.tmdb_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white font-bold text-base transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${NETFLIX_RED} 0%, ${NETFLIX_RED_LIGHT} 100%)`,
              boxShadow: NEON_GLOW,
            }}
          >
            <Play className="w-4 h-4" /> See on TMDB
          </a>
          <button
            className="flex items-center gap-2 rounded-lg px-4 py-2 border font-bold text-base transition-all hover:scale-105"
            style={{
              borderColor: NETFLIX_RED_LIGHT,
              color: NETFLIX_RED_LIGHT,
            }}
          >
            <Plus className="w-4 h-4" /> Add to list
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ─── MOVIE CAROUSEL (DECK) ───────────────────────────────────────────────
function DeckCarousel({ movies }: { movies: Movie[] }) {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [modalMovie, setModalMovie] = useState<Movie | null>(null);

  // Helper: Determine the position/style of each card
  const getCardProps = (i: number) => {
    const offset = i - index;
    if (offset === 0) return { active: true };
    if (Math.abs(offset) === 1) return { side: true };
    return { hidden: true };
  };

  // Helper: Transform/animation for card
  const getTransform = (i: number) => {
    const offset = i - index;
    if (offset === 0) return "translateX(0) scale(1)";
    if (offset === -1) return "translateX(-90%) scale(0.92)";
    if (offset === 1) return "translateX(90%) scale(0.92)";
    if (offset < -1) return "translateX(-110%) scale(0.78)";
    if (offset > 1) return "translateX(110%) scale(0.78)";
    return "translateX(0) scale(0.)";
  };

  // Carousel navigation
  const navigate = (direction: "prev" | "next") => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (direction === "prev") setIndex((i) => (i - 1 + movies.length) % movies.length);
    else setIndex((i) => (i + 1) % movies.length);

    setTimeout(() => setIsTransitioning(false), 350);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[310px] flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: "1000px" }}>
        {movies.map((movie, i) => {
          const props = getCardProps(i);
          return (
            <div
              key={movie.id}
              className="absolute transition-all duration-500"
              style={{
                transform: getTransform(i),
                transformStyle: "preserve-3d",
                width: "230px",
                height: "290px",
              }}
            >
              <MovieCard movie={movie} {...props} onClick={() => setModalMovie(movie)} />
            </div>
          );
        })}
      </div>
      {/* Carousel navigation arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={() => navigate("prev")}
            disabled={isTransitioning}
            aria-label="Previous movie"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full flex items-center justify-center text-white transition disabled:opacity-50 hover:scale-110 backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${NETFLIX_RED} 0%, ${NETFLIX_RED_LIGHT} 100%)`,
              boxShadow: NEON_GLOW,
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("next")}
            disabled={isTransitioning}
            aria-label="Next movie"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full flex items-center justify-center text-white transition disabled:opacity-50 hover:scale-110 backdrop-blur-sm"
            style={{
              background: `linear-gradient(135deg, ${NETFLIX_RED} 0%, ${NETFLIX_RED_LIGHT} 100%)`,
              boxShadow: NEON_GLOW,
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
      {/* Dots */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-30">
        {movies.map((_, i) => (
          <button
            key={i}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-200",
              i === index ? "scale-110" : "hover:scale-105"
            )}
            style={{
              backgroundColor: i === index ? NETFLIX_RED_LIGHT : LIGHT_GRAY + "60",
              boxShadow: i === index ? NEON_GLOW : "none",
            }}
            onClick={() => !isTransitioning && setIndex(i)}
            aria-label={`Go to movie ${i + 1}`}
          />
        ))}
      </div>
      {/* Movie Details Modal */}
      <Dialog open={!!modalMovie} onOpenChange={(open) => !open && setModalMovie(null)}>
        <DialogContent className="max-w-2xl bg-[#1A1A1A] text-white rounded-2xl p-0 overflow-hidden border border-gray-800">
          {modalMovie && <MovieDetailModal movie={modalMovie} onClose={() => setModalMovie(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ─── ASSISTANT MESSAGE (RESPONSE + CAROUSEL) ─────────────────────────────
function AssistantMessage({ data }: { data: ApiResponse }) {
  const movies = data.movies?.slice(0, 6) || [];

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-neutral-700 bg-gradient-to-br from-[#1C1C1C] to-[#101010] p-4 shadow-lg">
        <div className="prose prose-invert max-w-none text-white prose-p:text-gray-200 prose-strong:text-white prose-li:my-1 prose-ol:pl-5 prose-ol:list-decimal prose-ul:list-disc prose-p:leading-snug">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {data.assistant_message}
          </ReactMarkdown>
        </div>
      </div>
      {!!movies.length && <DeckCarousel movies={movies} />}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ─── MAIN CHAT WIDGET ────────────────────────────────────────────────────
export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [msgs]);

  // Send user message and fetch assistant response
  const send = async () => {
    if (!draft.trim()) return;
    const text = draft.trim();
    const newMsg: Msg = { role: "user", content: text, id: Date.now().toString() };
    setDraft("");
    setMsgs((m) => [...m, newMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:8088/api/movies/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiResponse = await res.json();
      setIsTyping(false);
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: <AssistantMessage data={data} />, id: Date.now().toString() },
      ]);
    } catch {
      setIsTyping(false);
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: (
            <div
              className="flex items-center gap-2 rounded-lg p-3 border"
              style={{
                backgroundColor: `${NETFLIX_RED}20`,
                borderColor: `${NETFLIX_RED}60`,
                color: NETFLIX_RED,
                fontSize: "13px",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: NETFLIX_RED }} />
              <span>Unable to connect. Please try again.</span>
            </div>
          ),
          id: Date.now().toString(),
        },
      ]);
    }
  };

  const welcome = msgs.length === 0;

  return (
    <>
      {/* Floating Button Launcher */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-lg group"
        style={{
          background: `linear-gradient(135deg, ${NETFLIX_RED} 0%, ${NETFLIX_RED_LIGHT} 100%)`,
          boxShadow: `0 6px 24px ${NETFLIX_RED}80`,
        }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="sr-only">Open Movie Companion</span>
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
      </motion.button>

      {/* Modal Chat Widget */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: "rgba(0,0,0,0.82)" }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-[90vw] h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-800"
              style={{
                background: `linear-gradient(135deg, ${DARK_GRAY} 0%, ${DEEP_BLACK} 100%)`,
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between p-5 border-b"
                style={{ borderColor: MEDIUM_GRAY }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${NETFLIX_RED} 0%, ${NETFLIX_RED_LIGHT} 100%)`,
                    }}
                    animate={{
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <Image
                      width={40}
                      height={40}
                      src="/KaguyaCine_logo.svg"
                      alt="KaguyaCiné Logo"
                      className="h-10 w-10 bg-[#E50914] rounded-md"
                    />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">KaguyaCiné Chat bot</h2>
                    <p className="text-xs" style={{ color: LIGHT_GRAY }}>AI-powered recommendations</p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-[#232323]/80 transition hover:scale-110"
                  style={{ backgroundColor: MEDIUM_GRAY }}
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Messages Area */}
              <div
                ref={scroller}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
              >
                {welcome ? (
                  <Welcome setDraft={setDraft} />
                ) : (
                  <>
                    {msgs.map((m) => (
                      <Bubble key={m.id} msg={m} />
                    ))}
                    {isTyping && <TypingIndicator />}
                  </>
                )}
              </div>
              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="p-4 border-t"
                style={{ borderColor: MEDIUM_GRAY }}
              >
                <div
                  className="flex items-center gap-2 rounded-xl border p-2"
                  style={{
                    backgroundColor: MEDIUM_GRAY,
                    borderColor: LIGHT_GRAY + "40",
                  }}
                >
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="What's your mood or a movie?"
                    className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || isTyping}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all",
                      !draft.trim() || isTyping
                        ? "opacity-40 bg-gray-600"
                        : "hover:scale-105 bg-gradient-to-br from-red-600 to-red-500"
                    )}
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// ─── BUBBLE, TYPING, AND WELCOME COMPONENTS ──────────────────────────────
function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={cn(
          "w-fit max-w-[70%] rounded-xl px-4 py-3 text-sm shadow-lg",
          isUser
            ? "rounded-br-md"
            : "rounded-bl-md border pt-4 pb-12"
        )}
        style={
          isUser
            ? {
                background: `linear-gradient(135deg, ${NETFLIX_RED} 0%, ${NETFLIX_RED_LIGHT} 100%)`,
                boxShadow: NEON_GLOW,
              }
            : {
                backgroundColor: MEDIUM_GRAY,
                borderColor: LIGHT_GRAY + "30",
              }
        }
      >
        {msg.content}
        {isUser && (
          <div className="flex justify-end mt-1">
            <ThumbsUp className="w-3 h-3 text-white/60 hover:text-white cursor-pointer" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="rounded-xl rounded-bl-md px-4 py-3 border"
        style={{
          backgroundColor: MEDIUM_GRAY,
          borderColor: LIGHT_GRAY + "30",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  background: `linear-gradient(135deg, ${NETFLIX_RED} 0%, ${NETFLIX_RED_LIGHT} 100%)`,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: LIGHT_GRAY }}>
            Looking for great films...
          </span>
        </div>
      </div>
    </div>
  );
}

// Welcome screen with prompt suggestions
function Welcome({ setDraft }: { setDraft: (d: string) => void }) {
  const suggestions = [
    {
      title: "Action & Adventure",
      description: "Edge-of-your-seat movies",
      emoji: "⚡",
      query: "Best new action adventure movies",
    },
    {
      title: "Comedy Night",
      description: "Laugh with friends",
      emoji: "😂",
      query: "funny comedies for tonight",
    },
    {
      title: "Romantic Picks",
      description: "Love and feels",
      emoji: "💖",
      query: "top romantic comedies",
    },
    {
      title: "Sci-Fi Thrillers",
      description: "Mind-bending stories",
      emoji: "👽",
      query: "best sci-fi thrillers",
    },
    {
      title: "Family Favorites",
      description: "For all ages",
      emoji: "👨‍👩‍👧‍👦",
      query: "great family movies",
    },
    {
      title: "Hidden Gems",
      description: "Underrated picks",
      emoji: "💎",
      query: "underrated movies worth watching",
    },
  ];
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[230px] space-y-6 text-center">
      <div className="space-y-2">
        <motion.div
          className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto text-white text-xl font-bold shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${NETFLIX_RED} 0%, ${NETFLIX_RED_LIGHT} 100%)`,
            boxShadow: NEON_GLOW,
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <Popcorn className="w-6 h-6" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          What do you want to watch?
        </h2>
        <p className="max-w-md text-base" style={{ color: LIGHT_GRAY }}>
          Tell me a mood or a movie, I&#39;ll do the rest.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-3xl">
        {suggestions.map((suggestion) => (
          <motion.button
            key={suggestion.title}
            onClick={() => setDraft(suggestion.query)}
            className="p-4 rounded-xl border text-center group hover:scale-105 transition-all"
            style={{
              backgroundColor: MEDIUM_GRAY,
              borderColor: "#262626",
              color: "white",
            }}
            whileHover={{
              borderColor: NETFLIX_RED_LIGHT,
              boxShadow: NEON_GLOW,
            }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="text-2xl mb-2">{suggestion.emoji}</div>
            <h3 className="font-bold text-base mb-0.5 group-hover:text-[#FF2121] transition-colors">
              {suggestion.title}
            </h3>
            <p className="text-xs text-gray-400">{suggestion.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
