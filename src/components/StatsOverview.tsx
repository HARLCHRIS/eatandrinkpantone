import type { ApplicationStatus } from '../types';
import { FileText, CheckCircle2, Award, Building2, MapPin } from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    total: number;
    completed: number;
    byCategory: Record<string, number>;
    byCity: Record<string, number>;
    byStatus: Record<ApplicationStatus, number>;
  };
}

/**
 * Composant de synthèses statistiques et métriques visuelles du concours.
 *
 * @param {StatsOverviewProps} props - Objet statistiques calculé par useApplications.
 * @returns {React.ReactElement} Cartes et barres de progression des métriques.
 */
export const StatsOverview = ({ stats }: StatsOverviewProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
      {/* Top Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1 */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Candidatures Totales</span>
            <FileText size={20} style={{ color: '#059669' }} />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{stats.total}</p>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 500 }}>Dossiers enregistrés</span>
        </div>

        {/* Card 2 */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Présélectionnés</span>
            <CheckCircle2 size={20} style={{ color: '#6366f1' }} />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {stats.byStatus['PRÉSÉLECTIONNÉE'] || 0}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#6366f1', fontWeight: 500 }}>Admissibles au pitch</span>
        </div>

        {/* Card 3 */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #9333ea' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Finalistes</span>
            <Award size={20} style={{ color: '#9333ea' }} />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {stats.byStatus['FINALISTE'] || 0}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#9333ea', fontWeight: 500 }}>Projets en grand jury</span>
        </div>

        {/* Card 4 */}
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Lauréats Gagnants</span>
            <Award size={20} style={{ color: '#f59e0b' }} />
          </div>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {stats.byStatus['LAURÉAT'] || 0}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 500 }}>Dotation 1 000 000 FCFA</span>

        </div>
      </div>

      {/* Distribution by Category and City */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Categories Breakdown */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Building2 size={18} style={{ color: '#059669' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Répartition par Secteur</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(stats.byCategory).map(([category, count]) => {
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500 }}>{category}</span>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{count} ({percentage}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: '#059669', borderRadius: '3px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cities Breakdown */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MapPin size={18} style={{ color: '#d97706' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Origine Géographique (Bénin)</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(stats.byCity).map(([city, count]) => {
              const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={city}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500 }}>{city}</span>
                    <span style={{ fontWeight: 700, color: '#d97706' }}>{count} ({percentage}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: '#f59e0b', borderRadius: '3px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
