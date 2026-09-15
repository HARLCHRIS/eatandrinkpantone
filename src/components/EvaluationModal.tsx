import { useState } from 'react';
import type { Application, SelectionCriteriaKey } from '../types';
import { SELECTION_CRITERIA } from '../config/appConfig';
import { calculateWeightedScore } from '../hooks/useEvaluation';
import { X, Award, CheckCircle, AlertCircle } from 'lucide-react';

interface EvaluationModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitEvaluation: (
    applicationId: string,
    juryId: string,
    juryName: string,
    scores: Record<SelectionCriteriaKey, number>,
    feedback?: string
  ) => Promise<boolean>;
}

/**
 * Modale de notation du jury sur les 7 critères officiels (Score sur 100 points).
 *
 * @param {EvaluationModalProps} props - Candidature sélectionnée, état d'ouverture et callback de sauvegarde.
 * @returns {React.ReactElement | null} Fenêtre modale avec réglettes de notation.
 */
export const EvaluationModal = ({
  application,
  isOpen,
  onClose,
  onSubmitEvaluation,
}: EvaluationModalProps) => {
  const [juryName, setJuryName] = useState('Dr. Florentin AHOUANSOU (Jury Agro)');
  const [scores, setScores] = useState<Record<SelectionCriteriaKey, number>>({
    problemRelevance: 8,
    innovation: 8,
    commercialPotential: 8,
    localEconomicImpact: 8,
    feasibility: 8,
    traction: 7,
    founderQuality: 8,
  });

  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !application) return null;

  const calculatedTotal = calculateWeightedScore(scores);

  const handleScoreChange = (key: SelectionCriteriaKey, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isDone = await onSubmitEvaluation(
      application.id,
      'jury-1',
      juryName,
      scores,
      feedback
    );

    setLoading(false);
    if (isDone) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } else {
      setError('Impossible d\'enregistrer l\'évaluation.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} style={{ color: '#d97706' }} />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Évaluation par le Jury</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Candidat : <strong>{application.project.name}</strong> ({application.candidate.firstName} {application.candidate.lastName})
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Live Total Score Gauge */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
            color: '#ffffff',
            padding: '16px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#a7f3d0' }}>
              Note Globale Pondérée
            </span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
              {calculatedTotal} <span style={{ fontSize: '1rem', fontWeight: 500, color: '#cbd5e1' }}>/ 100 Points</span>
            </h3>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#e2e8f0' }}>
            Grille officielle du Festival
          </div>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '24px', color: '#16a34a' }}>
            <CheckCircle size={40} style={{ margin: '0 auto 12px' }} />
            <h4>Évaluation enregistrée avec succès !</h4>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label">Nom de l'évaluateur (Jury)</label>
              <input
                type="text"
                className="form-input"
                required
                value={juryName}
                onChange={(e) => setJuryName(e.target.value)}
              />
            </div>

            {/* Criteria List sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {SELECTION_CRITERIA.map((crit) => {
                const currentScore = scores[crit.key] || 0;
                const pointsCalculated = Math.round(((currentScore / 10) * crit.maxPoints) * 10) / 10;

                return (
                  <div
                    key={crit.key}
                    style={{
                      background: 'var(--surface-subtle)',
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {crit.title} (Coeff max: {crit.maxPoints} pts)
                      </strong>
                      <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>
                        Note: {currentScore}/10 ({pointsCalculated}/{crit.maxPoints} pts)
                      </span>
                    </div>
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      {crit.description}
                    </p>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      className="range-slider"
                      value={currentScore}
                      onChange={(e) => handleScoreChange(crit.key, Number(e.target.value))}
                    />
                  </div>
                );
              })}
            </div>

            <div className="form-group">
              <label className="form-label">Commentaires & Remarques qualitatives du Jury</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Précisez les points forts et les recommandations pour le candidat..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-gold" disabled={loading}>
                {loading ? 'Sauvegarde...' : 'Valider & Publier la note'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
