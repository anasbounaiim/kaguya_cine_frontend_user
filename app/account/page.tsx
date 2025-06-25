"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Ticket, User2, Mail, MapPin, Star, Film, Shield, CreditCard, Settings,
  Eye, EyeOff, Camera, X, Edit3, Trash2, Bell, Download, Share2, Heart,
  Calendar, Clock, Plus, Filter, Search, ChevronDown, Award, Target,
  Zap, TrendingUp, Users, Gift, Sparkles, Crown, Phone, Home, Globe,
  Lock, Palette, Moon, Sun, Volume2, VolumeX, Wifi, Bluetooth, Battery,
  AlertCircle, CheckCircle, Info, ExternalLink, Copy, QrCode, Printer
} from 'lucide-react';

type Tab = "tickets" | "personal" | "preferences" | "contact" | "membership" | "rewards";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "tickets", label: "E-billets", icon: Ticket },
  { id: "personal", label: "Mon profil", icon: User2 },
  { id: "preferences", label: "Préférences", icon: Settings },
  { id: "contact", label: "Support", icon: Mail },
  { id: "membership", label: "Abonnement", icon: Crown },
  { id: "rewards", label: "Récompenses", icon: Gift },
];

// Mock data for enhanced functionality
const mockTickets = [
  {
    id: 'KC-3F2B-9D17',
    movie: 'Dune: Part Two',
    cinema: 'KaguyaCiné Casablanca',
    hall: 'Salle 7 — IMAX',
    seat: 'E15, E16',
    date: '2025-06-24',
    time: '21:00',
    price: '240 DH',
    status: 'active',
    poster: '/api/placeholder/300/450'
  },
  {
    id: 'KC-8A4C-2E91',
    movie: 'Avatar: The Way of Water',
    cinema: 'KaguyaCiné Rabat',
    hall: 'Salle 3 — Standard',
    seat: 'F10',
    date: '2025-06-20',
    time: '19:30',
    price: '90 DH',
    status: 'used',
    poster: '/api/placeholder/300/450'
  }
];

const mockWatchlist = [
  { id: 1, title: 'Oppenheimer', poster: '/api/placeholder/300/450', rating: 8.9 },
  { id: 2, title: 'Barbie', poster: '/api/placeholder/300/450', rating: 7.8 },
  { id: 3, title: 'Spider-Man', poster: '/api/placeholder/300/450', rating: 8.2 },
  { id: 4, title: 'The Batman', poster: '/api/placeholder/300/450', rating: 8.5 }
];

export default function EnhancedAccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("tickets");
  const [user, setUser] = useState({
    name: 'Anas Bounaim',
    email: 'anas@example.com',
    avatar: null,
    memberSince: '2023-01-15',
    totalSpent: 2450,
    moviesWatched: 12,
    points: 1250
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Mon compte
            </h1>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <span>Membre depuis</span>
              <span className="text-red-400 font-medium">Jan 2023</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <Sparkles size={16} className="text-yellow-400" />
              <span className="text-yellow-400 font-medium">{user.points} pts</span>
            </div>
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-sm font-semibold shadow-lg">
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                ) : (
                  user.name.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-black"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Tab Navigation */}
      <nav className="border-b border-white/10 bg-black/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-t-lg px-4 py-4 transition-all duration-200 ${
                  activeTab === id
                    ? "bg-gradient-to-b from-red-500/20 to-transparent border-b-2 border-red-500 text-white"
                    : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Enhanced Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {activeTab === "tickets" && <EnhancedTicketsView />}
        {activeTab === "personal" && <EnhancedPersonalView />}
        {activeTab === "preferences" && <EnhancedPreferencesView />}
        {activeTab === "contact" && <EnhancedContactView />}
        {activeTab === "membership" && <MembershipView />}
        {activeTab === "rewards" && <RewardsView />}
      </main>
    </div>
  );
}

