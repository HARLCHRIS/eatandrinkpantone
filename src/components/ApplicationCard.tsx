import type { Application, UserRole } from '../types';
import { StatusBadge } from './StatusBadge';
import { MapPin, User, Tag, Star, Eye, Edit3 } from 'lucide-react';

interface ApplicationCardProps {
  application: Application;
  averageScore?: number;
  evaluationsCount?: number;
  rank?: number;
  currentRole: UserRole;
  onViewDetails: (app: Application) => void;
  onEvaluate?: (app: Application) => void;
  onUpdateStatus?: (app: Application) => void;
}

/**
 * Carte visuelle synthétique présentant une candidature au concours.
 *
 * @param {ApplicationCardProps} props - Application data, score moyen, et callbacks d'action.
 * @returns {React.ReactElement} Carte responsive interactif.
 */
export const ApplicationCard = ({
  application,
  averageScore,
  evaluationsCount = 0,
  rank,
  currentRole,
  onViewDetails,
  onEvaluate,
  onUpdateStatus,
}: ApplicationCardProps) => {
  const { candidate, project, budget, status } = application;
  const isJury = currentRole === 'jury';
  const isAdmin = currentRole === 'admin';

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Header: Category & Rank */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
          <StatusBadge status={status} />
          {rank !== undefined && rank <= 3 && (
            <span
              style={{
                background: rank === 1 ? '#f59e0b' : rank === 2 ? '#94a3b8' : '#b45309',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              Rang #{rank}
            </span>
          )}
        </div>

        {/* Project Name */}
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            marginBottom: '8px',
            color: 'var(--text-main)',
            lineHeight: '1.3',
          }}
        >
          {project.name}
        </h3>

        {/* Candidate & Location */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <User size={14} style={{ color: '#059669' }} />
            {candidate.firstName} {candidate.lastName} ({candidate.status})
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} style={{ color: '#d97706' }} />
            {candidate.city}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Tag size={14} style={{ color: '#6366f1' }} />
            {project.category}
          </span>
        </div>

        {/* Description snippet */}
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {project.description}
        </p>
      </div>

      {/* Footer Details & Actions */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Dotation demandée: </span>
            <strong style={{ color: '#059669' }}>{budget.total.toLocaleString()} FCFA</strong>
          </div>

          {averageScore !== undefined && evaluationsCount > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <strong style={{ color: '#d97706', fontSize: '0.9rem' }}>{averageScore} / 100</strong>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({evaluationsCount} avis)</span>
            </div>
          ) : (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Non évalué</span>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-secondary"
            onClick={() => onViewDetails(application)}
            style={{ flex: 1, fontSize: '0.825rem' }}
          >
            <Eye size={14} />
            Détails
          </button>

          {isJury && onEvaluate && (
            <button
              className="btn btn-gold"
              onClick={() => onEvaluate(application)}
              style={{ flex: 1, fontSize: '0.825rem' }}
            >
              <Star size={14} />
              Évaluer
            </button>
          )}

          {isAdmin && onUpdateStatus && (
            <button
              className="btn btn-primary"
              onClick={() => onUpdateStatus(application)}
              style={{ fontSize: '0.825rem', padding: '8px 12px' }}
              title="Changer le statut"
            >
              <Edit3 size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
