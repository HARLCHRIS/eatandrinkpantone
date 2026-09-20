import React, { useState, useEffect } from 'react';
import type { Application, CompetitionConfig, UserRole, FilterState } from '../types';
import { SELECTION_CRITERIA } from '../config/appConfig';
import { PlusCircle, Sparkles, Phone, Ticket, Menu, X, Download, FileText } from 'lucide-react';
import { FestivalChallengesSection } from '../components/FestivalChallengesSection';
import { FestivalExperienceShowcase } from '../components/FestivalExperienceShowcase';

const InstagramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

interface PublicHomePageProps {
  config: CompetitionConfig;
  applications: Application[];
  filteredApplications: Application[];
  filters: FilterState;
  onFilterChange: React.Dispatch<React.SetStateAction<FilterState>>;
  currentRole: UserRole;
  onOpenCandidateForm: () => void;
  onViewDetails: (app: Application) => void;
  onNavigateToPro?: (tab: 'admin' | 'jury') => void;
}

/**
 * Calculateur de temps restant pour le compte à rebours du festival.
 * 
 * @param {string} targetDateStr - Date cible au format ISO.
 * @returns {object} Jours, heures, minutes et secondes restants.
 */
function useCountdown(targetDateStr: string) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDateStr));

  function calculateTimeLeft(targetStr: string) {
    const target = new Date(targetStr).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDateStr));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  return timeLeft;
}

/**
 * Page d'accueil publique ultra-stylisée intégrant le design réactif.
 * Combine la vitrine du festival, le compte à rebours, la billetterie, les challenges et la galerie des candidatures.
 *
 * @param {PublicHomePageProps} props - Configuration du festival, candidatures et handlers de modales.
 * @returns {React.ReactElement} Interface publique dynamique.
 */
