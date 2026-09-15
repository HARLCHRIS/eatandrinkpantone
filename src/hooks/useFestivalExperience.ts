import { useState, useEffect } from 'react';
import type { FestivalExperience } from '../types';

/**
 * Données des 4 piliers d'expériences du Eat & Drink Festival Cotonou 2027.
 */
const EXPERIENCES_DATA: FestivalExperience[] = [
  {
    id: 'good-vibes',
    title: 'GOOD VIBES & AMBIANCE FESTIVAL',
    slogan: 'Some vibes are lived, others stay forever.',
    imageUrl: '/exp_arafat_man.jpg',
    category: 'GOOD VIBES',
    badgeColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'lifestyle',
    title: 'COMMUNAUTÉ & LIFESTYLE',
    slogan: 'Some smiles craft the greatest memories.',
    imageUrl: '/exp_thumbsup_woman.jpg',
    category: 'LIFESTYLE',
    badgeColor: 'from-orange-500 to-pink-600',
  },
  {
    id: 'mixology-vip',
    title: 'DETENTE & MIXOLOGIE VIP',
    slogan: 'Crafted drinks for relaxed moments.',
    imageUrl: '/exp_sofa_drink_man.jpg',
    category: 'BARS & VIP',
    badgeColor: 'from-purple-600 to-pink-600',
  },
  {
    id: 'dj-shows',
    title: 'SHOWS DJS & CONCERTS LIVE',
    slogan: 'Music that resonates into the night.',
    imageUrl: '/exp_female_dj.jpg',
    category: 'MUSIQUE & SHOWS',
    badgeColor: 'from-blue-500 to-cyan-600',
  },
];


export interface UseFestivalExperienceReturn {
  experiences: FestivalExperience[];
  loading: boolean;
  error: string | null;
  activeId: string;
  setActiveId: (id: string) => void;
}

/**
 * Hook personnalisé gérant la galerie visuelle en éventail d'expériences du festival.
 * Gère les états loading, success et error conformément aux règles globales.
 *
 * @returns {UseFestivalExperienceReturn} Données et fonctions de contrôle de la galerie.
 */
export function useFestivalExperience(): UseFestivalExperienceReturn {
  const [experiences, setExperiences] = useState<FestivalExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>('good-vibes');


  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      setExperiences(EXPERIENCES_DATA);
      setLoading(false);
    } catch (err) {
      setError("Impossible de charger la galerie d'expériences.");
      setLoading(false);
    }
  }, []);

  return {
    experiences,
    loading,
    error,
    activeId,
    setActiveId,
  };
}
