import React from 'react';
import { useFestivalExperience } from '../hooks/useFestivalExperience';
import type { FestivalExperience } from '../types';
import { Sparkles, Camera, Utensils, GlassWater, Flame, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * Composant d'affichage artistique en éventail diagonal des expériences du festival.
 * Reproduit la composition visuelle en rayons inclinés avec slogans le long des bordures.
 */
export const FestivalExperienceShowcase: React.FC = () => {
  const { experiences, loading, error, activeId, setActiveId } = useFestivalExperience();

  return (
    <section className="py-20 bg-gradient-to-b from-brand-navy/90 via-slate-950 to-black text-white relative overflow-hidden border-t-2 border-brand-yellow/30">
      {/* Glow background ambiance */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-orange/10 blur-[130px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/40 text-brand-yellow font-festive text-xs font-black uppercase tracking-widest mb-3">
            <Sparkles size={14} /> Galerie d'Atmosphères 2027
          </div>
          <h2 className="font-festive text-3xl sm:text-5xl font-black text-white tracking-tight">
            L'ÉVENTAIL DES EXPÉRIENCES
          </h2>
          <p className="text-slate-300 text-sm mt-3 leading-relaxed">
            Plongez au cœur des 4 piliers du festival. Survolez ou cliquez sur les rayons visuels pour révéler chaque atmosphère !
          </p>
        </div>

        {/* État 1 : Chargement */}
        {loading && (
          <div className="h-[450px] flex items-center justify-center">
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

        {/* État 3 : Galerie en éventail artistique (Composition Slanted Rays) */}
        {!loading && !error && experiences.length > 0 && (
          <div className="relative max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3 h-auto md:h-[620px] items-stretch relative rounded-3xl overflow-hidden p-3 bg-black/60 border-2 border-white/10 shadow-2xl backdrop-blur-md">
              {experiences.map((exp: FestivalExperience, index: number) => {
                const isActive = activeId === exp.id;

                // Angle d'inclinaison appliqué uniquement sur grand écran
                const skewClass =
                  index === 0
                    ? 'skew-x-0 md:-skew-x-6'
                    : index === 1
                    ? 'skew-x-0 md:-skew-x-2'
                    : index === 2
                    ? 'skew-x-0 md:skew-x-2'
                    : 'skew-x-0 md:skew-x-6';

                return (
                  <div
                    key={exp.id}
                    onMouseEnter={() => setActiveId(exp.id)}
                    onClick={() => setActiveId(exp.id)}
                    className={`relative h-[220px] md:h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 transform group ${skewClass} ${
                      isActive
                        ? 'ring-2 ring-brand-yellow shadow-2xl scale-[1.02] z-20'
                        : 'opacity-90 hover:opacity-100 hover:scale-[1.01] z-10'
                    }`}
                  >
                    {/* Image principale dé-skewée pour conserver la verticalité */}
                    <div className="absolute inset-0 w-full h-full transform scale-105 md:scale-125">
                      <img
                        src={exp.imageUrl}
                        alt={exp.title}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    </div>

                    {/* Texte Incliné sur le bord (Slogan en rayure verticale) */}
                    <div className="absolute top-12 left-4 z-20 hidden lg:block transform -rotate-90 origin-top-left pointer-events-none">
                      <span className="font-festive font-black text-xs uppercase tracking-widest text-white/80 bg-black/50 px-3 py-1 rounded-full border border-white/20 whitespace-nowrap shadow-lg">
                        {exp.slogan}
                      </span>
                    </div>

                    {/* Contenu Inférieur de la tranche */}
                    <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-20 flex flex-col justify-end">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider text-white bg-gradient-to-r ${exp.badgeColor} w-max mb-2 shadow-md`}
                      >
                        {exp.category}
                      </span>

                      <h3 className="font-festive text-base sm:text-xl font-black text-white leading-tight group-hover:text-brand-yellow transition-colors">
                        {exp.title}
                      </h3>

                      <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                        {exp.slogan}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Élément central focal en bas (Objectif Appareil/Emblème comme le modèle) */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-black/90 p-3 rounded-full border-2 border-brand-yellow shadow-neonYellow hidden md:flex items-center justify-center">
                <Camera className="w-7 h-7 text-brand-yellow animate-pulse" />
              </div>
            </div>

            {/* Légende sous l'éventail */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-bold text-center">
              <span className="flex items-center gap-2">
                <Utensils size={14} className="text-amber-400" /> Ambiance & Good Vibes
              </span>
              <span className="flex items-center gap-2">
                <Sparkles size={14} className="text-pink-400" /> Communauté & Lifestyle
              </span>
              <span className="flex items-center gap-2">
                <GlassWater size={14} className="text-purple-400" /> Détente & Bars VIP
              </span>
              <span className="flex items-center gap-2">
                <Flame size={14} className="text-cyan-400" /> Shows DJs & Concerts Live
              </span>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};
