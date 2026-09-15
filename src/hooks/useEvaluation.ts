import { useState, useEffect, useCallback, useMemo } from 'react';
import type {
  Application,
  JuryEvaluation,
  SelectionCriteriaKey,
  ApplicationSummaryWithScore,
} from '../types';
import { SELECTION_CRITERIA } from '../config/appConfig';
import { INITIAL_MOCK_EVALUATIONS } from '../config/mockData';

const STORAGE_KEY_EVALUATIONS = 'festival_agro_evaluations';

/**
 * Calcule la note pondérée sur 100 points à partir des notes attribuées (0 à 10) sur chaque critère.
 * 
 * @param scores - Notes attribuées de 0 à 10 pour chaque clé de critère.
 * @returns {number} Score total arrondi à 1 décimale (Max 100).
 */
export function calculateWeightedScore(
  scores: Record<SelectionCriteriaKey, number>
): number {
  let total = 0;
  SELECTION_CRITERIA.forEach((crit) => {
    const rawScore = scores[crit.key] || 0; // scale 0-10
    const weightedPoints = (rawScore / 10) * crit.maxPoints;
    total += weightedPoints;
  });
  return Math.round(total * 10) / 10;
}

/**
 * Hook personnalisé gérant la notation du jury et les classements.
 * 
 * @returns {Object} Collection d'évaluations et fonctions de soumission de note.
 */
export function useEvaluation(applications: Application[]) {
  const [evaluations, setEvaluations] = useState<JuryEvaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialisation des évaluations depuis le stockage local.
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EVALUATIONS);
      if (stored) {
        setEvaluations(JSON.parse(stored));
      } else {
        localStorage.setItem(
          STORAGE_KEY_EVALUATIONS,
          JSON.stringify(INITIAL_MOCK_EVALUATIONS)
        );
        setEvaluations(INITIAL_MOCK_EVALUATIONS);
      }
      setLoading(false);
    } catch (_err) {
      setError('Impossible de charger les évaluations du jury');
      setLoading(false);
    }
  }, []);

  /**
   * Enregistre ou met à jour une évaluation pour un candidat donné par un membre du jury.
   */
  const submitEvaluation = useCallback(
    async (
      applicationId: string,
      juryId: string,
      juryName: string,
      scores: Record<SelectionCriteriaKey, number>,
      feedback?: string
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const totalWeightedScore = calculateWeightedScore(scores);
        const existingIndex = evaluations.findIndex(
          (e) => e.applicationId === applicationId && e.juryId === juryId
        );

        let updated: JuryEvaluation[];
        if (existingIndex >= 0) {
          updated = [...evaluations];
          updated[existingIndex] = {
            ...updated[existingIndex],
            scores,
            feedback,
            totalWeightedScore,
            evaluatedAt: new Date().toISOString(),
          };
        } else {
          const newEval: JuryEvaluation = {
            id: `eval-${Date.now()}`,
            applicationId,
            juryId,
            juryName,
            scores,
            feedback,
            evaluatedAt: new Date().toISOString(),
            totalWeightedScore,
          };
          updated = [newEval, ...evaluations];
        }

        localStorage.setItem(STORAGE_KEY_EVALUATIONS, JSON.stringify(updated));
        setEvaluations(updated);
        setLoading(false);
        return true;
      } catch (_err) {
        setError('Erreur lors de la sauvegarde de la note');
        setLoading(false);
        return false;
      }
    },
    [evaluations]
  );

  /**
   * Extrait les évaluations d'une candidature donnée.
   */
  const getEvaluationsForApplication = useCallback(
    (applicationId: string): JuryEvaluation[] => {
      return evaluations.filter((e) => e.applicationId === applicationId);
    },
    [evaluations]
  );

  /**
   * Génère le classement global et les moyennes de l'ensemble des candidatures.
   */
  const rankedApplications = useMemo((): ApplicationSummaryWithScore[] => {
    const summaries: ApplicationSummaryWithScore[] = applications.map((app) => {
      const appEvals = evaluations.filter((e) => e.applicationId === app.id);
      let averageScore = 0;
      if (appEvals.length > 0) {
        const sum = appEvals.reduce((acc, curr) => acc + curr.totalWeightedScore, 0);
        averageScore = Math.round((sum / appEvals.length) * 10) / 10;
      }

      return {
        application: app,
        averageScore,
        evaluationsCount: appEvals.length,
      };
    });

    // Tri décroissant par moyenne des notes
    summaries.sort((a, b) => b.averageScore - a.averageScore);

    // Attribution des rangs
    return summaries.map((item, index) => ({
      ...item,
      rank: item.evaluationsCount > 0 ? index + 1 : undefined,
    }));
  }, [applications, evaluations]);

  return {
    evaluations,
    loading,
    error,
    submitEvaluation,
    getEvaluationsForApplication,
    rankedApplications,
  };
}
