import React, { useState } from 'react';
import type { Application, ApplicationStatus, ApplicationSummaryWithScore, UserRole, FilterState } from '../types';
import { RoleGuard } from '../components/RoleGuard';
import { StatsOverview } from '../components/StatsOverview';
import { StatusBadge } from '../components/StatusBadge';
import { TransactionalEmailModal } from '../components/TransactionalEmailModal';
import { useTransactionalEmail } from '../hooks/useTransactionalEmail';
import { ShieldCheck, Trophy, RotateCcw, Edit3, Eye, Search, Mail } from 'lucide-react';

interface AdminDashboardPageProps {
  currentRole: UserRole;
  onRoleSwitch: (role: UserRole) => void;
  applications: Application[];
  filteredApplications: Application[];
  rankedApplications: ApplicationSummaryWithScore[];
  stats: any;
  filters: FilterState;
  onFilterChange: React.Dispatch<React.SetStateAction<FilterState>>;
  onUpdateStatus: (id: string, newStatus: ApplicationStatus) => Promise<boolean>;
  onResetData: () => void;
  onViewDetails: (app: Application) => void;
}

/**
 * Tableau de bord Administrateur pour la gestion globale du concours.
 * Vérifie impérativement le rôle 'admin' via RoleGuard.
 *
 * @param {AdminDashboardPageProps} props - État global des candidatures, classements et callbacks.
 * @returns {React.ReactElement} Vue administration.
 */
