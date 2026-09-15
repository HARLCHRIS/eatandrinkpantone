import React, { useState } from 'react';
import type { Application, UserRole, SelectionCriteriaKey } from '../types';
import { RoleGuard } from '../components/RoleGuard';
import { ApplicationCard } from '../components/ApplicationCard';
import { EvaluationModal } from '../components/EvaluationModal';
import { Award, CheckCircle2, Clock, BookOpen } from 'lucide-react';

interface JuryDashboardPageProps {
  currentRole: UserRole;
  onRoleSwitch: (role: UserRole) => void;
  applications: Application[];
  getEvaluationsForApplication: (id: string) => any[];
  onSubmitEvaluation: (
    applicationId: string,
    juryId: string,
    juryName: string,
    scores: Record<SelectionCriteriaKey, number>,
    feedback?: string
  ) => Promise<boolean>;
  onViewDetails: (app: Application) => void;
}

/**
 * Espace dédié aux membres du Jury pour l'évaluation des candidats.
 * Protégé impérativement par RoleGuard avec vérification du rôle 'jury'.
 *
 * @param {JuryDashboardPageProps} props - Liste des projets, helper d'évaluations et callback de notation.
 * @returns {React.ReactElement} Vue espace jury.
 */
export const JuryDashboardPage: React.FC<JuryDashboardPageProps> = ({
  currentRole,
  onRoleSwitch,
  applications,
  getEvaluationsForApplication,
  onSubmitEvaluation,
  onViewDetails,
}) => {
  const [evaluatingApp, setEvaluatingApp] = useState<Application | null>(null);

  return (
    <RoleGuard currentRole={currentRole} allowedRoles={['jury']} onSwitchRole={onRoleSwitch}>
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={28} style={{ color: '#d97706' }} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Espace Membre du Jury</h1>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            Évaluez chaque candidature sur les 7 critères officiels (Score pondéré sur 100 points)
          </p>
        </div>

        {/* Jury Instructions Box */}
        <div
          className="glass-card"
          style={{
            padding: '20px',
            marginBottom: '28px',
            borderLeft: '4px solid #f59e0b',
            background: 'rgba(245, 158, 11, 0.05)',
          }}
        >
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: '#d97706', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={18} /> Consignes d'Évaluation
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Consultez le dossier complet du candidat puis attribuez une note de 0 à 10 sur chacun des 7 critères : 
            Pertinence (15pts), Innovation (15pts), Potentiel commercial (20pts), Impact local (15pts), Faisabilité (15pts), Traction (10pts) et Qualité du porteur (10pts).
          </p>
        </div>

        {/* Grid of Applications for Evaluation */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {applications.map((app) => {
            const evals = getEvaluationsForApplication(app.id);
            const myEval = evals.find((e) => e.juryId === 'jury-1');

            return (
              <div key={app.id} style={{ position: 'relative' }}>
                <ApplicationCard
                  application={app}
                  averageScore={myEval ? myEval.totalWeightedScore : undefined}
                  evaluationsCount={evals.length}
                  currentRole={currentRole}
                  onViewDetails={onViewDetails}
                  onEvaluate={() => setEvaluatingApp(app)}
                />

                {/* Evaluation Status Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: myEval ? '#dcfce7' : '#fef3c7',
                    color: myEval ? '#166534' : '#92400e',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    zIndex: 2,
                  }}
                >
                  {myEval ? (
                    <>
                      <CheckCircle2 size={12} /> Évalué ({myEval.totalWeightedScore}/100)
                    </>
                  ) : (
                    <>
                      <Clock size={12} /> À évaluer
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Evaluation Modal */}
        <EvaluationModal
          application={evaluatingApp}
          isOpen={!!evaluatingApp}
          onClose={() => setEvaluatingApp(null)}
          onSubmitEvaluation={onSubmitEvaluation}
        />
      </div>
    </RoleGuard>
  );
};