function EnhancedTicketsView() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => ticketRef.current,
    documentTitle: "kaguyacine-ticket",
    removeAfterPrint: true,
  });

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.movie.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Dashboard */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={Ticket} 
          label="Billets actifs" 
          value="2" 
          trend="+1"
          color="red"
        />
        <StatCard 
          icon={Film} 
          label="Films vus" 
          value="12" 
          trend="+3"
          color="blue"
        />
        <StatCard 
          icon={Star} 
          label="Note moyenne" 
          value="4.2" 
          trend="+0.3"
          color="yellow"
        />
        <StatCard 
          icon={Award} 
          label="Points gagnés" 
          value="1,250" 
          trend="+150"
          color="purple"
        />
      </div>

      {/* Enhanced Tickets Section */}
      <Card className="overflow-hidden">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SectionTitle>Mes e-billets</SectionTitle>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un film..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="used">Utilisés</option>
            </select>
          </div>
        </div>

        {filteredTickets.length > 0 ? (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} onPrint={handlePrint} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Ticket}
            title="Aucun e-billet trouvé"
            text="Aucun billet ne correspond à vos critères de recherche."
            ctaHref="/films"
            cta="Réserver une séance"
          />
        )}
      </Card>

      {/* Enhanced Favorite Cinema */}
      <Card>
        <SectionTitle>Mon cinéma favori</SectionTitle>
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 p-6 border border-red-500/20">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500">
              <MapPin size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">KaguyaCiné Casablanca</h3>
              <p className="text-sm text-gray-400">Marina Shopping Center</p>
              <div className="flex items-center gap-2 mt-1">
                <Star size={14} className="text-yellow-400 fill-current" />
                <span className="text-sm text-yellow-400">4.8</span>
                <span className="text-xs text-gray-500">• 15 min de trajet</span>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
            Changer
          </button>
        </div>
      </Card>

      {/* Enhanced Watchlist */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <SectionTitle>Ma liste de souhaits</SectionTitle>
          <button className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
            <Plus size={16} />
            Ajouter
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {mockWatchlist.map((movie) => (
            <WatchlistItem key={movie.id} movie={movie} />
          ))}
        </div>
      </Card>

      {/* Hidden Printable Ticket */}
      <div className="hidden">
        <EnhancedPrintableTicket ref={ticketRef} />
      </div>
    </div>
  );
}

