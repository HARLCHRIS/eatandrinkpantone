import type { ReactNode } from 'react';
import type { UserRole } from '../types';
import { ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  currentRole: UserRole;
  allowedRoles: UserRole[];
  children: ReactNode;
  onSwitchRole?: (role: UserRole) => void;
}

/**
 * Composant de sécurité contrôlant l'accès aux vues selon le rôle actif.
 * Conforme à la règle d'entreprise #6 ("Toujours vérifier le rôle utilisateur").
 *
 * @param {RoleGuardProps} props - Rôle actuel, rôles autorisés et contenu enfant.
 * @returns {React.ReactElement} Contenu autorisé ou message de blocage avec option d'escalade.
 */
export const RoleGuard = ({
  currentRole,
  allowedRoles,
  children,
  onSwitchRole,
}: RoleGuardProps) => {
  const isAllowed = allowedRoles.includes(currentRole);

  if (!isAllowed) {
    return (
      <div
        className="glass-card animate-fade-in"
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          maxWidth: '560px',
          margin: '40px auto',
          borderTop: '4px solid #ef4444',
        }}
      >
        <div style={{ display: 'inline-flex', padding: '16px', background: '#fee2e2', borderRadius: '50%', color: '#dc2626', marginBottom: '16px' }}>
          <ShieldAlert size={36} />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>
          Accès Restreint
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
          Vous êtes actuellement en mode <strong>{currentRole.toUpperCase()}</strong>. Cette section nécessite le rôle :{' '}
          <span style={{ color: '#059669', fontWeight: 600 }}>
            {allowedRoles.join(' ou ').toUpperCase()}
          </span>.
        </p>

        {onSwitchRole && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {allowedRoles.map((role) => (
              <button
                key={role}
                className="btn btn-primary"
                onClick={() => onSwitchRole(role)}
              >
                Passer en mode {role.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
