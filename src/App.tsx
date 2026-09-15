import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useApplications } from './hooks/useApplications';
import { useEvaluation } from './hooks/useEvaluation';
import { DEFAULT_COMPETITION_CONFIG } from './config/appConfig';
import type { Application } from './types';

// Components
import { HeaderNav } from './components/HeaderNav';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { CandidateFormModal } from './components/CandidateFormModal';

// Pages
import { PublicHomePage } from './pages/PublicHomePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { JuryDashboardPage } from './pages/JuryDashboardPage';

import './App.css';

/**
 * Composant Racine de l'Application du Concours Entrepreneurial Agroalimentaire.
 * Gère l'assemblage des pages, des modales globales et des hooks personnalisés.
 */
export function App() {
  const { role, switchRole } = useAuth();
  const {
    applications,
    filteredApplications,
    loading,
    error,
    filters,
    setFilters,
    addApplication,
    updateStatus,
    resetApplicationsToDefault,
    stats,
  } = useApplications();

  const {
    submitEvaluation,
    getEvaluationsForApplication,
    rankedApplications,
  } = useEvaluation(applications);

  // Active navigation tab ('home' | 'admin' | 'jury')
  const [activeTab, setActiveTab] = useState<'home' | 'admin' | 'jury'>('home');

  // Modal States
  const [selectedAppDetail, setSelectedAppDetail] = useState<Application | null>(null);
  const [isCandidateFormOpen, setIsCandidateFormOpen] = useState<boolean>(false);

  const handleOpenDetails = (app: Application) => {
    setSelectedAppDetail(app);
  };

  const handleCloseDetails = () => {
    setSelectedAppDetail(null);
  };

  return (
    <div className="app-layout">
      {/* Header Navigation (Uniquement visible en mode Jury / Admin) */}
      <HeaderNav
        currentRole={role}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRoleSwitch={switchRole}
        closingDate={DEFAULT_COMPETITION_CONFIG.closingDate}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Chargement des données du concours...
          </div>
        )}

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {!loading && (
          <>
            {activeTab === 'home' && (
              <PublicHomePage
                config={DEFAULT_COMPETITION_CONFIG}
                applications={applications}
                filteredApplications={filteredApplications}
                filters={filters}
                onFilterChange={setFilters}
                currentRole={role}
                onOpenCandidateForm={() => setIsCandidateFormOpen(true)}
                onViewDetails={handleOpenDetails}
                onNavigateToPro={(tab) => {
                  setActiveTab(tab);
                  switchRole(tab);
                }}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboardPage
                currentRole={role}
                onRoleSwitch={switchRole}
                applications={applications}
                filteredApplications={filteredApplications}
                rankedApplications={rankedApplications}
                stats={stats}
                filters={filters}
                onFilterChange={setFilters}
                onUpdateStatus={updateStatus}
                onResetData={resetApplicationsToDefault}
                onViewDetails={handleOpenDetails}
              />
            )}

            {activeTab === 'jury' && (
              <JuryDashboardPage
                currentRole={role}
                onRoleSwitch={switchRole}
                applications={applications}
                getEvaluationsForApplication={getEvaluationsForApplication}
                onSubmitEvaluation={submitEvaluation}
                onViewDetails={handleOpenDetails}
              />
            )}
          </>
        )}
      </main>

      {/* Detail Dossier Modal */}
      <ApplicationDetailModal
        application={selectedAppDetail}
        evaluations={selectedAppDetail ? getEvaluationsForApplication(selectedAppDetail.id) : []}
        onClose={handleCloseDetails}
      />

      {/* Candidate Form Wizard Modal */}
      <CandidateFormModal
        isOpen={isCandidateFormOpen}
        onClose={() => setIsCandidateFormOpen(false)}
        onSubmitApplication={addApplication}
      />

      {/* Footer Administration (Seulement en mode Admin ou Jury) */}
      {activeTab !== 'home' && (
        <footer style={{ background: '#022c22', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.1)', padding: '24px 20px', marginTop: 'auto' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', fontSize: '0.85rem' }}>
            <div>
              <strong style={{ color: '#ffffff', fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>
                {DEFAULT_COMPETITION_CONFIG.festivalName} • Espace Restreint
              </strong>
              <p>Session active : {role.toUpperCase()}</p>
            </div>
            <div>
              <button
                onClick={() => {
                  setActiveTab('home');
                  switchRole('public');
                }}
                style={{ background: 'rgba(255,255,255,0.1)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
              >
                ← Quitter l'espace professionnel
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
