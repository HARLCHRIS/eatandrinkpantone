import { useState, useEffect } from 'react';
import type { FestivalChallenge } from '../types';


/**
 * Liste officielle des 8 Défis et Tournois du Eat & Drink Festival Cotonou 2027.
 */
const FESTIVAL_CHALLENGES_DATA: FestivalChallenge[] = [
  {
    id: 'food-lover',
    number: 1,
    title: 'LE FOOD LOVER',
    subtitle: 'Consommateur & Gourmand du Festival',
    description: "Le profil du festivalier présent tous les jours du festival et plus gros consommateur auprès des commerçants. L'abonné ayant PARCOURU LE MAXIMUM DE RESTAURANTS.",
    reward: 'Trophée + 100.000 FCFA + divers lots',
    objective: 'Motiver les festivaliers à la consommation - fidéliser les festivaliers sur 6 jours - forte présence virtuelle des festivaliers participant au foodlover challenge.',
    badgeTag: 'Défi Gourmand',
    badgeColor: 'from-amber-500 to-orange-600',
    imageUrl: '/food_lover_logo.jpg',
  },
  {
    id: 'young-urban',
    number: 2,
    title: 'LE YOUNG URBAN',
    subtitle: 'Festivalier le plus IN & Lifestyle',
    description: 'Le festivalier le plus IN et qui marque sa présence tous les jours du festival. Six jours de festival, 6 Moods impressionnants. Entre danse et lifestyle le festivalier qui cumulera le plus de vues/likes est récompensé.',
    reward: 'Trophée + 100.000 FCFA + divers lots',
    objective: 'Créer une hype autour du festival avec un engouement grandissant chaque jour.',
    badgeTag: 'Lifestyle & Hype',
    badgeColor: 'from-orange-500 to-amber-600',
    imageUrl: '/young_urban_logo.jpg',
  },

  {
    id: 'dj-challenge',
    number: 3,
    title: 'LES DAYS PARTIES (DJ CHALLENGE)',
    subtitle: 'Compétition Jeunes Talents DJ',
    description: "Les jeunes talents DJ font désormais partie de l'ADN du festival. Créneaux privilégiés de découverte, prime et signature de contrats pour une première expérience sur grande scène, les Days Parties sont ouverts aux DJ. Une compétition libre d'accès sur un espace ouvert avec vote du public et avis de jury. De mini-événements pris d'assaut par un public averti.",
    reward: 'Trophée + 100.000 FCFA + contrat de prestation sur le festival',
    objective: "Révéler et entretenir une pépinière d'artistes DJ.",
    badgeTag: 'Musique & Scène',
    badgeColor: 'from-purple-600 to-pink-600',
    imageUrl: '/days_parties_dj_logo.png',
  },
  {
    id: 'pitch-challenge',
    number: 4,
    title: 'LE PITCH CHALLENGE',
    subtitle: 'Grand Concours Agroalimentaire 2027',
    description: "Fait appel à tout jeune entrepreneur ayant une idée ou une activité naissante avec un besoin réel de financement. L'Entrepreneur de l'année est donc le vainqueur des PITCH CHALLENGES.",
    reward: 'Trophée + 1.000.000 FCFA + divers lots + stand gratuit',
    objective: "Impacter l'écosystème entrepreneurial, former et assister les porteurs de projets agroalimentaires de demain.",
    badgeTag: 'Tremplin Innovation (1 M FCFA)',
    badgeColor: 'from-yellow-400 to-amber-500',
    imageUrl: '/pitch_challenge_logo.jpg',
    isPitchChallenge: true,
  },
  {
    id: 'touriste-international',
    number: 5,
    title: 'LE TOURISTE / VISITEUR INTERNATIONAL',
    subtitle: 'Ambassadeur Diaspora & International',
    description: 'Le festivalier étranger ou de la diaspora qui fait rayonner les couleurs du festival sur ses canaux digitaux.',
    reward: 'Trophée + 100.000 FCFA + divers lots + circuit touristique Cotonou',
    objective: 'Attirer plus de curieux et de visiteurs internationaux sur le festival et de facto sur la ville de Cotonou.',
    badgeTag: 'Rayonnement Global',
    badgeColor: 'from-blue-500 to-cyan-600',
    imageUrl: '/touriste_international_logo.jpg',
  },
  {
    id: 'influenceur-annee',
    number: 6,
    title: "L'INFLUENCEUR DE L'ANNÉE",
    subtitle: 'Impact & Portée Digitale',
    description: "L'influenceur ayant le plus d'impact sur ses abonnés.",
    reward: 'Trophée + 100.000 FCFA + divers lots',
    objective: 'Maximiser les statistiques des vues et insights sur la période du festival sur nos comptes.',
    badgeTag: 'Influence & Création',
    badgeColor: 'from-pink-500 to-rose-600',
    imageUrl: '/influenceur_annee_logo.jpg',
  },
  {
    id: 'louche-dor',
    number: 7,
    title: 'LA LOUCHE D’OR',
    subtitle: 'Restaurateur de l’Année',
    description: 'Le restaurateur de l’année. Un vote est ouvert aux festivaliers qui désignent le meilleur restaurant.',
    reward: 'Trophée + 100.000 FCFA + divers lots',
    objective: 'Motiver les restaurants à plus de professionnalisme et de créativité afin d’épater le client.',
    badgeTag: 'Haute Gastronomie',
    badgeColor: 'from-amber-400 to-yellow-600',
    imageUrl: '/louche_dor_logo.jpg',
  },
  {
    id: 'master-cocktail',
    number: 8,
    title: 'LE MASTER COCKTAIL',
    subtitle: 'Meilleur Bar & Barman du Festival',
    description: 'Le meilleur bar/barman du festival. Sur le site du festival un vote est ouvert aux festivaliers ou un point de vote sur site.',
    reward: 'Trophée + 100.000 FCFA + divers lots',
    objective: 'Motiver les barmen à concocter des cocktails explosifs.',
    badgeTag: 'Mixologie & Bars',
    badgeColor: 'from-emerald-500 to-teal-600',
    imageUrl: '/master_cocktail_logo.png',
  },

];

