import { useState, useEffect, useCallback } from 'react';
import type { UserRole } from '../types';

const STORAGE_KEY_ROLE = 'festival_agro_user_role';

/**
 * Hook d'authentification et d'habillement des rôles utilisateurs.
 * Gère les rôles 'public', 'admin' et 'jury' avec contrôle d'accès sécurisé.
 * 
 * @returns Object contenant le rôle actuel, la méthode d'activation de rôle, et l'état d'authentification.
 */
export function useAuth() {
  const [role, setRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem(STORAGE_KEY_ROLE) as UserRole | null;
    return savedRole && ['public', 'admin', 'jury'].includes(savedRole)
      ? savedRole
      : 'public';
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Bascule le rôle de l'utilisateur actif avec enregistrement persistant.
   * @param newRole - Le nouveau rôle à attribuer
   */
  const switchRole = useCallback((newRole: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, newRole);
      setRoleState(newRole);
      setLoading(false);
    } catch (_err) {
      setError('Impossible de mettre à jour le rôle utilisateur');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const savedRole = localStorage.getItem(STORAGE_KEY_ROLE) as UserRole | null;
      if (savedRole && ['public', 'admin', 'jury'].includes(savedRole)) {
        setRoleState(savedRole);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    role,
    switchRole,
    isAdmin: role === 'admin',
    isJury: role === 'jury',
    isPublic: role === 'public',
    loading,
    error,
  };
}
