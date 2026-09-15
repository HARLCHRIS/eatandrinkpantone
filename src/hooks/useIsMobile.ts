import { useState, useEffect } from 'react';
import type { WindowDimensions } from '../types';

/**
 * Hook personnalisé pour détecter la taille de la fenêtre d'affichage et l'état mobile/desktop.
 * Évite la duplication de logique réactive d'affichage responsive.
 *
 * @param {number} [breakpoint=640] - Seuil de largeur en pixels pour considérer l'écran comme mobile.
 * @returns {WindowDimensions} Dimensions et indicateur d'écran mobile.
 */
export function useIsMobile(breakpoint: number = 640): WindowDimensions {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;
    return {
      width,
      height,
      isMobile: width < breakpoint,
    };
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowDimensions({
        width,
        height,
        isMobile: width < breakpoint,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return windowDimensions;
}