export interface UseFestivalChallengesReturn {
  challenges: FestivalChallenge[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  filteredChallenges: FestivalChallenge[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  nextChallenge: () => void;
  prevChallenge: () => void;
}

/**
 * Hook personnalisé gérant la liste des 8 défis et tournois officiels du festival.
 * Gère la navigation 3D Coverflow, le carrousel ainsi que les états loading, success et error.
 *
 * @returns {UseFestivalChallengesReturn} Objet d'état, filtres et navigation carrousel des défis.
 */
export function useFestivalChallenges(): UseFestivalChallengesReturn {
  const [challenges, setChallenges] = useState<FestivalChallenge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('TOUS');
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    // Simulation de chargement asynchrone sécurisé avec gestion des états
    setLoading(true);
    setError(null);
    try {
      setChallenges(FESTIVAL_CHALLENGES_DATA);
      setLoading(false);
    } catch (err) {
      setError("Impossible de charger les défis du festival.");
      setLoading(false);
    }
  }, []);

  const filteredChallenges = challenges.filter((challenge) => {
    if (selectedCategory === 'TOUS') return true;
    if (selectedCategory === 'GASTRONOMIE') return ['food-lover', 'louche-dor', 'master-cocktail'].includes(challenge.id);
    if (selectedCategory === 'INNOVATION') return challenge.isPitchChallenge;
    if (selectedCategory === 'CULTURE') return ['young-urban', 'dj-challenge', 'touriste-international', 'influenceur-annee'].includes(challenge.id);
    return true;
  });

  const nextChallenge = () => {
    if (filteredChallenges.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % filteredChallenges.length);
  };

  const prevChallenge = () => {
    if (filteredChallenges.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + filteredChallenges.length) % filteredChallenges.length);
  };

  return {
    challenges,
    loading,
    error,
    selectedCategory,
    setSelectedCategory: (cat: string) => {
      setSelectedCategory(cat);
      setActiveIndex(0);
    },
    filteredChallenges,
    activeIndex,
    setActiveIndex,
    nextChallenge,
    prevChallenge,
  };
}

