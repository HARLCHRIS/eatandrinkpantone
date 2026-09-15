import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Application, ApplicationStatus, FilterState } from '../types';
import { supabase } from '../config/supabaseClient';

/**
 * Interface de retour du hook useApplications.
 */
export interface UseApplicationsReturn {
  applications: Application[];
  filteredApplications: Application[];
  loading: boolean;
  success: boolean;
  error: string | null;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  addApplication: (app: Application) => Promise<boolean>;
  updateStatus: (id: string, newStatus: ApplicationStatus) => Promise<boolean>;
  getApplicationById: (id: string) => Application | undefined;
  resetApplicationsToDefault: () => void;
  stats: {
    total: number;
    completed: number;
    byCategory: Record<string, number>;
    byCity: Record<string, number>;
    byStatus: Record<ApplicationStatus, number>;
  };
}

/**
 * Hook personnalisé gérant la collection globale de candidatures.
 * Inclus la gestion des 3 états (loading, success, error), le filtrage, et l'insertion dans Supabase.
 *
 * @returns {UseApplicationsReturn} Méthodes et états des candidatures.
 */
export function useApplications(): UseApplicationsReturn {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    city: '',
    status: '',
  });

  /**
   * Effet d'initialisation : ne lit plus depuis localStorage.
   */
  useEffect(() => {
    setLoading(false);
  }, []);

  /**
   * Enregistre une nouvelle candidature directement dans la table Postgres Supabase 'applications'.
   */
  const addApplication = useCallback(
    async (newApp: Application): Promise<boolean> => {
      setLoading(true);
      setSuccess(false);
      setError(null);
      try {
        const { error: insertError } = await supabase.from('applications').insert([
          {
            id: newApp.id,
            submitted_at: newApp.submittedAt,
            status: newApp.status,
            candidate_name: `${newApp.candidate.firstName} ${newApp.candidate.lastName}`,
            candidate_email: newApp.candidate.email,
            candidate_phone: newApp.candidate.phone,
            project_name: newApp.project.name,
            category: newApp.project.category,
            city: newApp.candidate.city,
            full_data: newApp,
          },
        ]);

        if (insertError) throw insertError;

        setApplications([newApp, ...applications]);
        setLoading(false);
        setSuccess(true);
        return true;
      } catch (_err) {
        setError("Impossible d'enregistrer votre candidature");
        setLoading(false);
        return false;
      }
    },
    [applications]
  );

  /**
   * Met à jour le statut d'une candidature spécifiée.
   */
  const updateStatus = useCallback(
    async (id: string, newStatus: ApplicationStatus): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const updated = applications.map((app) =>
          app.id === id ? { ...app, status: newStatus } : app
        );
        setApplications(updated);
        setLoading(false);
        setSuccess(true);
        return true;
      } catch (_err) {
        setError('Échec de la mise à jour du statut');
        setLoading(false);
        return false;
      }
    },
    [applications]
  );

  /**
   * Récupère une candidature par son identifiant unique.
   */
  const getApplicationById = useCallback(
    (id: string): Application | undefined => {
      return applications.find((app) => app.id === id);
    },
    [applications]
  );

  /**
   * Réinitialise les données en mémoire.
   */
  const resetApplicationsToDefault = useCallback(() => {
    setApplications([]);
  }, []);

  /**
   * Candidatures filtrées en fonction des critères de recherche (Nom, Ville, Catégorie, Statut).
   */
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const query = filters.search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        app.id.toLowerCase().includes(query) ||
        app.project.name.toLowerCase().includes(query) ||
        `${app.candidate.firstName} ${app.candidate.lastName}`
          .toLowerCase()
          .includes(query) ||
        app.candidate.email.toLowerCase().includes(query);

      const matchesCategory =
        !filters.category || app.project.category === filters.category;
      const matchesCity = !filters.city || app.candidate.city === filters.city;
      const matchesStatus =
        !filters.status || app.status === filters.status;

      return matchesSearch && matchesCategory && matchesCity && matchesStatus;
    });
  }, [applications, filters]);

  /**
   * Statistiques globales calculées pour le tableau de bord Administrateur.
   */
  const stats = useMemo(() => {
    const byCategory: Record<string, number> = {};
    const byCity: Record<string, number> = {};
    const byStatus: Record<ApplicationStatus, number> = {
      NOUVELLE: 0,
      'EN ÉVALUATION': 0,
      PRÉSÉLECTIONNÉE: 0,
      'NON RETENUE': 0,
      FINALISTE: 0,
      LAURÉAT: 0,
    };

    applications.forEach((app) => {
      // Category stats
      const cat = app.project.category;
      byCategory[cat] = (byCategory[cat] || 0) + 1;

      // City stats
      const city = app.candidate.city || 'Inconnue';
      byCity[city] = (byCity[city] || 0) + 1;

      // Status stats
      if (byStatus[app.status] !== undefined) {
        byStatus[app.status] += 1;
      }
    });

    return {
      total: applications.length,
      completed: applications.filter((a) => a.validation.certifiedExact).length,
      byCategory,
      byCity,
      byStatus,
    };
  }, [applications]);

  return {
    applications,
    filteredApplications,
    loading,
    success,
    error,
    filters,
    setFilters,
    addApplication,
    updateStatus,
    getApplicationById,
    resetApplicationsToDefault,
    stats,
  };
}