function EnhancedPersonalView() {
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    civilite: "Monsieur",
    prenom: "Anas",
    nom: "Bounaim",
    birth: "2001-06-04",
    email: "anas@example.com",
    phone: "+212 6 12 34 56 78",
    address: "Casablanca, Maroc",
    nationality: "Marocaine",
    profession: "Développeur",
  });

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl font-bold">
              AB
            </div>
            <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              <Camera size={14} />
            </button>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{form.prenom} {form.nom}</h2>
            <p className="text-gray-400">{form.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm text-green-400">✓ Compte vérifié</span>
              <span className="text-sm text-gray-500">Membre depuis Jan 2023</span>
            </div>
          </div>
          
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <Edit3 size={16} />
            {editMode ? 'Annuler' : 'Modifier'}
          </button>
        </div>
      </Card>

      {/* Personal Information */}
      <Card>
        <SectionTitle>Informations personnelles</SectionTitle>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Civilité */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Civilité</label>
            <div className="flex gap-4">
              {["Madame", "Monsieur"].map((c) => (
                <label key={c} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="civilite"
                    checked={form.civilite === c}
                    onChange={() => setForm((f) => ({ ...f, civilite: c }))}
                    className="h-4 w-4 accent-red-500"
                    disabled={!editMode}
                  />
                  <span className="text-sm">{c}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Names */}
          <div className="grid gap-6 md:grid-cols-2">
            <InputField
              label="Prénom"
              value={form.prenom}
              onChange={(v) => setForm((f) => ({ ...f, prenom: v }))}
              disabled={!editMode}
              required
            />
            <InputField
              label="Nom"
              value={form.nom}
              onChange={(v) => setForm((f) => ({ ...f, nom: v }))}
              disabled={!editMode}
              required
            />
          </div>

          {/* Contact */}
          <div className="grid gap-6 md:grid-cols-2">
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              disabled={!editMode}
              rightIcon={<CheckCircle size={16} className="text-green-400" />}
              required
            />
            <InputField
              label="Téléphone"
              value={form.phone}
              onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
              disabled={!editMode}
              rightIcon={<Phone size={16} className="text-gray-400" />}
              required
            />
          </div>

          {/* Additional Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <InputField
              label="Date de naissance"
              type="date"
              value={form.birth}
              onChange={(v) => setForm((f) => ({ ...f, birth: v }))}
              disabled={!editMode}
              required
            />
            <InputField
              label="Nationalité"
              value={form.nationality}
              onChange={(v) => setForm((f) => ({ ...f, nationality: v }))}
              disabled={!editMode}
            />
          </div>

          <InputField
            label="Adresse"
            value={form.address}
            onChange={(v) => setForm((f) => ({ ...f, address: v }))}
            disabled={!editMode}
            rightIcon={<Home size={16} className="text-gray-400" />}
          />

          {editMode && (
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium transition-colors hover:bg-red-700"
              >
                <CheckCircle size={16} />
                Sauvegarder
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="rounded-lg bg-white/10 px-6 py-3 font-medium transition-colors hover:bg-white/20"
              >
                Annuler
              </button>
            </div>
          )}
        </form>
      </Card>

      {/* Security Settings */}
      <Card>
        <SectionTitle>Sécurité</SectionTitle>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-blue-400" />
              <div>
                <p className="font-medium">Mot de passe</p>
                <p className="text-sm text-gray-400">Dernière modification il y a 2 mois</p>
              </div>
            </div>
            <button className="text-sm text-red-400 hover:text-red-300">
              Modifier
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-green-400" />
              <div>
                <p className="font-medium">Authentification à deux facteurs</p>
                <p className="text-sm text-gray-400">Sécurisez votre compte</p>
              </div>
            </div>
            <ToggleSwitch checked={false} onChange={() => {}} />
          </div>
        </div>
      </Card>
    </div>
  );
}

function EnhancedPreferencesView() {
  const [prefs, setPrefs] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    darkMode: true,
    language: 'fr',
    currency: 'MAD',
    autoPlay: false,
    highQuality: true,
  });

  return (
    <div className="space-y-8">
      {/* Notifications */}
      <Card>
        <SectionTitle>Notifications</SectionTitle>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Notifications par email', icon: Mail, desc: 'Recevez des mises à jour par email' },
            { key: 'pushNotifications', label: 'Notifications push', icon: Bell, desc: 'Notifications en temps réel' },
            { key: 'smsNotifications', label: 'Notifications SMS', icon: Phone, desc: 'Alertes par SMS pour les réservations' },
          ].map(({ key, label, icon: Icon, desc }) => (
            <div key={key} className="flex items-center justify-between rounded-xl bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-red-400" />
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-gray-400">{desc}</p>
                </div>
              </div>
              <ToggleSwitch
                checked={prefs[key as keyof typeof prefs] as boolean}
                onChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Display Settings */}
      <Card>
        <SectionTitle>Affichage</SectionTitle>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-blue-400" />
              <div>
                <p className="font-medium">Mode sombre</p>
                <p className="text-sm text-gray-400">Interface en mode sombre</p>
              </div>
            </div>
            <ToggleSwitch
              checked={prefs.darkMode}
              onChange={(v) => setPrefs((p) => ({ ...p, darkMode: v }))}
            />
          </div>
          
          <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-green-400" />
              <div>
                <p className="font-medium">Langue</p>
                <p className="text-sm text-gray-400">Langue de l'interface</p>
              </div>
            </div>
            <select
              value={prefs.language}
              onChange={(e) => setPrefs(p => ({ ...p, language: e.target.value }))}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Media Preferences */}
      <Card>
        <SectionTitle>Préférences multimédia</SectionTitle>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Volume2 size={20} className="text-purple-400" />
              <div>
                <p className="font-medium">Lecture automatique</p>
                <p className="text-sm text-gray-400">Lecture auto des bandes-annonces</p>
              </div>
            </div>
            <ToggleSwitch
              checked={prefs.autoPlay}
              onChange={(v) => setPrefs((p) => ({ ...p, autoPlay: v }))}
            />
          </div>
          
          <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-yellow-400" />
              <div>
                <p className="font-medium">Qualité haute définition</p>
                <p className="text-sm text-gray-400">Privilégier la HD quand disponible</p>
              </div>
            </div>
            <ToggleSwitch
              checked={prefs.highQuality}
              onChange={(v) => setPrefs((p) => ({ ...p, highQuality: v }))}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

