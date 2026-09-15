import React from 'react';
import type { Application, JuryEvaluation } from '../types';
import { StatusBadge } from './StatusBadge';
import { X, User, Phone, Mail, MapPin, DollarSign, Image as ImageIcon, Star, FileCheck, Video, Target, TrendingUp, HelpCircle, CheckCircle } from 'lucide-react';

interface ApplicationDetailModalProps {
  application: Application | null;
  evaluations?: JuryEvaluation[];
  onClose: () => void;
}

/**
 * Modale de consultation approfondie des données de candidature.
 * Affiche l'ensemble des 15 points clés soumis par le candidat.
 *
 * @param {ApplicationDetailModalProps} props - Candidature à afficher, liste des évaluations et handler de fermeture.
 * @returns {React.ReactElement | null} Fenêtre modale avec conteneur complet.
 */
export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  evaluations = [],
  onClose,
}) => {
  if (!application) return null;

  const { candidate, project, budget, media, status } = application;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '850px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <StatusBadge status={status} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {application.id}</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{project.name}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Soumis le {new Date(application.submittedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'var(--surface-subtle)', padding: '8px', borderRadius: '50%', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 1. Nom et prénom, Téléphone/WhatsApp, Localisation */}
          <div style={{ background: 'var(--surface-subtle)', padding: '16px', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
              <User size={16} /> 1. Porteur de Projet & Localisation
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.875rem' }}>
              <div><strong>Nom et prénom:</strong> {candidate.firstName} {candidate.lastName}</div>
              <div><strong>Statut:</strong> {candidate.status}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14} /> <strong>Tél / WhatsApp:</strong> {candidate.phone}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} /> <strong>Email:</strong> {candidate.email}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> <strong>Localisation:</strong> {candidate.city} ({candidate.address || 'Bénin'})</div>
            </div>
          </div>

          {/* 3. Nom du projet, 5. Domaine, 6. Description, 7. Problème, 8. Solution */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>2. Synthèse de l'Activité</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.85rem', marginBottom: '16px' }}>
              <div><strong>Nom du projet / entreprise:</strong> {project.name}</div>
              <div><strong>Domaine d'activité:</strong> {project.category || project.sector}</div>
              <div><strong>Où en êtes-vous aujourd'hui ?:</strong> {project.stage}</div>
            </div>

            <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem' }}>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>Description du projet :</strong>
              <p style={{ color: 'var(--text-muted)' }}>{project.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
              <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '8px' }}>
                <strong style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <HelpCircle size={14} /> Quel problème résolvez-vous ?
                </strong>
                <p style={{ color: 'var(--text-muted)' }}>{project.problem}</p>
              </div>
              <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '8px' }}>
                <strong style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <CheckCircle size={14} /> Quelle est votre solution ?
                </strong>
                <p style={{ color: 'var(--text-muted)' }}>{project.solution}</p>
              </div>
            </div>
          </div>

          {/* 9. Qui sont vos clients ?, 10. Modèle économique, 12. Résultats obtenus */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb' }}>
              <Target size={16} /> Business Model & Résultats
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.875rem', marginBottom: '12px' }}>
              <div>
                <strong>Qui sont vos clients ? :</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{project.targetClients || 'Ménages et commerces de Cotonou'}</p>
              </div>
              <div>
                <strong>Comment gagnez-vous de l'argent ? :</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{project.revenueModel || 'Vente directe de produits transformés'}</p>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '0.875rem' }}>
              <strong style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a' }}>
                <TrendingUp size={14} /> Quels résultats avez-vous déjà obtenus ? :
              </strong>
              <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{project.resultsAchieved || 'Premières ventes sur le marché local.'}</p>
            </div>
          </div>

          {/* 13. Que feriez-vous avec les 1 000 000 FCFA ? */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <DollarSign size={16} style={{ color: '#059669' }} /> Que feriez-vous avec les 1 000 000 FCFA ?
            </h4>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{budget.explanation}</p>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>Poste dépense</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Montant FCFA</th>
                </tr>
              </thead>
              <tbody>
                {budget.items.map((item) => (
                  <tr key={item.id}>
                    <td><span className="badge badge-preselectionnee">{item.category}</span></td>
                    <td>{item.description}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{item.amount.toLocaleString()} FCFA</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} style={{ fontWeight: 800, textAlign: 'right' }}>Total Budget :</td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: '#059669', fontSize: '1.05rem' }}>
                    {budget.total.toLocaleString()} FCFA
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* 14. Photo du produit & 15. Vidéo de présentation */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ImageIcon size={16} /> Supports Visuels & Médias
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {media.productPhotoUrl && (
                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <img src={media.productPhotoUrl} alt="Produit ou activité" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  <span style={{ fontSize: '0.75rem', padding: '4px 8px', display: 'block', background: 'var(--surface-subtle)', textAlign: 'center' }}>
                    Photo du produit ou de l'activité
                  </span>
                </div>
              )}
              {media.videoUrl && (
                <div style={{ borderRadius: '8px', padding: '12px', border: '1px solid var(--border-color)', background: 'var(--surface-card)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
                    <Video size={16} /> Vidéo de présentation (1 à 3 min)
                  </div>
                  <a
                    href={media.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.8rem', color: '#2563eb', textDecoration: 'underline', wordBreak: 'break-all' }}
                  >
                    {media.videoUrl}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Jury Evaluations History */}
          {evaluations.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706' }}>
                <Star size={16} /> Évaluations du Jury ({evaluations.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {evaluations.map((ev) => (
                  <div key={ev.id} style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '14px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{ev.juryName}</strong>
                      <span style={{ fontWeight: 800, color: '#d97706' }}>{ev.totalWeightedScore} / 100</span>
                    </div>
                    {ev.feedback && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>"{ev.feedback}"</p>}
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                      Évalué le {new Date(ev.evaluatedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Validation indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#059669', background: '#ecfdf5', padding: '10px 14px', borderRadius: '8px' }}>
            <FileCheck size={16} />
            <span>Candidature certifiée exacte et conforme au règlement par le candidat.</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
