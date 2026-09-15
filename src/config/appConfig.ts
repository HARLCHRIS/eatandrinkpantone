import type { CompetitionConfig, CriteriaDefinition } from '../types';

/**
 * Configuration par défaut du Concours Entrepreneurial Agroalimentaire du Festival.
 * Tous ces champs peuvent être modifiés dynamiquement depuis le Dashboard Administrateur.
 */
export const DEFAULT_COMPETITION_CONFIG: CompetitionConfig = {
  festivalName: 'Festival Agro-Innovation Bénin 2026',
  organizerName: 'Comité d\'Organisation du Festival & Partenaires Agro',
  prizeAmountFCFA: 1000000,

  launchDate: '2026-09-15T00:00:00Z',
  closingDate: '2026-10-31T23:59:59Z',
  pitchDate: '2026-11-10T09:00:00Z',
  awardCeremonyDate: '2026-11-28T16:00:00Z',
  location: 'Cotonou & Parakou, Bénin',
  contactEmail: 'concours@festival-agro-benin.bj',
  contactPhone: '+229 97 00 11 22 / +229 95 33 44 55',
  contactAddress: 'Haute Académie de l\'Innovation Agroalimentaire, Cotonou, Bénin',
};

/**
 * Grille officielle de sélection sur 100 points.
 * Chaque critère est évalué de 0 à 10 par le jury puis pondéré par son coefficient maximal.
 */
export const SELECTION_CRITERIA: CriteriaDefinition[] = [
  {
    key: 'problemRelevance',
    title: 'Pertinence du problème',
    maxPoints: 15,
    description:
      'L\'entreprise répond-elle à un besoin réel, documenté et prioritaire du secteur agroalimentaire béninois ?',
  },
  {
    key: 'innovation',
    title: 'Innovation / Différenciation',
    maxPoints: 15,
    description:
      'Originalité de la solution, procédé de transformation, conservation, packaging ou modèle d\'affaires inédit.',
  },
  {
    key: 'commercialPotential',
    title: 'Potentiel commercial',
    maxPoints: 20,
    description:
      'Taille du marché cible, capacité à générer des revenus récurrents, scalabilité et rentabilité financière.',
  },
  {
    key: 'localEconomicImpact',
    title: 'Impact économique et local',
    maxPoints: 15,
    description:
      'Valorisation des filières locales, création d\'emplois directs/indirects, réduction des pertes post-récolte.',
  },
  {
    key: 'feasibility',
    title: 'Faisabilité & Réalisme',
    maxPoints: 15,
    description:
      'Plan d\'exécution solide, compétences techniques pour fabriquer le produit et viabilité réglementaire/sanitaire.',
  },
  {
    key: 'traction',
    title: 'Traction & Résultats obtenus',
    maxPoints: 10,
    description:
      'Prototypes testés, premiers clients payants, ventes réalisées, preuves de marché déjà établies.',
  },
  {
    key: 'founderQuality',
    title: 'Qualité du porteur de projet',
    maxPoints: 10,
    description:
      'Engagement, vision, leadership, maîtrise de son domaine et capacité à exécuter efficacement la dotation.',
  },
];
