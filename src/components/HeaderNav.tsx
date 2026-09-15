import type { UserRole } from '../types';
import { Award, UserCheck, ShieldCheck, ArrowLeft } from 'lucide-react';

interface HeaderNavProps {
  currentRole: UserRole;
  activeTab: 'home' | 'admin' | 'jury';
  onTabChange: (tab: 'home' | 'admin' | 'jury') => void;
  onRoleSwitch: (role: UserRole) => void;
  closingDate: string;
}

/**
 * Barre de navigation d'administration et d'évaluation dédiée aux membres du Jury et Administrateurs.
 *
 * @param {HeaderNavProps} props - État de l'onglet, rôle utilisateur et callbacks de changement.
 * @returns {React.ReactElement} En-tête sécurisé de gestion.
 */
export const HeaderNav = ({
  currentRole,
  activeTab,
  onTabChange,
  onRoleSwitch,
}: HeaderNavProps) => {
  if (activeTab === 'home') {
    return null; // Masqué totalement sur le site public
  }

  return (
    <header className="bg-brand-navy border-b border-white/10 text-white sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Return to public site */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              onTabChange('home');
              onRoleSwitch('public');
            }}
            className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl transition-all border border-white/10"
          >
            <ArrowLeft size={16} />
            <span>← Retour au Site Public</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-4">
            <Award size={18} className="text-brand-yellow" />
            <span className="font-festive text-sm font-black tracking-wider text-slate-200">
              Espace Restreint • {activeTab === 'admin' ? 'Administration' : 'Jury d\'Évaluation'}
            </span>
          </div>
        </div>

        {/* Right: Role & Navigation Tabs */}
        <div className="flex items-center gap-3">
          <nav className="flex bg-black/40 p-1 rounded-xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => {
                onTabChange('jury');
                onRoleSwitch('jury');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'jury' ? 'bg-brand-yellow text-black font-black' : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserCheck size={14} />
              <span>Jury</span>
            </button>

            <button
              onClick={() => {
                onTabChange('admin');
                onRoleSwitch('admin');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'admin' ? 'bg-brand-yellow text-black font-black' : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck size={14} />
              <span>Admin</span>
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-2 bg-brand-yellow/10 border border-brand-yellow/30 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400">Accès :</span>
            <span className="font-festive font-black text-brand-yellow uppercase">{currentRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

