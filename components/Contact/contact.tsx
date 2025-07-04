"use client";

import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe, ArrowRight, Film, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function Contact() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8 text-[#E50914]" />,
      title: "Email Us",
      description: "Get in touch via email",
      value: "support@kaguyacine.com",
      action: "mailto:support@kaguyacine.com",
      response: "We respond within 24 hours"
    },
    {
      icon: <Phone className="w-8 h-8 text-[#E50914]" />,
      title: "Call Us",
      description: "Speak with our team",
      value: "+1 234 567 8901",
      action: "tel:+1234567890",
      response: "Available Mon-Fri 9AM-6PM"
    },
    {
      icon: <MapPin className="w-8 h-8 text-[#E50914]" />,
      title: "Visit Us",
      description: "Come to our office",
      value: "123 Cinema Street, Film City",
      action: "#",
      response: "Open for appointments"
    }
  ];

  const supportTopics = [
    { icon: <Film className="w-5 h-5" />, title: "Movie Catalog", desc: "Questions about our collection" },
    { icon: <MessageCircle className="w-5 h-5" />, title: "Account Support", desc: "Help with your account" },
    { icon: <Globe className="w-5 h-5" />, title: "Technical Issues", desc: "Platform bugs and issues" },
    { icon: <Sparkles className="w-5 h-5" />, title: "Feature Requests", desc: "Suggest new features" }
  ];

  return (
    <div>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#E50914] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-[#E50914] rounded-full opacity-15 animate-pulse delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-25 animate-pulse delay-3000"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-[#E50914] rounded-full opacity-10 animate-pulse delay-4000"></div>
        <div className="absolute bottom-40 right-1/4 w-0.5 h-0.5 bg-white rounded-full opacity-40 animate-pulse delay-5000"></div>
        
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-r from-[#E50914]/10 to-red-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-gradient-to-l from-[#E50914]/8 to-red-400/3 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl animate-pulse delay-3000"></div>
        
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#E50914]/20 to-transparent opacity-30"></div>
        <div className="absolute bottom-1/3 right-0 w-full h-px bg-gradient-to-l from-transparent via-white/10 to-transparent opacity-20"></div>
      </div>

      <section className="relative max-w-6xl mx-auto text-center py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-transparent pointer-events-none"></div>
        
        <div className={`relative transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <MessageCircle className="w-12 h-12 text-[#E50914] animate-pulse" />
              <div className="absolute -inset-2 bg-[#E50914]/20 rounded-full blur-md"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Contact{" "}
            <span className="text-[#E50914] relative">
              KaguyaCiné
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] to-red-400 rounded-full"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#B3B3B3] mb-8 max-w-3xl mx-auto leading-relaxed">
            We&apos;d love to hear from you. Reach out with any questions, feedback, or partnership inquiries.
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#E50914]"></div>
            <p className="text-[#B3B3B3] px-4">Let&apos;s start a conversation</p>
            <Sparkles className="w-5 h-5 text-[#E50914]" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#E50914]"></div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-[#222] bg-gradient-to-b from-transparent to-zinc-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E50914] to-red-400 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-[#B3B3B3] max-w-2xl mx-auto">
              Choose your preferred way to reach us. We&apos;re here to help with any questions or support you need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, idx) => (
              <div
                key={idx}
                className="group relative border border-[#222] p-8 rounded-2xl text-center hover:border-[#E50914]/50 transition-all duration-500 bg-gradient-to-br from-zinc-900/30 to-transparent hover:from-zinc-900/50 hover:to-red-900/10 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative">
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 rounded-full bg-gradient-to-br from-[#E50914]/20 to-red-600/20 group-hover:from-[#E50914]/30 group-hover:to-red-600/30 transition-all duration-300">
                      {method.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-[#E50914] transition-colors duration-300">
                    {method.title}
                  </h3>
                  
                  <p className="text-[#B3B3B3] mb-4">{method.description}</p>
                  
                  <div className="mb-4">
                    <a
                      href={method.action}
                      className="text-white font-semibold hover:text-[#E50914] transition-colors duration-300 text-lg"
                    >
                      {method.value}
                    </a>
                  </div>
                  
                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#E50914]/20 to-red-600/20 rounded-full text-xs font-medium text-[#E50914] border border-[#E50914]/30">
                    {method.response}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Can We Help?</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E50914] to-red-400 mx-auto rounded-full mb-6"></div>
            <p className="text-[#B3B3B3]">Select a topic that best matches your inquiry</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {supportTopics.map((topic, idx) => (
              <div
                key={idx}
                className="p-4 border border-[#222] rounded-xl hover:border-[#E50914]/50 transition-all duration-300 cursor-pointer group bg-gradient-to-br from-zinc-900/20 to-transparent hover:from-zinc-900/40"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-[#E50914] group-hover:scale-110 transition-transform duration-300">
                    {topic.icon}
                  </div>
                  <h4 className="font-semibold text-sm group-hover:text-[#E50914] transition-colors duration-300">
                    {topic.title}
                  </h4>
                </div>
                <p className="text-xs text-[#B3B3B3]">{topic.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-[#222] bg-gradient-to-b from-zinc-900/20 to-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Send Us a Message</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E50914] to-red-400 mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-[#B3B3B3]">
              Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
          
          <div className="relative border border-[#222] p-8 md:p-12 rounded-3xl bg-gradient-to-br from-zinc-900/50 to-red-900/5 hover:border-[#E50914]/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/3 to-transparent rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block mb-3 text-sm font-semibold text-white group-focus-within:text-[#E50914] transition-colors duration-300">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-4 rounded-xl bg-black/50 border border-[#333] text-white placeholder-[#666] focus:outline-none focus:border-[#E50914] focus:bg-black/70 transition-all duration-300 hover:border-[#444]"
                  />
                </div>
                <div className="group">
                  <label className="block mb-3 text-sm font-semibold text-white group-focus-within:text-[#E50914] transition-colors duration-300">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                    className="w-full px-4 py-4 rounded-xl bg-black/50 border border-[#333] text-white placeholder-[#666] focus:outline-none focus:border-[#E50914] focus:bg-black/70 transition-all duration-300 hover:border-[#444]"
                  />
                </div>
              </div>
              
              <div className="group">
                <label className="block mb-3 text-sm font-semibold text-white group-focus-within:text-[#E50914] transition-colors duration-300">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  className="w-full px-4 py-4 rounded-xl bg-black/50 border border-[#333] text-white placeholder-[#666] focus:outline-none focus:border-[#E50914] focus:bg-black/70 transition-all duration-300 hover:border-[#444]"
                />
              </div>
              
              <div className="group">
                <label className="block mb-3 text-sm font-semibold text-white group-focus-within:text-[#E50914] transition-colors duration-300">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Tell us how we can help you..."
                  required
                  className="w-full px-4 py-4 rounded-xl bg-black/50 border border-[#333] text-white placeholder-[#666] focus:outline-none focus:border-[#E50914] focus:bg-black/70 transition-all duration-300 hover:border-[#444] resize-none"
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button
                    onClick={handleSubmit}
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#E50914] to-red-600 hover:from-red-700 hover:to-red-800 px-8 py-4 rounded-full text-lg font-semibold shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Send className="w-5 h-5" />
                      Send Message
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-[#B3B3B3]">
                  <Clock className="w-4 h-4" />
                  <span>We typically respond within 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-t border-[#222]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Quick Answers?</h2>
          <p className="text-[#B3B3B3] mb-6">
            Check out our FAQ section for instant answers to common questions.
          </p>
          <Button
            asChild
            variant="outline"
            className="border-2 border-[#333] text-white hover:bg-[#222] hover:border-[#E50914] px-6 py-3 rounded-full text-base font-semibold transition-all duration-300 hover:scale-105"
          >
            <a href="/faq" className="flex items-center gap-2">
              Browse FAQ <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}