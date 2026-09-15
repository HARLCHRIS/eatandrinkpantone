import React from 'react';
import { useFestivalChallenges } from '../hooks/useFestivalChallenges';
import { useIsMobile } from '../hooks/useIsMobile';
import type { FestivalChallenge } from '../types';
import {
  Trophy,
  Utensils,
  Music,
  Sparkles,
  Globe,
  Share2,
  ChefHat,
  Wine,
  PlusCircle,
  Award,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface FestivalChallengesSectionProps {
  onOpenCandidateForm: () => void;
}

/**
 * Retourne l'icône Lucide correspondant au défi donné.
 *
 * @param {string} id - Identifiant unique du défi.
 * @returns {React.ReactElement} Composant Icône React.
 */
function getChallengeIcon(id: string): React.ReactElement {
  switch (id) {
    case 'food-lover':
      return <Utensils className="w-6 h-6 text-amber-400" />;
    case 'young-urban':
      return <Sparkles className="w-6 h-6 text-orange-400" />;
    case 'dj-challenge':
      return <Music className="w-6 h-6 text-purple-400" />;
    case 'pitch-challenge':
      return <Trophy className="w-6 h-6 text-yellow-400" />;
    case 'touriste-international':
      return <Globe className="w-6 h-6 text-blue-400" />;
    case 'influenceur-annee':
      return <Share2 className="w-6 h-6 text-pink-400" />;
    case 'louche-dor':
      return <ChefHat className="w-6 h-6 text-yellow-300" />;
    case 'master-cocktail':
      return <Wine className="w-6 h-6 text-teal-400" />;
    default:
      return <Award className="w-6 h-6 text-brand-yellow" />;
  }
}

/**
 * Composant de section affichant les 8 Défis & Tournois Officiels 2027 du Eat & Drink Festival Cotonou.
 * Présenté sous le format carrousel 3D Coverflow (cartes empilées en perspective avec carte centrale en évidence).
 *
 * @param {FestivalChallengesSectionProps} props - Propriétés du composant.
 */
export const FestivalChallengesSection: React.FC<FestivalChallengesSectionProps> = ({
  onOpenCandidateForm,
}) => {
  const {
    filteredChallenges,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    activeIndex,
    setActiveIndex,
    nextChallenge,
    prevChallenge,
  } = useFestivalChallenges();

  const { isMobile } = useIsMobile(640);

  const CATEGORIES = [
    { key: 'TOUS', label: 'Tous les Défis (8)' },
    { key: 'INNOVATION', label: 'Innovation Agro' },
    { key: 'GASTRONOMIE', label: 'Food & Drinks' },
    { key: 'CULTURE', label: 'Lifestyle & Musique' },
  ];

  return (
    <section
      className="py-16 sm:py-20 bg-brand-navy/80 relative border-t border-white/10 overflow-hidden px-1 sm:px-4"
      id="challenges"
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-yellow/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête de section */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 px-2">
          <span className="px-4 py-1.5 bg-brand-orange text-white font-festive text-xs rounded-full uppercase tracking-widest font-black inline-block mb-3 shadow-md">
            Compétitions Officielles 2027
          </span>
          <h2 className="font-festive text-xl xs:text-3xl sm:text-5xl font-black text-white tracking-tight">
            DÉFIS & TOURNOIS 2027
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
            Faites défiler le carrousel pour découvrir les 8 compétitions officielles du festival Eat & Drink Cotonou !
          </p>

          {/* Filtres de catégories */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-5 sm:mt-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-festive text-[11px] sm:text-xs font-black transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-brand-yellow text-black shadow-lg shadow-yellow-500/20 scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* État 1 : Chargement */}
        {loading && (
          <div className="h-[480px] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* État 2 : Erreur */}
        {error && !loading && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-6 text-center text-red-200 my-8">
            <AlertCircle className="w-10 h-10 mx-auto text-red-400 mb-2" />
            <p className="font-bold text-base">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2"
            >
              <RefreshCw size={14} /> Réessayer
            </button>
          </div>
        )}

        {/* État 3 : Succès - Carrousel 3D Coverflow */}
        {!loading && !error && filteredChallenges.length > 0 && (
          <div className="relative pt-2 sm:pt-4 pb-8 sm:pb-12">
            {/* Flèches de Navigation Flottantes */}
            <button
              onClick={prevChallenge}
              aria-label="Défi précédent"
              className="absolute left-0 xs:left-1 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-brand-yellow text-white hover:text-black border border-white/30 hover:border-brand-yellow flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-md group"
            >
              <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <button
              onClick={nextChallenge}
              aria-label="Défi suivant"
              className="absolute right-0 xs:right-1 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-black/80 hover:bg-brand-yellow text-white hover:text-black border border-white/30 hover:border-brand-yellow flex items-center justify-center transition-all duration-300 shadow-2xl backdrop-blur-md group"
            >
              <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Conteneur 3D Coverflow Stack */}
            <div className="relative h-[530px] sm:h-[600px] max-w-5xl mx-auto flex items-center justify-center overflow-visible">
              {filteredChallenges.map((challenge: FestivalChallenge, index: number) => {
                const total = filteredChallenges.length;
                let offset = index - activeIndex;

                // Ajustement cyclique pour obtenir le plus court chemin (-1, 0, 1)
                if (offset > total / 2) offset -= total;
                if (offset < -total / 2) offset += total;

                const isCenter = offset === 0;
                const isHidden = Math.abs(offset) > 2;

                if (isHidden) return null;

                // Calcul du style 3D adapté mobile / desktop
                let scale = 1;
                let opacity = 1;
                let translateX = '0%';
                let zIndex = 30;
                let rotateY = '0deg';

                if (isCenter) {
                  scale = isMobile ? 1 : 1.02;
                  opacity = 1;
                  translateX = '0%';
                  zIndex = 30;
                  rotateY = '0deg';
                } else if (offset === -1) {
                  scale = isMobile ? 0.82 : 0.86;
                  opacity = isMobile ? 0.5 : 0.75;
                  translateX = isMobile ? '-20%' : '-45%';
                  zIndex = 20;
                  rotateY = isMobile ? '8deg' : '12deg';
                } else if (offset === 1) {
                  scale = isMobile ? 0.82 : 0.86;
                  opacity = isMobile ? 0.5 : 0.75;
                  translateX = isMobile ? '20%' : '45%';
                  zIndex = 20;
                  rotateY = isMobile ? '-8deg' : '-12deg';
                } else if (offset === -2) {
                  scale = isMobile ? 0.65 : 0.72;
                  opacity = isMobile ? 0.15 : 0.35;
                  translateX = isMobile ? '-38%' : '-85%';
                  zIndex = 10;
                  rotateY = isMobile ? '12deg' : '20deg';
                } else if (offset === 2) {
                  scale = isMobile ? 0.65 : 0.72;
                  opacity = isMobile ? 0.15 : 0.35;
                  translateX = isMobile ? '38%' : '85%';
                  zIndex = 10;
                  rotateY = isMobile ? '-12deg' : '-20deg';
                }

                const isPitch = challenge.isPitchChallenge;

                return (
                  <div
                    key={challenge.id}
                    onClick={() => setActiveIndex(index)}
                    style={{
                      transform: `translate3d(${translateX}, 0, 0) scale(${scale}) rotateY(${rotateY})`,
                      zIndex,
                      opacity,
                    }}
                    className={`absolute w-[88%] xs:w-[90%] sm:w-[400px] max-w-[290px] xs:max-w-[330px] sm:max-w-[400px] rounded-3xl p-4 xs:p-5 sm:p-7 border transition-all duration-500 ease-out shadow-2xl flex flex-col justify-between cursor-pointer select-none overflow-hidden ${
                      isCenter
                        ? isPitch
                          ? 'bg-gradient-to-br from-brand-card via-slate-900 to-slate-950 border-2 border-brand-yellow ring-4 ring-brand-yellow/30 shadow-yellow-500/20'
                          : 'bg-gradient-to-br from-brand-card via-slate-900 to-brand-navy border-2 border-white/30 shadow-2xl'
                        : 'bg-brand-card/90 border-white/10 hover:border-white/30 pointer-events-auto'
                    }`}
                  >
                    {/* Badge Tag supérieur droit ajusté sans débordement */}
                    <div className="absolute top-0 right-0 bg-brand-yellow text-black font-festive text-[10px] xs:text-xs font-black px-3 py-1 xs:px-4 xs:py-1.5 rounded-bl-2xl rounded-tr-3xl uppercase shadow-md z-10">
                      {challenge.badgeTag}
                    </div>

                    <div>
                      {/* BANIÈRE GRAND LOGO DE DÉFI */}
                      <div
                        className={`rounded-2xl p-4 sm:p-5 mb-3 sm:mb-5 shadow-inner flex items-center justify-center h-36 xs:h-40 sm:h-44 w-full relative overflow-hidden transition-all duration-300 ${
                          ['louche-dor', 'master-cocktail'].includes(challenge.id)
                            ? 'bg-gradient-to-br from-black via-slate-950 to-slate-900 border border-amber-500/30'
                            : 'bg-white border border-white/20'
                        }`}
                      >
                        {challenge.imageUrl ? (
                          <img
                            src={challenge.imageUrl}
                            alt={`${challenge.title} Logo`}
                            className="max-h-full max-w-full object-contain filter drop-shadow-md"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-3 sm:p-4">
                            <div className="p-2.5 sm:p-3 bg-brand-yellow/10 rounded-2xl mb-2">
                              {getChallengeIcon(challenge.id)}
                            </div>
                            <span className="font-festive font-black text-slate-800 text-base sm:text-lg leading-tight">
                              {challenge.title}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* En-tête Titre & Subtitle */}
                      <div className="flex items-center gap-1.5 xs:gap-2 mb-1">
                        <span className="font-festive font-black text-brand-yellow text-[10px] xs:text-[11px] px-2 py-0.5 rounded bg-black/40 border border-white/10 uppercase tracking-widest shrink-0">
                          DÉFI #{challenge.number}
                        </span>
                        <span className="text-[11px] sm:text-xs text-brand-lime font-bold truncate">
                          • {challenge.subtitle}
                        </span>
                      </div>

                      <h3 className="font-festive text-lg xs:text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
                        {challenge.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-4">
                        {challenge.description}
                      </p>

                      {/* Détails Prix & Objectif */}
                      <div className="grid grid-cols-1 gap-2 mb-3 sm:mb-4">
                        <div className="bg-black/50 p-2.5 sm:p-3 rounded-xl border border-white/10 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] sm:text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                              Récompense / Prix :
                            </span>
                            <span className="text-[11px] xs:text-xs sm:text-sm font-black text-brand-yellow leading-snug">
                              {challenge.reward}
                            </span>
                          </div>
                          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-brand-yellow shrink-0 ml-2" />
                        </div>
                      </div>
                    </div>

                    {/* Pied de Carte / Actions */}
                    {isCenter && (
                      <div className="pt-2.5 sm:pt-3 border-t border-white/10">
                        {isPitch ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenCandidateForm();
                            }}
                            className="w-full py-2.5 sm:py-3 bg-brand-yellow hover:bg-white text-black font-festive text-[11px] sm:text-xs font-black rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                            <PlusCircle size={15} /> POSTULER MAINTENANT (1000K)
                          </button>
                        ) : (
                          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 font-bold px-1">
                            <span>Festival Janvier 2027</span>
                            <span className="text-brand-yellow">Ouvert aux Festivaliers</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Puces et Sélecteur de Cartes (Thumbnails du bas non rognés) */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 mt-5 sm:mt-6 flex-wrap px-2">
              {filteredChallenges.map((challenge: FestivalChallenge, idx: number) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={challenge.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`px-2 py-1 xs:px-2.5 xs:py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-festive font-black transition-all flex items-center gap-1 ${
                      isActive
                        ? 'bg-brand-yellow text-black shadow-md scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-slate-300 border border-white/10'
                    }`}
                  >
                    <span>#{challenge.number}</span>
                    <span className="hidden sm:inline">{challenge.title.replace(/^\d+-\s*/, '')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

