import React from 'react';
import { Trophy, Target, Users, Award, Gift, Handshake, ArrowRight } from 'lucide-react';

export interface PrizeItem {
  rank: string;
  badge: string;
  amount: string;
  stand: string;
  details: string;
  borderColor: string;
  badgeBg: string;
  textColor: string;
}

const PRIZES: PrizeItem[] = [
  {
    rank: '🥇 1er Prix',
    badge: 'GRAND GAGNANT',
    amount: '1 000 000 FCFA',
    stand: '1 Stand XL Offert',
    details: 'Lots partenaires exclusifs & haute visibilité media',
    borderColor: 'border-brand-yellow shadow-neonYellow',
    badgeBg: 'bg-brand-yellow text-slate-950',
    textColor: 'text-brand-yellow',
  },
  {
    rank: '🥈 2e Prix',
    badge: 'DEUXIÈME PLACE',
    amount: '500 000 FCFA',
    stand: '1 Stand L Offert',
    details: 'Lots partenaires & accompagnement sur mesure',
    borderColor: 'border-brand-cyan/60 hover:border-brand-cyan',
    badgeBg: 'bg-brand-cyan text-slate-950',
    textColor: 'text-brand-cyan',
  },
  {
    rank: '🥉 3e Prix',
    badge: 'TROISIÈME PLACE',
    amount: '1 Stand XL Offert',
    stand: 'Lots partenaires inclus',
    details: 'Mise en réseau officielle & opportunités d’exposition',
    borderColor: 'border-brand-orange/60 hover:border-brand-orange',
    badgeBg: 'bg-brand-orange text-slate-950',
    textColor: 'text-brand-orange',
  },
];

const STEPS = [
  { step: '01', title: 'Appel à projets', desc: '18 projets sélectionnés par le comité' },
  { step: '02', title: 'Formation & Master Class', desc: 'Accompagnement et coaching intensif' },
  { step: '03', title: '3 Sessions de Pitch', desc: 'Présentation devant jury → 9 finalistes' },
  { step: '04', title: 'Grande Finale', desc: 'Pitch ultime & sacre des 3 gagnants' },
];

/**
 * Composant de présentation complète du Eat & Drink Startups Challenge.
 * Met en valeur les objectifs, le ciblage, le calendrier des étapes, la grille des prix et l'offre partenaires.
 *
 * @returns {React.ReactElement} Section d'information mise en valeur.
 */
export const StartupChallengeSummarySection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-brand-dark via-brand-navy to-brand-dark relative overflow-hidden border-b border-white/10" id="challenge-resume">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-yellow/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-pink/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/40 text-brand-yellow font-festive text-xs font-black tracking-widest uppercase shadow">
            <Trophy size={14} className="text-brand-yellow" />
            <span>RÉSUMÉ COMPLET</span>
          </div>
          <h2 className="font-festive text-3xl sm:text-5xl font-black text-white tracking-tight">
            EAT & DRINK <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-yellow via-brand-lime to-brand-cyan">STARTUPS CHALLENGE</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Tout savoir sur la grande compétition de pitch dédiée aux créateurs et innovateurs de l'agroalimentaire.
          </p>
        </div>

        {/* 2 Main Cards: C'est quoi ? & Pour qui ? */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: C'est quoi ? */}
          <div className="bg-brand-card/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-4 hover:border-brand-yellow/50 transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/30 group-hover:scale-110 transition-transform">
                <Target size={26} />
              </div>
              <h3 className="font-festive text-xl sm:text-2xl font-black text-white">C’est quoi ?</h3>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Une <strong className="text-brand-yellow font-bold">compétition de pitch haut niveau</strong> qui met en lumière et propulse les jeunes projets innovants dans l’agrobusiness et l’écosystème entrepreneurial local.
            </p>
          </div>

          {/* Card 2: Pour qui ? */}
          <div className="bg-brand-card/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-4 hover:border-brand-lime/50 transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-brand-lime/10 text-brand-lime border border-brand-lime/30 group-hover:scale-110 transition-transform">
                <Users size={26} />
              </div>
              <h3 className="font-festive text-xl sm:text-2xl font-black text-white">Pour qui ?</h3>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Dédiée aux <strong className="text-brand-lime font-bold">jeunes innovateurs, entrepreneurs et startups</strong> de l’agroalimentaire, depuis le stade d’idée jusqu’à la phase de croissance établie.
            </p>
          </div>
        </div>

        {/* Timeline Pipeline: Déroulement */}
        <div className="bg-black/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Award className="text-brand-cyan" size={24} />
            <h3 className="font-festive text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
              Déroulement de la Compétition
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {STEPS.map((item, index) => (
              <div key={item.step} className="bg-brand-navy/90 p-5 rounded-2xl border border-white/10 space-y-2 relative group hover:border-brand-cyan/50 transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-festive text-2xl font-black text-brand-cyan">{item.step}</span>
                  {index < STEPS.length - 1 && (
                    <ArrowRight size={16} className="text-slate-500 hidden lg:block" />
                  )}
                </div>
                <h4 className="font-festive text-sm sm:text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prizes Section: Ce que gagnent les 3 premiers */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-brand-yellow font-festive text-xs font-bold uppercase tracking-widest">
              <Gift size={16} /> RECOMPENSES & DOTATIONS
            </div>
            <h3 className="font-festive text-2xl sm:text-4xl font-black text-white">
              🏆 Ce que gagnent les 3 premiers
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PRIZES.map((prize) => (
              <div
                key={prize.rank}
                className={`bg-brand-card p-6 sm:p-8 rounded-3xl border-2 ${prize.borderColor} flex flex-col justify-between space-y-6 transition-all transform hover:-translate-y-1`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-festive text-xl font-black text-white">{prize.rank}</span>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${prize.badgeBg}`}>
                      {prize.badge}
                    </span>
                  </div>

                  <div>
                    <div className={`font-festive text-3xl sm:text-4xl font-black ${prize.textColor}`}>
                      {prize.amount}
                    </div>
                    <div className="text-xs font-bold text-slate-200 mt-1 flex items-center gap-1.5">
                      <span className="text-brand-lime">✓</span> {prize.stand}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed border-t border-white/10 pt-3">
                    {prize.details}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl text-left text-xs sm:text-sm text-slate-200">
            ✨ <strong className="text-brand-yellow">Cérémonie de remise :</strong> Les lots sont remis officiellement pendant le Eat & Drink Festival, offrant une visibilité médiatique et publique maximale aux partenaires et aux lauréats.
          </div>
        </div>

        {/* Benefits for Partners */}
        <div className="bg-gradient-to-r from-brand-card via-brand-navy to-brand-card p-6 sm:p-8 rounded-3xl border-2 border-brand-lime/40 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-lime/10 text-brand-lime rounded-2xl border border-brand-lime/30">
              <Handshake size={24} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-brand-lime uppercase tracking-widest">OPPORTUNITÉS SPONSORS</span>
              <h3 className="font-festive text-xl sm:text-2xl font-black text-white">Pour les Partenaires</h3>
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Le challenge permet aux entreprises et institutions partenaires de <strong className="text-white">gagner en visibilité à forte audience</strong>, d’associer leur marque aux valeurs d’avenir (jeunesse, créativité et gastronomie), de développer des collaborations stratégiques, de tester le marché en direct et de réaliser du sourcing de pépites agroalimentaires.
          </p>
        </div>

      </div>
    </section>
  );
};