export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  currentRole,
  onRoleSwitch,
  applications,
  filteredApplications,
  rankedApplications,
  stats,
  filters,
  onFilterChange,
  onUpdateStatus,
  onResetData,
  onViewDetails,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'ranking'>('all');
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('EN ÉVALUATION');
  const [emailModalApp, setEmailModalApp] = useState<Application | null>(null);

  const { sendStatusUpdateNotification } = useTransactionalEmail();

  const handleOpenStatusModal = (app: Application) => {
    setEditingApp(app);
    setSelectedStatus(app.status);
  };

  const handleSaveStatus = async () => {
    if (editingApp) {
      await onUpdateStatus(editingApp.id, selectedStatus);
      
      // Envoi automatique d'email transactionnel Brevo pour le suivi de candidature
      await sendStatusUpdateNotification({
        candidateEmail: editingApp.candidate.email,
        candidateName: `${editingApp.candidate.firstName} ${editingApp.candidate.lastName}`,
        projectName: editingApp.project.name,
        applicationId: editingApp.id,
        newStatus: selectedStatus,
      });

      setEditingApp(null);
    }
  };

  return (
    <RoleGuard currentRole={currentRole} allowedRoles={['admin']} onSwitchRole={onRoleSwitch}>
      <div className="animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={28} style={{ color: '#059669' }} />
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Tableau de Bord Administrateur</h1>
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Gestion centralisée des candidatures et suivi des évaluations</p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={onResetData} style={{ fontSize: '0.85rem' }}>
              <RotateCcw size={16} /> Réinitialiser Démo
            </button>
          </div>
        </div>

        {/* Stats Overview component */}
        <StatsOverview stats={stats} />

        {/* Sub Navigation */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <button
            className={`btn ${activeSubTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('all')}
          >
            Toutes les Candidatures ({applications.length})
          </button>
          <button
            className={`btn ${activeSubTab === 'ranking' ? 'btn-gold' : 'btn-secondary'}`}
            onClick={() => setActiveSubTab('ranking')}
          >
            <Trophy size={16} /> Classement Général du Jury
          </button>
        </div>

        {/* TAB 1: ALL APPLICATIONS TABLE */}
        {activeSubTab === 'all' && (
          <div className="glass-card" style={{ padding: '20px' }}>
            {/* Filter Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  placeholder="Recherche..."
                  value={filters.search}
                  onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                />
              </div>

              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              >
                <option value="">Tous les statuts</option>
                <option value="NOUVELLE">NOUVELLE</option>
                <option value="EN ÉVALUATION">EN ÉVALUATION</option>
                <option value="PRÉSÉLECTIONNÉE">PRÉSÉLECTIONNÉE</option>
                <option value="FINALISTE">FINALISTE</option>
                <option value="LAURÉAT">LAURÉAT</option>
                <option value="NON RETENUE">NON RETENUE</option>
              </select>

              <select
                className="form-select"
                value={filters.category}
                onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
              >
                <option value="">Toutes catégories</option>
                <option value="Transformation agroalimentaire">Transformation</option>
                <option value="Boissons">Boissons</option>
                <option value="Produits alimentaires transformés">Produits transformés</option>
              </select>
            </div>

            {/* Applications Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code ID</th>
                    <th>Porteur & Marque</th>
                    <th>Ville</th>
                    <th>Catégorie</th>
                    <th>Dotation FCFA</th>
                    <th>Statut</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{app.id}</td>
                      <td>
                        <strong>{app.project.name}</strong>
                        <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                          {app.candidate.firstName} {app.candidate.lastName} ({app.candidate.phone})
                        </div>
                      </td>
                      <td>{app.candidate.city}</td>
                      <td><span className="badge badge-preselectionnee" style={{ fontSize: '0.7rem' }}>{app.project.category}</span></td>
                      <td style={{ fontWeight: 700, color: '#059669' }}>{app.budget.total.toLocaleString()}</td>
                      <td><StatusBadge status={app.status} /></td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                            onClick={() => onViewDetails(app)}
                            title="Voir les détails"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#166534', borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }}
                            onClick={() => setEmailModalApp(app)}
                            title="Envoyer un email Brevo"
                          >
                            <Mail size={14} />
                          </button>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                            onClick={() => handleOpenStatusModal(app)}
                          >
                            <Edit3 size={14} /> Statut
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: RANKING LEADERBOARD */}
        {activeSubTab === 'ranking' && (
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#d97706' }}>
              <Trophy size={20} /> Classement par Moyenne des Évaluations (Sur 100 Points)
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Rang</th>
                    <th>Marque / Projet</th>
                    <th>Porteur</th>
                    <th>Nombre d'avis</th>
                    <th>Score Moyen / 100</th>
                    <th>Statut Actuel</th>
                    <th style={{ textAlign: 'right' }}>Fiche</th>
                  </tr>
                </thead>
                <tbody>
                  {rankedApplications.map((item) => (
                    <tr key={item.application.id} style={{ background: item.rank === 1 ? 'rgba(245, 158, 11, 0.08)' : 'transparent' }}>
                      <td style={{ fontWeight: 800, fontSize: '1rem' }}>
                        {item.rank ? `#${item.rank}` : '-'}
                      </td>
                      <td><strong>{item.application.project.name}</strong></td>
                      <td>{item.application.candidate.firstName} {item.application.candidate.lastName}</td>
                      <td>{item.evaluationsCount} évaluation(s)</td>
                      <td>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: item.averageScore >= 80 ? '#059669' : '#d97706' }}>
                          {item.averageScore} / 100
                        </span>
                      </td>
                      <td><StatusBadge status={item.application.status} /></td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                          onClick={() => onViewDetails(item.application)}
                        >
                          <Eye size={14} /> Voir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Change Status Modal */}
        {editingApp && (
          <div className="modal-overlay" onClick={() => setEditingApp(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>
                Modifier le Statut de Candidature
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Projet : <strong>{editingApp.project.name}</strong>
              </p>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Nouveau Statut Officiel</label>
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as ApplicationStatus)}
                >
                  <option value="NOUVELLE">NOUVELLE</option>
                  <option value="EN ÉVALUATION">EN ÉVALUATION</option>
                  <option value="PRÉSÉLECTIONNÉE">PRÉSÉLECTIONNÉE</option>
                  <option value="FINALISTE">FINALISTE</option>
                  <option value="LAURÉAT">LAURÉAT</option>
                  <option value="NON RETENUE">NON RETENUE</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={() => setEditingApp(null)}>
                  Annuler
                </button>
                <button className="btn btn-primary" onClick={handleSaveStatus}>
                  Enregistrer la décision
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal d'envoi d'email transactionnel Brevo */}
        <TransactionalEmailModal
          isOpen={Boolean(emailModalApp)}
          onClose={() => setEmailModalApp(null)}
          application={emailModalApp}
          currentUserRole={currentRole}
        />
      </div>
    </RoleGuard>
  );
};
