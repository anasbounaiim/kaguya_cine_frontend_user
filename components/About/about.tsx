"use client";

import { Button } from "@/components/ui/button";
import { Film, Users, Star, Sparkles, Play, Heart, ArrowRight, Quote } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const coreValues = [
    {
      icon: <Sparkles className="w-8 h-8 text-[#E50914]" />,
      title: "Curation",
      description:
        "Handpicked collections that celebrate cinema's diversity, from timeless classics to indie gems.",
      highlight: "10K+ Movies",
    },
    {
      icon: <Star className="w-8 h-8 text-[#E50914]" />,
      title: "Simplicity",
      description:
        "A clean, intuitive interface designed to make browsing and booking effortless.",
      highlight: "4.8★ Rating",
    },
    {
      icon: <Users className="w-8 h-8 text-[#E50914]" />,
      title: "Community",
      description:
        "A space where film lovers can discover, rate, and share their favorite stories.",
      highlight: "50K+ Users",
    },
  ];

  const stats = [
    { number: "10K+", label: "Movies", subtext: "Carefully curated" },
    { number: "50K+", label: "Users", subtext: "Active community" },
    { number: "4.8", label: "Rating", subtext: "User satisfaction" },
    { number: "100+", label: "Countries", subtext: "Global reach" },
  ];

  const testimonials = [
    {
      quote: "KaguyaCiné has completely transformed how I discover movies. The curation is phenomenal!",
      author: "Sarah M.",
      role: "Film Enthusiast"
    },
    {
      quote: "Finally, a platform that understands what movie lovers actually want.",
      author: "David L.",
      role: "Cinema Critic"
    }
  ];

  return (
    <main className="bg-black text-white overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#E50914] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-[#E50914] rounded-full opacity-15 animate-pulse delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-25 animate-pulse delay-3000"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-[#E50914] rounded-full opacity-10 animate-pulse delay-4000"></div>
        <div className="absolute bottom-40 right-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-40 animate-pulse delay-5000"></div>
        <div className="absolute top-80 right-10 w-1.5 h-1.5 bg-[#E50914] rounded-full opacity-25 animate-pulse delay-1500"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-r from-[#E50914]/10 to-red-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-gradient-to-l from-[#E50914]/8 to-red-400/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl animate-pulse delay-3000"></div>
        
        {/* Animated Lines */}
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E50914]/20 to-transparent opacity-30">
          <div className="w-20 h-px bg-gradient-to-r from-[#E50914]/40 to-transparent animate-pulse"></div>
        </div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/10 to-transparent opacity-20">
          <div className="w-32 h-px bg-gradient-to-l from-white/30 to-transparent animate-pulse delay-1000"></div>
        </div>
        
        {/* Floating Geometric Shapes */}
        <div className="absolute top-16 right-1/4 w-4 h-4 border border-[#E50914]/20 rotate-45 animate-pulse opacity-30"></div>
        <div className="absolute bottom-20 left-1/5 w-6 h-6 border border-white/15 rotate-12 animate-pulse delay-2000 opacity-25"></div>
        <div className="absolute top-1/2 right-1/5 w-3 h-3 bg-gradient-to-br from-[#E50914]/20 to-transparent rotate-45 animate-pulse delay-4000"></div>
        
        {/* Cinema Film Strip Effect */}
        <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-b from-transparent via-[#E50914]/5 to-transparent opacity-20">
          <div className="w-full space-y-8 pt-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-[#E50914]/10 mx-auto rounded-sm animate-pulse" style={{animationDelay: `${i * 0.5}s`}}></div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-b from-transparent via-white/3 to-transparent opacity-15">
          <div className="w-full space-y-10 pt-12">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-white/5 mx-auto rounded-sm animate-pulse" style={{animationDelay: `${i * 0.7}s`}}></div>
            ))}
          </div>
        </div>
        
        {/* Moving Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(229, 9, 20, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(229, 9, 20, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'moveGrid 20s linear infinite'
          }}></div>
        </div>
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>
      
      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes moveGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto text-center py-24 px-4">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className={`relative transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <Image
                    width={112}
                    height={112}
                    src="/KaguyaCine_logo.svg"
                    alt="KaguyaCiné Logo"
                    className="w-28 h-28 bg-[#E50914] animate-pulse rounded-2xl"
                />
              <div className="absolute -inset-2 bg-[#E50914]/20 rounded-full blur-md"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            About{" "}
            <span className="text-[#E50914] relative">
              KaguyaCiné
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] to-red-400 rounded-full"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#B3B3B3] mb-8 max-w-3xl mx-auto leading-relaxed">
            A modern platform redefining how you discover, watch, and share the movies you love.
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#E50914]"></div>
            <p className="text-[#B3B3B3] px-4">Where cinema meets community in perfect harmony</p>
            <Sparkles className="w-5 h-5 text-[#E50914]" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#E50914]"></div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              asChild
              className="bg-gradient-to-r from-[#E50914] to-red-600 hover:from-red-700 hover:to-red-800 px-8 py-4 rounded-full text-lg font-semibold shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/40"
            >
              <a href="/films" className="flex items-center gap-3">
                <Play className="w-5 h-5" /> Explore Catalog
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-[#333] text-white hover:bg-[#222] hover:border-[#E50914] px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <a href="/contact" className="flex items-center gap-3">
                <Heart className="w-5 h-5" /> Contact Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 px-4 border-t border-[#222] bg-gradient-to-b from-transparent to-zinc-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E50914] to-red-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="relative p-6 rounded-2xl border border-[#222] hover:border-[#E50914]/50 transition-all duration-300 bg-gradient-to-br from-zinc-900/50 to-transparent">
                  <div className="text-4xl md:text-5xl font-bold text-[#E50914] mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-sm text-white uppercase tracking-wide font-semibold mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-[#B3B3B3]">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Core Values */}
      <section className="py-24 px-4 bg-gradient-to-b from-zinc-900/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Core Values</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E50914] to-red-400 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-[#B3B3B3] max-w-3xl mx-auto leading-relaxed">
              We&#39;re committed to delivering an experience that inspires, connects, and delights every movie enthusiast.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((item, idx) => (
              <div
                key={idx}
                className="group relative border border-[#222] p-8 rounded-2xl text-center hover:border-[#E50914]/50 transition-all duration-500 bg-gradient-to-br from-zinc-900/30 to-transparent hover:from-zinc-900/50 hover:to-red-900/10 hover:scale-105"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 rounded-full bg-gradient-to-br from-[#E50914]/20 to-red-600/20 group-hover:from-[#E50914]/30 group-hover:to-red-600/30 transition-all duration-300">
                      {item.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-[#E50914] transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-[#B3B3B3] mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-[#E50914]/20 to-red-600/20 rounded-full text-sm font-semibold text-[#E50914] border border-[#E50914]/30">
                    {item.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 border-t border-[#222]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What People Say</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E50914] to-red-400 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx}
                className="relative p-8 border border-[#222] rounded-2xl bg-gradient-to-br from-zinc-900/30 to-transparent hover:border-[#E50914]/30 transition-all duration-300"
              >
                <Quote className="w-8 h-8 text-[#E50914] mb-4 opacity-60" />
                <p className="text-lg text-[#B3B3B3] mb-6 italic leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E50914] to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-[#B3B3B3]">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Mission Section */}
      <section className="py-24 px-4 border-t border-[#222] bg-gradient-to-b from-transparent to-zinc-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Our Mission</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E50914] to-red-400 mx-auto rounded-full mb-8"></div>
            
            <div className="space-y-6 text-lg">
              <p className="text-[#B3B3B3] leading-relaxed">
                KaguyaCiné was created by passionate film enthusiasts dedicated to bridging the gap between audiences and the stories that inspire them.
              </p>
              <p className="text-white leading-relaxed">
                Our mission is to make cinema more accessible, engaging, and unforgettable for everyone—because every great story deserves to be discovered.
              </p>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#E50914]"></div>
              <Film className="w-6 h-6 text-[#E50914]" />
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#E50914]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative border border-[#222] p-12 rounded-3xl bg-gradient-to-br from-zinc-900/50 to-red-900/10 hover:border-[#E50914]/50 transition-all duration-500 group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Join Our Community Today
              </h2>
              <p className="text-xl text-[#B3B3B3] mb-8 leading-relaxed max-w-2xl mx-auto">
                Discover your next favorite film and connect with fellow movie enthusiasts from around the world.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#E50914] to-red-600 hover:from-red-700 hover:to-red-800 px-8 py-4 rounded-full text-lg font-semibold shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/40"
                >
                  <a href="/register" className="flex items-center gap-3">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
                
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-[#333] text-white hover:bg-[#222] hover:border-[#E50914] px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                >
                  <a href="/films" className="flex items-center gap-3">
                    <Play className="w-5 h-5" /> Browse Movies
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}