export const PublicHomePage: React.FC<PublicHomePageProps> = ({
  config,
  applications,
  filteredApplications: _filteredApplications,
  filters: _filters,
  onFilterChange: _onFilterChange,
  currentRole: _currentRole,
  onOpenCandidateForm,
  onViewDetails: _onViewDetails,
  onNavigateToPro: _onNavigateToPro,
}) => {
  const timeLeft = useCountdown('2027-01-26T11:00:00');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="animate-fade-in bg-brand-dark text-slate-100 min-h-screen">
      {/* Top Announcement Bar */}
      <div className="bg-brand-yellow text-brand-dark font-festive font-black text-[11px] sm:text-xs md:text-sm tracking-wider py-2 px-3 border-b-2 border-black flex items-center gap-3 overflow-hidden whitespace-nowrap">
        <span className="px-2 py-0.5 bg-black text-brand-yellow text-[9px] sm:text-[10px] rounded uppercase font-bold tracking-widest shrink-0 z-10 shadow">
          OFFICIEL
        </span>
        <div className="overflow-hidden flex-1 relative flex items-center">
          <div className="animate-marquee inline-flex items-center gap-6">
            <span>🚨 8ÈME ÉDITION • Eat and Drink Cotonou Festival • 26 AU 31 JANVIER 2027 • INFOLINE WHATSAPP : +229 01 48 75 95 96</span>
            <span>🚨 8ÈME ÉDITION • Eat and Drink Cotonou Festival • 26 AU 31 JANVIER 2027 • INFOLINE WHATSAPP : +229 01 48 75 95 96</span>
          </div>
        </div>
      </div>

      {/* Header Navigation with Logo & Responsive Menu */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-brand-navy/95 border-b border-white/10 transition-all duration-300">
        <nav aria-label="Navigation principale" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <a className="flex items-center gap-3 group shrink-0" href="#hero" title="Retour à l'accueil">
            <img
              alt="Eat & Drink Cotonou Festival Logo"
              className="h-10 sm:h-14 w-auto object-contain transition-transform group-hover:scale-105"
              src="/festival_logo.png"
            />
          </a>

          {/* Desktop Right Action Group */}
          <div className="hidden md:flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-6 font-festive text-sm sm:text-base tracking-wider text-slate-200">
              <a
                href="#candidature"
                className="hover:text-brand-yellow transition-colors font-black uppercase text-brand-yellow"
              >
                Candidater
              </a>
              <a
                href="#challenges"
                className="hover:text-brand-yellow transition-colors font-black uppercase"
              >
                Défis 2027
              </a>
              <a
                href="#stands"
                className="hover:text-brand-yellow transition-colors font-black uppercase"
              >
                Stands
              </a>
            </div>

            <a
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-festive font-black tracking-wider bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 transition-all shadow-md transform hover:-translate-y-0.5"
              href="https://wa.me/2290148759596"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone size={14} className="text-emerald-400" />
              <span>WHATSAPP INFO</span>
            </a>

            <button
              onClick={onOpenCandidateForm}
              className="px-5 py-2.5 bg-brand-yellow hover:bg-brand-lime text-black font-festive font-black text-xs sm:text-sm rounded-full transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Candidater</span>
              <span className="text-sm">➜</span>
            </button>
          </div>

          {/* Mobile Actions: CANDIDATER button + Hamburger Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenCandidateForm}
              className="px-3.5 py-1.5 bg-brand-yellow text-black font-festive font-black text-xs rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider"
            >
              <span>Candidater</span>
              <span className="text-xs">➜</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/10"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Slide-down Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-brand-navy border-b border-white/10 px-4 py-5 space-y-3.5 animate-fade-in shadow-2xl">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenCandidateForm();
              }}
              className="w-full text-center py-3 px-4 bg-brand-yellow hover:bg-brand-lime text-black font-festive font-black text-sm rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <span>🏆 CANDIDATER (1 000 000 FCFA)</span>
              <span>➜</span>
            </button>

            <a
              href="#candidature"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-festive text-sm font-bold text-slate-200 hover:text-brand-yellow uppercase tracking-wider py-2 border-b border-white/5"
            >
              📋 Présentation & Inscriptions
            </a>
            <a
              href="#challenges"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-festive text-sm font-bold text-slate-200 hover:text-brand-yellow uppercase tracking-wider py-2 border-b border-white/5"
            >
              🔥 Défis & Tournois 2027
            </a>
            <a
              href="#stands"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-festive text-sm font-bold text-slate-200 hover:text-brand-yellow uppercase tracking-wider py-2 border-b border-white/5"
            >
              🎪 Réserver un Stand
            </a>
            
            <a
              href="https://wa.me/2290148759596"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-festive font-bold text-xs tracking-wider uppercase"
            >
              <Phone size={15} />
              <span>Infoline WhatsApp (+229 01 48 75 95 96)</span>
            </a>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-4 sm:pt-6 pb-12 lg:pt-10 lg:pb-24" id="hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Main Visual Banner Container */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border-2 sm:border-4 border-white/10 shadow-2xl bg-brand-navy mb-8 sm:mb-12 group">
            <img
              alt="Bannière Officielle EAT & DRINK FESTIVAL 8ème Édition Cotonou City 2027"
              className="w-full h-[320px] xs:h-[360px] sm:h-[440px] lg:h-[520px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              src="/toucan_logo_couleurs.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-navy/20 to-transparent"></div>

            {/* Call to Candidates Sticker Card - Floating */}
            <div className="absolute top-3 left-3 sm:top-8 sm:left-8 bg-brand-yellow text-brand-dark p-3.5 sm:p-5 rounded-2xl shadow-sticker -rotate-2 border-2 border-black max-w-[240px] xs:max-w-[270px] sm:max-w-[320px] z-20">
              <span className="block text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-100 px-2 py-0.5 rounded w-max mb-1">
                APPEL À CANDIDATURES
              </span>
              <p className="font-festive text-base sm:text-xl font-black leading-tight text-slate-950">
                STARTUPS CHALLENGE 2027
              </p>

              <button
                onClick={onOpenCandidateForm}
                className="mt-2.5 w-full py-2 px-3 sm:py-2.5 sm:px-4 bg-black hover:bg-slate-900 text-brand-yellow font-festive font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 tracking-wider uppercase"
              >
                <span>CANDIDATER</span>
                <span className="text-xs sm:text-sm">➜</span>
              </button>
            </div>

            {/* Download Presentation / Rules PDF Badge Button */}
            <a
              href="/EAD STARTUPS CHALLENGE.pdf"
              download="EAD STARTUPS CHALLENGE.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 sm:bottom-8 sm:right-10 flex items-center gap-2.5 sm:gap-4 bg-black/90 hover:bg-black backdrop-blur-md p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-brand-yellow/60 hover:border-brand-yellow shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group/pdf cursor-pointer z-20"
              title="Télécharger la présentation du EAT & DRINK STARTUP CHALLENGE (PDF)"
            >
              <div className="bg-white px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl shadow-md flex items-center justify-center shrink-0 group-hover/pdf:scale-105 transition-transform">
                <img
                  alt="Eat & Drink Colours Logo"
                  className="h-7 sm:h-12 w-auto object-contain"
                  src="/EADCOLOURS.jpg"
                />
              </div>
              <div className="text-left">
                <div className="text-[9px] sm:text-[11px] font-festive text-brand-yellow font-bold tracking-widest uppercase flex items-center gap-1">
                  <FileText size={13} className="text-brand-yellow shrink-0" />
                  <span>DOCUMENT OFFICIEL PDF</span>
                </div>
                <div className="font-festive text-xs sm:text-lg text-white font-black leading-tight group-hover/pdf:text-brand-lime transition-colors">
                  TÉLÉCHARGER LE DOCUMENT
                </div>
                <div className="text-[10px] sm:text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <Download size={12} className="text-brand-lime animate-bounce" />
                  <span>EAT & DRINK STARTUP CHALLENGE</span>
                </div>
              </div>
            </a>
          </div>

          {/* Hero Pitch & Countdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-24" id="candidature">

            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-lime/10 border border-brand-lime/40 text-brand-lime font-festive text-[11px] sm:text-xs tracking-widest uppercase">
                <Sparkles size={14} /> LE PLUS GRAND FESTIVAL CULINAIRE DE COTONOU
              </div>
              <h1 className="font-festive text-3xl sm:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight">
                GOOD FOOD, <br />
                GOOD PEOPLE, <br />
                GOOD VIBES, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-pink">
                  GOOD FUND.
                </span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-lg max-w-xl leading-relaxed">
                Plongez au cœur de 6 jours d'effervescence gustative. Candidatez au Concours Agroalimentaire ({applications.length} inscrits) pour tenter de remporter la dotation de <strong className="text-brand-yellow">{config.prizeAmountFCFA.toLocaleString()} FCFA</strong> !
              </p>
              
              <div className="pt-2 flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                <button
                  onClick={onOpenCandidateForm}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-brand-yellow hover:bg-brand-lime text-black font-festive font-black text-sm sm:text-lg tracking-wider rounded-xl shadow-neonYellow hover:shadow-neonLime transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <PlusCircle size={20} />
                  <span>DÉPOSER MA CANDIDATURE</span>
                </button>

                <a
                  href="#stands"
                  className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white font-festive font-bold text-xs sm:text-sm tracking-wider rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <Ticket size={18} /> RÉSERVER UN STAND
                </a>
              </div>
            </div>

            {/* Right: Real-time Countdown Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-brand-card to-brand-navy p-5 sm:p-8 rounded-3xl border-2 border-brand-yellow/30 shadow-2xl relative">
              <div className="absolute -top-3.5 -right-2 sm:-top-4 sm:-right-3 bg-brand-pink text-white font-festive text-[10px] sm:text-xs uppercase px-3 py-1 sm:px-4 sm:py-1.5 rounded-full shadow-lg rotate-3 sm:rotate-6 tracking-widest">
                Save The Date
              </div>
              <h3 className="font-festive text-xs sm:text-sm uppercase tracking-widest text-slate-400 mb-1">Coup d'envoi dans</h3>
              <h2 className="font-festive text-xl sm:text-2xl text-white font-black mb-5 sm:mb-6">Janvier 2027 à Cotonou</h2>

              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center mb-6">
                <div className="bg-black/50 p-2.5 sm:p-4 rounded-xl border border-white/10">
                  <span className="block font-festive text-xl xs:text-2xl sm:text-4xl text-brand-yellow font-black">{timeLeft.days}</span>
                  <span className="text-[9px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold">Jours</span>
                </div>
                <div className="bg-black/50 p-2.5 sm:p-4 rounded-xl border border-white/10">
                  <span className="block font-festive text-xl xs:text-2xl sm:text-4xl text-brand-lime font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[9px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold">Heures</span>
                </div>
                <div className="bg-black/50 p-2.5 sm:p-4 rounded-xl border border-white/10">
                  <span className="block font-festive text-xl xs:text-2xl sm:text-4xl text-brand-cyan font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[9px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold">Min</span>
                </div>
                <div className="bg-black/50 p-2.5 sm:p-4 rounded-xl border border-white/10">
                  <span className="block font-festive text-xl xs:text-2xl sm:text-4xl text-brand-pink font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[9px] sm:text-xs text-slate-400 uppercase tracking-wider font-bold">Sec</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 border-t border-white/10 pt-4">
                <li className="flex items-center gap-2">
                  <span className="text-brand-lime font-bold">✓</span> Dotation officielle {config.prizeAmountFCFA.toLocaleString()} FCFA pour le gagnant
                </li>
              </ul>
              <div className="mt-5 sm:mt-6 p-3 bg-brand-yellow/10 rounded-xl border border-brand-yellow/30 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] sm:text-xs font-bold text-brand-yellow uppercase tracking-wider">Infoline & Partenariats</span>
                <span className="text-[11px] sm:text-xs font-festive text-white font-bold">{config.contactPhone}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker Tape Banner */}
      <section className="bg-brand-yellow py-3 border-y-4 border-black overflow-hidden shadow-neonYellow transform -rotate-1 relative z-20">
        <div className="animate-marquee whitespace-nowrap text-brand-dark font-festive text-base sm:text-xl font-black tracking-widest flex items-center">
          <span className="mx-4">🔥 SAVE THE DATE</span>
          <span className="mx-2">•</span>
          <span className="mx-4">26 &gt; 31 JANVIER 2027</span>
          <span className="mx-2">•</span>
          <span className="mx-4">EAT AND DRINK COTONOU FESTIVAL</span>
          <span className="mx-2">•</span>
          <span className="mx-4">DOTATION {config.prizeAmountFCFA.toLocaleString()} FCFA</span>
          <span className="mx-2">•</span>
          <span className="mx-4">GOOD FOOD, GOOD PEOPLE, GOOD VIBES, GOOD FUND</span>
          <span className="mx-2">•</span>
          <span className="mx-4">120+ RESTAURANTS & CHEFS</span>
          <span className="mx-2">•</span>
          <span className="mx-4">STARTUPS CHALLENGE</span>
          <span className="mx-2">•</span>
        </div>
      </section>

      {/* Concept & Experience Section */}
      <section className="py-20 lg:py-28 relative" id="festivites">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block bg-brand-pink text-white font-festive text-xs tracking-widest px-3 py-1 rounded-md uppercase -rotate-2 mb-3">
              Ambiance Festival Unique
            </div>
            <h2 className="font-festive text-3xl sm:text-5xl font-black text-white leading-tight">
              UNE EXPÉRIENCE GOURMANDE & NOCTURNE HORS DU COMMUN
            </h2>
            <p className="text-slate-400 mt-4 text-sm sm:text-base">
              L'esprit de fête inspiré des plus grands rassemblements conviviaux : gastronomie béninoise et internationale, musique, opportunités pour les startups agroalimentaires.
            </p>
          </div>

          {/* Polaroid Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 pt-4">
            {/* Polaroid 1 */}
            <div className="bg-white text-slate-900 p-4 rounded-2xl transform md:-rotate-3 hover:rotate-0 transition-all duration-300 polaroid-shadow border-4 border-slate-100 flex flex-col justify-between group">
              <div className="h-60 rounded-xl overflow-hidden bg-slate-900 relative">
                <img
                  alt="Food Court et Grillades"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="/exp_grillades.jpg"
                />
                <span className="absolute bottom-2 left-2 bg-brand-yellow font-festive text-[11px] font-black px-2 py-0.5 rounded text-black shadow">
                  100% SAVEURS
                </span>
              </div>
              <div className="pt-4 text-left">
                <h3 className="font-festive text-xl font-black text-black">Grillades & Terroirs</h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">Agouti braisé, alloco doré, mouton grillé et gastronomie béninoise sublimée.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>🍢 +70 Chefs & Rôtisseurs</span>
                <span className="text-brand-orange">Délicieux</span>
              </div>
            </div>

            {/* Polaroid 2 */}
            <div className="bg-white text-slate-900 p-4 rounded-2xl transform md:rotate-2 hover:rotate-0 transition-all duration-300 polaroid-shadow border-4 border-slate-100 flex flex-col justify-between group">
              <div className="h-60 rounded-xl overflow-hidden bg-slate-900 relative">
                <img
                  alt="DJ sets et Concerts live"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="/exp_concerts.jpg"
                />
                <span className="absolute bottom-2 left-2 bg-brand-pink font-festive text-[11px] font-black px-2 py-0.5 rounded text-white shadow">
                  LIVE & SOUND
                </span>
              </div>
              <div className="pt-4 text-left">
                <h3 className="font-festive text-xl font-black text-black">Concerts & DJ Sets</h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">Les meilleurs DJs afrobeats, amapiano et artistes live pour faire vibrer Cotonou.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>🎧 18h &gt; 04h Matin</span>
                <span className="text-brand-pink">Non-stop</span>
              </div>
            </div>

            {/* Polaroid 3 */}
            <div className="bg-white text-slate-900 p-4 rounded-2xl transform md:-rotate-2 hover:rotate-0 transition-all duration-300 polaroid-shadow border-4 border-slate-100 flex flex-col justify-between group">
              <div className="h-60 rounded-xl overflow-hidden bg-slate-900 relative">
                <img
                  alt="Cocktails tropicaux et mixologie"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="/exp_cocktails.jpg"
                />
                <span className="absolute bottom-2 left-2 bg-brand-cyan font-festive text-[11px] font-black px-2 py-0.5 rounded text-black shadow">
                  MIXOLOGIE CHIC
                </span>
              </div>
              <div className="pt-4 text-left">
                <h3 className="font-festive text-xl font-black text-black">Cocktails & Bars</h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">Créations signature aux fruits tropicaux locaux, bières et mocktails artisanaux.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>🍹 15 Bars Thématiques</span>
                <span className="text-brand-cyan">Fraîcheur</span>
              </div>
            </div>

            {/* Polaroid 4 */}
            <div className="bg-white text-slate-900 p-4 rounded-2xl transform md:rotate-3 hover:rotate-0 transition-all duration-300 polaroid-shadow border-4 border-slate-100 flex flex-col justify-between group">
              <div className="h-60 rounded-xl overflow-hidden bg-slate-900 relative">
                <img
                  alt="Ambiance festive"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src="/exp_games.jpg"
                />
                <span className="absolute bottom-2 left-2 bg-brand-lime font-festive text-[11px] font-black px-2 py-0.5 rounded text-black shadow">
                  COMMUNAUTÉ
                </span>
              </div>
              <div className="pt-4 text-left">
                <h3 className="font-festive text-xl font-black text-black">Games & Fun Zones</h3>
                <p className="text-xs text-slate-600 mt-1 font-medium">Beer pong géant, blind tests musicaux, photobooths et animations.</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>🏆 Lots & Goodies</span>
                <span className="text-brand-lime">Ambiance 10/10</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selection Criteria Section */}
      <section className="py-16 bg-brand-navy/40 border-t border-b border-white/10" id="criteres">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-festive text-3xl sm:text-4xl font-black text-white">
              GRILLE D'ÉVALUATION DU CHALLENGE
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Les dossiers de candidature sont notés de manière transparente par nos jurés d'experts selon 7 critères de sélection.
            </p>
          </div>

          {/* Rangée du haut (4 premiers critères) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {SELECTION_CRITERIA.slice(0, 4).map((crit) => (
              <div key={crit.key} className="bg-brand-card p-5 rounded-2xl border border-white/10 hover:border-brand-yellow/50 transition-all flex flex-col justify-between">
                <div className="mb-2">
                  <h4 className="font-festive text-sm font-bold text-white uppercase tracking-wider">{crit.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{crit.description}</p>
              </div>
            ))}
          </div>

          {/* Rangée du bas (3 derniers critères centrés) */}
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 max-w-5xl mx-auto">
            {SELECTION_CRITERIA.slice(4).map((crit) => (
              <div key={crit.key} className="w-full md:w-1/3 bg-brand-card p-5 rounded-2xl border border-white/10 hover:border-brand-yellow/50 transition-all flex flex-col justify-between">
                <div className="mb-2">
                  <h4 className="font-festive text-sm font-bold text-white uppercase tracking-wider">{crit.title}</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{crit.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Challenges & Startups Showcase */}
      <FestivalChallengesSection onOpenCandidateForm={onOpenCandidateForm} />




      {/* Stands Section */}
      <section className="py-20 bg-brand-navy/80 border-t border-white/10 relative" id="stands">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block bg-brand-yellow text-black font-festive text-xs font-black px-4 py-1.5 rounded uppercase tracking-widest mb-3">
              Réservation d'Espaces & Stands 2027
            </div>
            <h2 className="font-festive text-3xl sm:text-5xl font-black text-white">CHOISISSEZ VOTRE TYPE DE STAND</h2>
            <p className="text-slate-400 text-sm mt-3">
              Des emplacements aménagés pour 6 jours de festival. Exposez vos créations gastronomiques, vos boissons et vos produits agroalimentaires devant des milliers de visiteurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* Stand 1: TAILLE L */}
            <div className="bg-brand-card rounded-3xl p-6 border border-white/10 hover:border-brand-yellow flex flex-col justify-between transition-all shadow-xl relative">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 h-6">
                  <span className="text-[11px] font-festive tracking-widest text-slate-400 uppercase">Classique</span>
                  <span className="text-[10px] bg-white/10 text-slate-300 font-bold px-2.5 py-0.5 rounded-full">2m x 2m</span>
                </div>

                <div className="h-14 flex items-center mb-3">
                  <h3 className="font-festive text-xl font-black text-white leading-snug">STAND TAILLE L</h3>
                </div>

                <div className="mb-5 h-16 flex flex-col justify-center">
                  <div>
                    <span className="font-festive text-3xl font-black text-brand-yellow">300 000</span>
                    <span className="text-slate-400 text-xs font-bold"> FCFA</span>
                  </div>
                  <span className="block text-[11px] text-slate-400 mt-0.5">Durée : 6 Jours complets</span>
                </div>

                <div className="space-y-5 text-xs">
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 h-16 flex flex-col justify-center">
                    <span className="text-brand-yellow font-bold block mb-0.5 text-[11px]">Formule</span>
                    <span className="text-slate-300 text-[11px] leading-tight">1 ou 2 au choix (À manger OU À boire)</span>
                  </div>

                  <div className="h-32 flex flex-col justify-start">
                    <span className="text-white font-bold block mb-1.5">Aménagements autorisés :</span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      <li>• 2 Salons (4 places) & 2 Tables</li>
                      <li>• 8 Places assises</li>
                      <li>• Tonnelle & table de 2m</li>
                      <li>• 3 Chaises sous tonnelle</li>
                    </ul>
                  </div>

                  <div className="h-32 flex flex-col justify-start">
                    <span className="text-white font-bold block mb-1.5">Équipement & Badges :</span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      <li>• 1 Ampoule & 1 Prise électrique</li>
                      <li>• 3 Badges exposants + 3 hôtesses</li>
                      <li>• 1 Visuel participant & vidéo</li>
                      <li>• 2 Appareils éléc. (Régulateur oblig.)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/2290148759596?text=Bonjour,%20je%20souhaite%20réserver%20un%20Stand%20Taille%20L"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block text-center py-3 bg-white/10 hover:bg-brand-yellow hover:text-black font-festive text-xs font-black tracking-wider text-white rounded-xl transition-all"
              >
                RÉSERVER CET EMPLACEMENT
              </a>
            </div>

            {/* Stand 2: FOODTRUCK & MOBIL BAR */}
            <div className="bg-brand-card rounded-3xl p-6 border border-white/10 hover:border-brand-lime flex flex-col justify-between transition-all shadow-xl relative">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 h-6">
                  <span className="text-[11px] font-festive tracking-widest text-brand-lime uppercase">Street Food & Bar</span>
                  <span className="text-[10px] bg-brand-lime/20 text-brand-lime font-bold px-2.5 py-0.5 rounded-full">3m x 3m</span>
                </div>

                <div className="h-14 flex items-center mb-3">
                  <h3 className="font-festive text-xl font-black text-white leading-snug">FOODTRUCK & MOBIL BAR</h3>
                </div>

                <div className="mb-5 h-16 flex flex-col justify-center">
                  <div>
                    <span className="font-festive text-3xl font-black text-brand-lime">300 000</span>
                    <span className="text-slate-400 text-xs font-bold"> FCFA</span>
                  </div>
                  <span className="block text-[11px] text-slate-400 mt-0.5">Durée : 6 Jours complets</span>
                </div>

                <div className="space-y-5 text-xs">
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 h-16 flex flex-col justify-center">
                    <span className="text-brand-lime font-bold block mb-0.5 text-[11px]">Formule</span>
                    <span className="text-slate-300 text-[11px] leading-tight">Possibilité d'allier À Manger & À Boire</span>
                  </div>

                  <div className="h-32 flex flex-col justify-start">
                    <span className="text-white font-bold block mb-1.5">Aménagements autorisés :</span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      <li>• 5 Manges-debout</li>
                      <li>• 10 Places avec chaises hautes</li>
                      <li>• Sacs poubelles inclus</li>
                      <li>• Emplacement dédié 3m x 3m</li>
                    </ul>
                  </div>

                  <div className="h-32 flex flex-col justify-start">
                    <span className="text-white font-bold block mb-1.5">Équipement & Badges :</span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      <li>• 1 Prise électrique</li>
                      <li>• 3 Badges exposants + 3 hôtesses</li>
                      <li>• 1 Visuel participant & vidéo</li>
                      <li>• 2 Appareils éléc. (Régulateur oblig.)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/2290148759596?text=Bonjour,%20je%20souhaite%20réserver%20un%20Stand%20Foodtruck%20/%20Mobil%20Bar"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block text-center py-3 bg-white/10 hover:bg-brand-lime hover:text-black font-festive text-xs font-black tracking-wider text-white rounded-xl transition-all"
              >
                RÉSERVER CET EMPLACEMENT
              </a>
            </div>

            {/* Stand 3: TAILLE XL */}
            <div className="bg-gradient-to-b from-brand-card to-brand-navy rounded-3xl p-6 border-2 border-brand-yellow shadow-neonYellow flex flex-col justify-between relative transition-all">
              <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-brand-yellow text-black font-festive text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow whitespace-nowrap z-10">
                Le Plus Demandé 🔥
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 h-6">
                  <span className="text-[11px] font-festive tracking-widest text-brand-yellow uppercase">Grand Confort</span>
                  <span className="text-[10px] bg-brand-yellow/20 text-brand-yellow font-bold px-2.5 py-0.5 rounded-full">3m x 3m</span>
                </div>

                <div className="h-14 flex items-center mb-3">
                  <h3 className="font-festive text-xl font-black text-white leading-snug">STAND TAILLE XL</h3>
                </div>

                <div className="mb-5 h-16 flex flex-col justify-center">
                  <div>
                    <span className="font-festive text-3xl font-black text-brand-yellow">400 000</span>
                    <span className="text-slate-400 text-xs font-bold"> FCFA</span>
                  </div>
                  <span className="block text-[11px] text-brand-yellow font-bold mt-0.5">Durée : 6 Jours complets</span>
                </div>

                <div className="space-y-5 text-xs">
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/10 h-16 flex flex-col justify-center">
                    <span className="text-brand-yellow font-bold block mb-0.5 text-[11px]">Formule</span>
                    <span className="text-slate-200 text-[11px] leading-tight">Possibilité d'allier À Manger & À Boire</span>
                  </div>

                  <div className="h-32 flex flex-col justify-start">
                    <span className="text-white font-bold block mb-1.5">Aménagements autorisés :</span>
                    <ul className="space-y-1 text-slate-200 text-[11px]">
                      <li>• 3 Salons de 4 places & 3 Tables</li>
                      <li>• 12 Places assises</li>
                      <li>• Tonnelle & table de 3m</li>
                      <li>• 5 Chaises sous tonnelle</li>
                    </ul>
                  </div>

                  <div className="h-32 flex flex-col justify-start">
                    <span className="text-white font-bold block mb-1.5">Équipement & Badges :</span>
                    <ul className="space-y-1 text-slate-200 text-[11px]">
                      <li>• 1 Ampoule & 1 Prise électrique</li>
                      <li>• 4 Badges exposants + 5 hôtesses</li>
                      <li>• 1 Visuel participant & vidéo</li>
                      <li>• 2 Appareils éléc. (Régulateur oblig.)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/2290148759596?text=Bonjour,%20je%20souhaite%20réserver%20un%20Stand%20Taille%20XL"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block text-center py-3 bg-brand-yellow hover:bg-brand-lime text-black font-festive text-xs font-black tracking-wider rounded-xl transition-all shadow-lg"
              >
                COMMANDER VIA WHATSAPP ➜
              </a>
            </div>

            {/* Stand 4: LOUNGE VIP PLEIN AIR */}
            <div className="bg-brand-card rounded-3xl p-6 border border-white/10 hover:border-brand-pink flex flex-col justify-between transition-all shadow-xl relative">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3 h-6">
                  <span className="text-[11px] font-festive tracking-widest text-brand-pink uppercase">Espace VIP</span>
                  <span className="text-[10px] bg-brand-pink/20 text-brand-pink font-bold px-2.5 py-0.5 rounded-full">6m x 6m</span>
                </div>

                <div className="h-14 flex items-center mb-3">
                  <h3 className="font-festive text-xl font-black text-white leading-snug">LOUNGE VIP PLEIN AIR</h3>
                </div>

                <div className="mb-5 h-16 flex flex-col justify-center">
                  <div>
                    <span className="font-festive text-3xl font-black text-brand-pink">500 000</span>
                    <span className="text-slate-400 text-xs font-bold"> FCFA</span>
                  </div>
                  <span className="block text-[11px] text-slate-400 mt-0.5">Durée : 6 Jours complets</span>
                </div>

                <div className="space-y-5 text-xs">
                  <div className="bg-black/30 p-2.5 rounded-xl border border-white/5 h-16 flex flex-col justify-center">
                    <span className="text-brand-pink font-bold block mb-0.5 text-[11px]">Formule VIP</span>
                    <span className="text-slate-300 text-[11px] leading-tight">Possibilité d'allier À Manger & À Boire</span>
                  </div>

                  <div className="h-32 flex flex-col justify-start">
                    <span className="text-white font-bold block mb-1.5">Aménagements autorisés :</span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      <li>• 8 Salons de 4 places & 8 Tables</li>
                      <li>• 32 Places canapés / fauteuils</li>
                      <li>• Espace XXL de 36 m²</li>
                      <li>• Disposition modulable plein air</li>
                    </ul>
                  </div>

                  <div className="h-32 flex flex-col justify-start">
                    <span className="text-white font-bold block mb-1.5">Équipement & Badges :</span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      <li>• 1 Prise électrique haute capacité</li>
                      <li>• 6 Badges exposants + 8 hôtesses</li>
                      <li>• 1 Visuel participant & vidéo</li>
                      <li>• 3 Appareils éléc. (Régulateur oblig.)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <a
                href="https://wa.me/2290148759596?text=Bonjour,%20je%20souhaite%20réserver%20un%20Lounge%20VIP"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block text-center py-3 bg-brand-pink hover:bg-white hover:text-black font-festive text-xs font-black tracking-wider text-white rounded-xl transition-all"
              >
                RÉSERVER LOUNGE VIP ★
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Showcase Section (Artistic Slanted Rays Gallery) */}
      <FestivalExperienceShowcase />

      {/* Footer */}
      <footer className="bg-black text-slate-300 pt-16 pb-12 border-t-2 border-brand-yellow" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10">
            
            {/* Col 1: Brand & Motto */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  alt="Eat & Drink Cotonou Festival Logo"
                  className="h-12 sm:h-14 w-auto object-contain"
                  src="/festival_logo.png"
                />
              </div>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
                Le festival emblématique de street food, d'art de vivre et d'innovation agroalimentaire de Cotonou.
              </p>
              <div className="font-festive text-xs sm:text-sm text-brand-yellow font-black tracking-wide">
                "GOOD FOOD, GOOD PEOPLE, GOOD VIBES, GOOD FUND"
              </div>
            </div>

            {/* Col 2: Assistance & Contacts */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="font-festive text-sm uppercase tracking-widest text-white font-black">
                ASSISTANCE & CONTACTS
              </h4>
              <p className="text-xs text-slate-400 leading-normal">
                Pour candidatures, réservations ou billetterie :
              </p>
              <div className="space-y-2.5 pt-1">
                <a
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-brand-yellow hover:text-black transition-all font-festive text-sm font-bold text-white border border-white/5"
                  href="tel:+2290148759596"
                >
                  <Phone size={16} className="text-emerald-400 shrink-0" />
                  <span>+229 01 48 75 95 96</span>
                </a>
                <a
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-brand-yellow hover:text-black transition-all font-festive text-sm font-bold text-white border border-white/5"
                  href="tel:+2290195464694"
                >
                  <Phone size={16} className="text-brand-cyan shrink-0" />
                  <span>+229 01 95 46 46 94</span>
                </a>
              </div>
            </div>

            {/* Col 3: Social Media Links */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="font-festive text-sm uppercase tracking-widest text-white font-black">
                NOS RÉSEAUX SOCIAUX
              </h4>
              <p className="text-xs text-slate-400 leading-normal">
                Rejoignez la communauté Eat & Drink :
              </p>
              <div className="space-y-2.5 pt-1">
                <a
                  href="https://www.instagram.com/p/DUWCfUyDBIW/?img_index=2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-white transition-all text-xs font-bold border border-white/5 group"
                >
                  <InstagramIcon size={18} className="text-pink-400 group-hover:text-white shrink-0" />
                  <span>Instagram Officiel</span>
                </a>
                <a
                  href="https://www.facebook.com/EatDrinkCotonou"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-blue-600 text-white transition-all text-xs font-bold border border-white/5 group"
                >
                  <FacebookIcon size={18} className="text-blue-400 group-hover:text-white shrink-0" />
                  <span>Facebook Officiel</span>
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 text-center sm:text-left">
            <div>
              © 2027 <strong className="text-slate-200">EAT & DRINK FESTIVAL</strong> — HARLEN
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

