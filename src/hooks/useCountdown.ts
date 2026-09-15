import { useState, useEffect, useCallback } from 'react';

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

/**
 * Hook de compte à rebours calculant en temps réel le temps restant jusqu'à une date cible.
 * 
 * @param targetIsoDate - Date cible au format ISO string.
 * @returns {CountdownTime} Objet contenant les jours, heures, minutes et secondes restantes.
 */
export function useCountdown(targetIsoDate: string): CountdownTime {
  const calculateTimeLeft = useCallback((): CountdownTime => {
    const difference = +new Date(targetIsoDate) - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isExpired: false,
    };
  }, [targetIsoDate]);

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  return timeLeft;
}