function EnhancedContactView() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');

  return (
    <div className="space-y-8">
      {/* Contact Info */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
              <Phone size={24} className="text-red-500" />
            </div>
            <h3 className="font-semibold">Téléphone</h3>
            <p className="text-sm text-gray-400 mt-1">+212 5 22 XX XX XX</p>
            <p className="text-xs text-gray-500 mt-1">Lun-Dim 9h-22h</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
              <Mail size={24} className="text-blue-500" />
            </div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-sm text-gray-400 mt-1">support@kaguya.ma</p>
            <p className="text-xs text-gray-500 mt-1">Réponse sous 24h</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <Users size={24} className="text-green-500" />
            </div>
            <h3 className="font-semibold">Chat en direct</h3>
            <p className="text-sm text-gray-400 mt-1">Assistance immédiate</p>
            <button className="mt-2 text-xs text-green-400 hover:text-green-300">
              Démarrer le chat
            </button>
          </div>
        </Card>
      </div>

      {/* Support Form */}
      <Card>
        <SectionTitle>Envoyer un message</SectionTitle>
        <p className="mb-6 max-w-lg text-sm text-gray-400">
          Nos équipes sont là pour vous aider. Décrivez votre problème et nous vous répondrons rapidement.
        </p>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-6 md:grid-cols-2">
            <InputField
              label="Sujet"
              value={subject}
              onChange={setSubject}
              placeholder="Décrivez brièvement votre demande"
              required
            />
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Priorité</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="low">Faible</option>
                <option value="normal">Normale</option>
                <option value="high">Élevée</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Message</label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-none rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Décrivez votre problème en détail..."
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-medium transition-colors hover:bg-red-700"
            >
              <Mail size={16} />
              Envoyer
            </button>
            <button
              type="button"
              onClick={() => {
                setSubject('');
                setMessage('');
                setPriority('normal');
              }}
              className="rounded-lg bg-white/10 px-6 py-3 font-medium transition-colors hover:bg-white/20"
            >
              Effacer
            </button>
          </div>
        </form>
      </Card>

      {/* FAQ Section */}
      <Card>
        <SectionTitle>Questions fréquentes</SectionTitle>
        <div className="space-y-4">
          {[
            {
              q: "Comment annuler ma réservation ?",
              a: "Vous pouvez annuler votre réservation jusqu'à 2 heures avant la séance depuis votre espace compte."
            },
            {
              q: "Que faire si j'ai perdu mon e-billet ?",
              a: "Connectez-vous à votre compte pour retrouver et réimprimer vos billets ou contactez notre support."
            },
            {
              q: "Comment utiliser mes points de fidélité ?",
              a: "Vos points peuvent être utilisés lors du paiement. 100 points = 10 MAD de réduction."
            }
          ].map((faq, index) => (
            <details key={index} className="group rounded-lg bg-white/5 p-4">
              <summary className="cursor-pointer font-medium flex items-center justify-between">
                {faq.q}
                <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MembershipView() {
  const [currentPlan] = useState('premium');
  
  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <Crown size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Plan Premium</h3>
              <p className="text-gray-400">Accès illimité + avantages exclusifs</p>
              <p className="text-sm text-purple-300 mt-1">Renouvelé le 24 juillet 2025</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">199 MAD</p>
            <p className="text-sm text-gray-400">/mois</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-green-400" />
            <span>Réservations illimitées</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-green-400" />
            <span>Places premium incluses</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle size={16} className="text-green-400" />
            <span>Points de fidélité x2</span>
          </div>
        </div>
      </Card>

      {/* Plans Comparison */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            name: 'Basic',
            price: '0',
            color: 'gray',
            features: ['5 réservations/mois', 'Places standard', 'Support email'],
            current: false
          },
          {
            name: 'Premium',
            price: '199',
            color: 'purple',
            features: ['Réservations illimitées', 'Places premium', 'Support prioritaire', 'Points x2'],
            current: true
          },
          {
            name: 'VIP',
            price: '399',
            color: 'gold',
            features: ['Tout Premium +', 'Avant-premières', 'Concierge personnel', 'Parking gratuit'],
            current: false
          }
        ].map((plan) => (
          <Card key={plan.name} className={`relative ${plan.current ? 'ring-2 ring-purple-500' : ''}`}>
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Plan actuel
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-gray-400"> MAD/mois</span>
              </div>
            </div>
            
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                plan.current
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              disabled={plan.current}
            >
              {plan.current ? 'Plan actuel' : 'Choisir ce plan'}
            </button>
          </Card>
        ))}
      </div>

      {/* Usage Stats */}
      <Card>
        <SectionTitle>Utilisation ce mois</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">12</div>
            <div className="text-sm text-gray-400">Réservations</div>
            <div className="text-xs text-gray-500 mt-1">Illimitées</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">8</div>
            <div className="text-sm text-gray-400">Places premium</div>
            <div className="text-xs text-gray-500 mt-1">Incluses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">240</div>
            <div className="text-sm text-gray-400">Points gagnés</div>
            <div className="text-xs text-gray-500 mt-1">Bonus x2</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function RewardsView() {
  const [selectedReward, setSelectedReward] = useState(null);
  
  const rewards = [
    { id: 1, name: 'Pop-corn gratuit', points: 150, category: 'snacks', available: true },
    { id: 2, name: 'Boisson offerte', points: 100, category: 'snacks', available: true },
    { id: 3, name: 'Place IMAX -50%', points: 300, category: 'tickets', available: true },
    { id: 4, name: 'T-shirt KaguyaCiné', points: 500, category: 'goodies', available: false },
    { id: 5, name: 'Avant-première exclusive', points: 800, category: 'experiences', available: true },
    { id: 6, name: 'Invitation pour 2', points: 600, category: 'tickets', available: true }
  ];

  return (
    <div className="space-y-8">
      {/* Points Balance */}
      <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Mes points de fidélité</h3>
            <p className="text-gray-400">Gagnez des points à chaque réservation</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Sparkles size={32} className="text-yellow-400" />
              <span className="text-4xl font-bold text-yellow-400">1,250</span>
            </div>
            <p className="text-sm text-gray-400">points disponibles</p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-green-400" />
            <span>+150 points ce mois</span>
          </div>
          <div className="flex items-center gap-2">
            <Target size={16} className="text-blue-400" />
            <span>Prochain niveau: 2000 pts</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} className="text-purple-400" />
            <span>Niveau: Premium</span>
          </div>
        </div>
      </Card>

      {/* Rewards Catalog */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <SectionTitle>Catalogue des récompenses</SectionTitle>
          <div className="flex gap-2">
            {['all', 'snacks', 'tickets', 'goodies', 'experiences'].map((cat) => (
              <button
                key={cat}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors capitalize"
              >
                {cat === 'all' ? 'Tout' : cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                reward.available
                  ? 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                  : 'border-gray-700 bg-gray-800/50 opacity-60'
              }`}
              onClick={() => reward.available && setSelectedReward(reward)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{reward.name}</h4>
                  <p className="text-xs text-gray-400 capitalize">{reward.category}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Sparkles size={14} className="text-yellow-400" />
                    <span className="font-bold text-yellow-400">{reward.points}</span>
                  </div>
                </div>
              </div>
              
              <button
                disabled={!reward.available}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                  reward.available
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {reward.available ? 'Échanger' : 'Indisponible'}
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Points History */}
      <Card>
        <SectionTitle>Historique des points</SectionTitle>
        <div className="space-y-3">
          {[
            { date: '24 Jun 2025', desc: 'Réservation Dune: Part Two', points: '+50', type: 'earn' },
            { date: '20 Jun 2025', desc: 'Pop-corn gratuit', points: '-150', type: 'spend' },
            { date: '18 Jun 2025', desc: 'Bonus membre premium', points: '+25', type: 'bonus' },
            { date: '15 Jun 2025', desc: 'Réservation Avatar', points: '+45', type: 'earn' }
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  transaction.type === 'earn' ? 'bg-green-400' :
                  transaction.type === 'spend' ? 'bg-red-400' : 'bg-yellow-400'
                }`} />
                <div>
                  <p className="font-medium text-sm">{transaction.desc}</p>
                  <p className="text-xs text-gray-400">{transaction.date}</p>
                </div>
              </div>
              <span className={`font-bold ${
                transaction.type === 'spend' ? 'text-red-400' : 'text-green-400'
              }`}>
                {transaction.points}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// Enhanced Ticket Card Component
function TicketCard({ ticket, onPrint }: { ticket: any, onPrint: () => void }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="rounded-xl border border-white/10 bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 p-6 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="h-20 w-16 flex-shrink-0 rounded-lg bg-gray-700" />
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">{ticket.movie}</h3>
              <p className="text-sm text-gray-400">{ticket.cinema}</p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(ticket.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {ticket.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {ticket.hall}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                ticket.status === 'active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {ticket.status === 'active' ? 'Actif' : 'Utilisé'}
              </span>
              <span className="text-lg font-bold">{ticket.price}</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Places:</span>
              <span className="font-medium">{ticket.seat}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400">ID:</span>
              <span className="font-mono text-xs">{ticket.id}</span>
            </div>
            
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors">
                <QrCode size={14} />
                QR Code
              </button>
              <button 
                onClick={onPrint}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-sm transition-colors"
              >
                <Printer size={14} />
                Imprimer
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors">
                <Share2 size={14} />
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WatchlistItem({ movie }: { movie: any }) {
  return (
    <div className="group relative">
      <div className="aspect-[2/3] rounded-lg bg-gray-800 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-800" />
      </div>
      
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
        <div className="flex gap-2">
          <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <Heart size={16} />
          </button>
          <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-2 left-2 right-2">
        <div className="flex items-center gap-1">
          <Star size={12} className="text-yellow-400 fill-current" />
          <span className="text-xs text-white font-medium">{movie.rating}</span>
        </div>
      </div>
      
      <button className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
        <X size={12} />
      </button>
    </div>
  );
}

// Enhanced Printable Ticket Component
const EnhancedPrintableTicket = React.forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    className="mx-auto w-[400px] bg-white text-black shadow-2xl"
    style={{ fontFamily: 'Arial, sans-serif' }}
  >
    {/* Header */}
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">🎬 KaguyaCiné</h1>
      <p className="text-sm opacity-90">E-Ticket Cinéma</p>
    </div>

    {/* Main Content */}
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold mb-2">Dune: Part Two</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Cinéma:</strong> KaguyaCiné Casablanca</p>
          <p><strong>Salle:</strong> IMAX 7</p>
        </div>
      </div>

      <div className="border-t border-b border-dashed border-gray-300 py-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Date</p>
            <p className="font-bold">24 Juin 2025</p>
          </div>
          <div>
            <p className="text-gray-600">Heure</p>
            <p className="font-bold">21h00</p>
          </div>
          <div>
            <p className="text-gray-600">Places</p>
            <p className="font-bold">E15, E16</p>
          </div>
          <div>
            <p className="text-gray-600">Prix</p>
            <p className="font-bold">240 MAD</p>
          </div>
        </div>
      </div>

      {/* QR Code Area */}
      <div className="text-center mb-6">
        <div className="mx-auto w-24 h-24 bg-gray-900 rounded-lg mb-3 flex items-center justify-center">
          <div className="w-20 h-20 bg-white rounded grid grid-cols-8 gap-0.5 p-1">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} rounded-sm`} />
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-600 font-mono">KC-3F2B-9D17</p>
      </div>

      <div className="text-center text-xs text-gray-500 leading-relaxed">
        <p className="mb-2">Présentez ce billet à l'entrée</p>
        <p>Arrivée recommandée 15 min avant la séance</p>
        <p className="mt-4 font-semibold">Merci de votre confiance !</p>
      </div>
    </div>

    {/* Footer */}
    <div className="bg-gray-100 px-6 py-3 text-center">
      <p className="text-xs text-gray-600">www.kaguya-cine.ma • +212 5 22 XX XX XX</p>
    </div>
  </div>
));

EnhancedPrintableTicket.displayName = "EnhancedPrintableTicket";

// Enhanced Utility Components
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-sm transition-all hover:bg-zinc-900/60 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-6 text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{children}</h2>;
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color = 'red'
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  color?: string;
}) {
  const colorClasses = {
    red: 'bg-red-500/20 text-red-500',
    blue: 'bg-blue-500/20 text-blue-500',
    yellow: 'bg-yellow-500/20 text-yellow-500',
    purple: 'bg-purple-500/20 text-purple-500',
    green: 'bg-green-500/20 text-green-500'
  };

  return (
    <Card className="hover:scale-105 transition-transform">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <span className="text-xs text-green-400 font-medium">
                {trend}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
  ctaHref,
  cta,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
  ctaHref: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col items-center text-center py-12">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-500/20">
        <Icon className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <p className="mb-8 max-w-md text-sm text-gray-400 leading-relaxed">{text}</p>
      <a
        href={ctaHref}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:from-red-700 hover:to-red-800 hover:shadow-lg"
      >
        <Plus size={16} />
        {cta}
      </a>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  rightIcon,
  disabled = false,
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium flex items-center gap-1">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`w-full rounded-lg border px-4 py-3 pr-12 outline-none transition-all ${
            disabled
              ? 'border-gray-600 bg-gray-800 text-gray-400 cursor-not-allowed'
              : 'border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-red-500 hover:border-white/30'
          }`}
        />
        {rightIcon && <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</span>}
      </div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-checked={checked}
      role="switch"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative h-6 w-12 rounded-full transition-all ${
        disabled
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer'
      } ${
        checked ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gray-600"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${
          checked ? "translate-x-6" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}