import type { ApplicationStatus } from '../types';

interface StatusBadgeProps {
  /**
   * Statut actuel de la candidature
   */
  status: ApplicationStatus;
  /**
   * Affichage d'une icône explicite (Optionnel)
   */
  showIcon?: boolean;
}

/**
 * Composant de badge stylisé selon le statut de la candidature.
 * Conforme aux règles d'UI dynamique et d'accessibilité.
 *
 * @param {StatusBadgeProps} props - Propriétés du badge.
 * @returns {React.ReactElement} Badge avec classe et couleur appropriées.
 */
export const StatusBadge = ({ status, showIcon = true }: StatusBadgeProps) => {
  const getBadgeConfig = (st: ApplicationStatus) => {
    switch (st) {
      case 'NOUVELLE':
        return { className: 'badge-nouvelle', icon: '🔹', label: 'Nouvelle' };
      case 'EN ÉVALUATION':
        return { className: 'badge-evaluation', icon: '⏳', label: 'En évaluation' };
      case 'PRÉSÉLECTIONNÉE':
        return { className: 'badge-preselectionnee', icon: '⭐', label: 'Présélectionnée' };
      case 'NON RETENUE':
        return { className: 'badge-non-retenue', icon: '❌', label: 'Non retenue' };
      case 'FINALISTE':
        return { className: 'badge-finaliste', icon: '🏆', label: 'Finaliste' };
      case 'LAURÉAT':
        return { className: 'badge-laureat', icon: '👑', label: 'Lauréat' };
      default:
        return { className: 'badge-nouvelle', icon: '📄', label: st };
    }
  };

  const { className, icon, label } = getBadgeConfig(status);

  return (
    <span className={`badge ${className}`} title={`Statut : ${label}`}>
      {showIcon && <span>{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
