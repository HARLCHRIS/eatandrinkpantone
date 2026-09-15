import React from 'react';
import type { Application, CandidateStatus, ProjectCategory, ProjectStage, BudgetCategory } from '../types';
import { useCandidateForm } from '../hooks/useCandidateForm';
import confetti from 'canvas-confetti';
import { X, Plus, Trash2, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Upload, Video, Image as ImageIcon, User, Briefcase, DollarSign } from 'lucide-react';

interface CandidateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (app: Application) => Promise<boolean>;
}

const CANDIDATE_STATUSES: CandidateStatus[] = [
  'Entrepreneur',
  'Porteur de projet',
  'Startup',
  'Entreprise',
  'Association / organisation',
];

const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Transformation agroalimentaire',
  'Production agricole avec transformation',
  'Boissons',
  'Produits alimentaires transformés',
  'Conservation / stockage',
  'Emballage / conditionnement',
  'Distribution agroalimentaire',
  'Technologie appliquée à l\'agroalimentaire',
  'Autre',
];

const PROJECT_STAGES: ProjectStage[] = [
  'Idée',
  'Prototype',
  'Premières ventes',
  'Activité en cours',
  'Entreprise déjà établie',
  'En phase de développement',
];

const BUDGET_CATEGORIES: BudgetCategory[] = [
  'Matières premières',
  'Équipement',
  'Production',
  'Emballage',
  'Marketing / communication',
  'Distribution',
  'Autre',
];

/**
 * Modale de candidature avec arrière-plan blanc haute visibilité, boutons de téléversement uniques
 * et navigation multi-étapes réactive.
 *
 * @param {CandidateFormModalProps} props - Propriétés du composant modale.
 * @returns {React.ReactElement | null} Fenêtre modale.
 */
export const CandidateFormModal: React.FC<CandidateFormModalProps> = ({
  isOpen,
  onClose,
  onSubmitApplication,
}) => {
  const {
    step,
    loading,
    error,
    success,
    candidate,
    project,
    budgetExplanation,
    budgetItems,
    totalBudget,
    productPhotoUrl,
    videoUrl,
    photoFile,
    videoFile,
    certifiedExact,
    acceptedRules,
    setCandidate,
    setProject,
    setBudgetExplanation,
    setProductPhotoUrl,
    setVideoUrl,
    setPhotoFile,
    setVideoFile,
    setCertifiedExact,
    setAcceptedRules,
    handleAddBudgetItem,
    handleRemoveBudgetItem,
    handleBudgetItemChange,
    goToStep,
    nextStep,
    prevStep,
    submitForm,
  } = useCandidateForm({ onSubmitApplication });

  React.useEffect(() => {
    if (success) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (_err) {
        // Ignorer si confetti indisponible
      }
    }
  }, [success]);

  if (!isOpen) return null;

  const handleFormSubmit = async (e: React.FormEvent) => {
    await submitForm(e);
  };

  /**
   * Téléversement d'image locale sans conversion base64.
   * Utilise un Blob ObjectURL léger pour l'aperçu UI immédiat.
   */
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProductPhotoUrl(previewUrl);
    }
  };

  /**
   * Téléversement de vidéo locale sans conversion base64.
   * Utilise un Blob ObjectURL léger pour l'aperçu UI immédiat.
   */
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoUrl(previewUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Modal Card - Clean Bright White Background */}
      <div
        className="bg-white text-slate-900 border border-slate-200 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden my-8 flex flex-col max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 transition-colors border border-slate-300"
          title="Fermer"
        >
          <X size={20} />
        </button>

        {/* Modal Inner Container */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {success ? (
            <div className="text-center py-10 space-y-4">
              <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full border border-emerald-300 mb-2">
                <CheckCircle2 size={56} />
              </div>
              <h3 className="font-festive text-2xl sm:text-3xl font-black text-slate-950">
                Candidature Soumise avec Succès !
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Félicitations ! Votre dossier complet a été enregistré et transmis aux membres du jury pour la dotation de <strong className="text-slate-950 font-black">1 000 000 FCFA</strong>.
              </p>


              <button
                className="mt-6 px-8 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-festive font-black text-sm rounded-xl shadow-lg transition-all"
                onClick={onClose}
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Header Title */}
              <div>
                <span className="px-3 py-1 bg-brand-yellow text-slate-950 font-black text-[11px] uppercase rounded-md tracking-wider">
                  STARTUPS CHALLENGE 2027
                </span>
                <h2 className="font-festive text-2xl sm:text-3xl font-black text-slate-950 mt-2">
                  Dépôt de Candidature Officiel
                </h2>
              </div>

              {/* Step Navigation Tabs Bar */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className={`px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    step === 1 ? 'bg-slate-950 text-white shadow-md font-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold'
                  }`}
                >
                  <User size={14} />
                  <span>1. Candidat</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className={`px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    step === 2 ? 'bg-slate-950 text-white shadow-md font-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold'
                  }`}
                >
                  <Briefcase size={14} />
                  <span>2. Le Projet</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className={`px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    step === 3 ? 'bg-slate-950 text-white shadow-md font-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold'
                  }`}
                >
                  <DollarSign size={14} />
                  <span>3. Budget Dotation</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  className={`px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    step === 4 ? 'bg-slate-950 text-white shadow-md font-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold'
                  }`}
                >
                  <ImageIcon size={14} className="text-emerald-500" />
                  <Video size={14} className="text-purple-500" />
                  <span>4. Photo & Vidéo</span>
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold">
                  <AlertCircle size={20} className="shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* ÉTAPE 1: Coordonnées du Candidat & Localisation */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="font-festive text-sm text-slate-900 font-black uppercase tracking-wider border-b border-slate-200 pb-2">
                    Informations personnelles et localisation
                  </h3>

                  {/* 1. Nom et prénom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: ADANHO"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                        value={candidate.lastName}
                        onChange={(e) => setCandidate({ ...candidate, lastName: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Koffi Marc"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                        value={candidate.firstName}
                        onChange={(e) => setCandidate({ ...candidate, firstName: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* 2. Téléphone / WhatsApp & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Téléphone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+229 01 97 00 00 00"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                        value={candidate.phone}
                        onChange={(e) => setCandidate({ ...candidate, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Adresse Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="contact@monentreprise.bj"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                        value={candidate.email}
                        onChange={(e) => setCandidate({ ...candidate, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* 4. Localisation & Statut */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Localisation (Ville & Adresse) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Cotonou, Quartier Cadjehoun"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                        value={candidate.address ? `${candidate.city}, ${candidate.address}` : candidate.city}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCandidate({ ...candidate, city: val.split(',')[0] || val, address: val });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Statut de la structure *
                      </label>
                      <select
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                        value={candidate.status}
                        onChange={(e) => setCandidate({ ...candidate, status: e.target.value as CandidateStatus })}
                      >
                        {CANDIDATE_STATUSES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ÉTAPE 2: Description détaillée du Projet */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="font-festive text-sm text-slate-900 font-black uppercase tracking-wider border-b border-slate-200 pb-2">
                    Informations sur l'activité & le projet
                  </h3>

                  {/* 3. Nom du projet/entreprise */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Nom du projet / entreprise *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: NectarD'Or, BéninBio Farines..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                      value={project.name}
                      onChange={(e) => setProject({ ...project, name: e.target.value })}
                    />
                  </div>

                  {/* 5. Domaine d'activité & 11. Où en êtes-vous aujourd'hui ? */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-880 mb-1.5">
                        Domaine d'activité *
                      </label>
                      <select
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                        value={project.category}
                        onChange={(e) => setProject({ ...project, category: e.target.value as ProjectCategory })}
                      >
                        {PROJECT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Où en êtes-vous aujourd'hui ? (Stade de développement) *
                      </label>
                      <select
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none"
                        value={project.stage}
                        onChange={(e) => setProject({ ...project, stage: e.target.value as ProjectStage })}
                      >
                        {PROJECT_STAGES.map((stg) => (
                          <option key={stg} value={stg}>{stg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 6. Description du projet */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Description du projet *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Décrivez synthétiquement votre produit ou activité agroalimentaire..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                      value={project.description}
                      onChange={(e) => setProject({ ...project, description: e.target.value })}
                    />
                  </div>

                  {/* 7. Quel problème résolvez-vous ? & 8. Quelle est votre solution ? */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Quel problème résolvez-vous ? *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Ex: Pertes agricoles, mauvaise conservation, produits chimiques..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                        value={project.problem}
                        onChange={(e) => setProject({ ...project, problem: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Quelle est votre solution ? *
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Ex: Procédé de séchage solaire, emballage étanche, farines bio enrichies..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                        value={project.solution}
                        onChange={(e) => setProject({ ...project, solution: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* 9. Qui sont vos clients ? & 10. Comment gagnez-vous de l'argent ? */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Qui sont vos clients ? *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Ménages, supermarchés, restaurants, cantines..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                        value={project.targetClients}
                        onChange={(e) => setProject({ ...project, targetClients: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1.5">
                        Comment gagnez-vous de l'argent ? *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Vente directe de jus et conserves en gros et détails..."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                        value={project.revenueModel}
                        onChange={(e) => setProject({ ...project, revenueModel: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* 12. Quels résultats avez-vous déjà obtenus ? */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Quels résultats avez-vous déjà obtenus ? *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Ex: 1 500 unités vendues en 2026, 20 clients réguliers, certification obtenues..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                      value={project.resultsAchieved}
                      onChange={(e) => setProject({ ...project, resultsAchieved: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* ÉTAPE 3: 13. Que feriez-vous avec les 1 000 000 FCFA ? */}
              {step === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="font-festive text-sm text-slate-900 font-black uppercase tracking-wider border-b border-slate-200 pb-2">
                    Plan d'utilisation de la dotation
                  </h3>

                  {/* 13. Que feriez-vous avec les 1 000 000 FCFA ? */}
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Que feriez-vous avec les 1 000 000 FCFA ? *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Expliquez concrètement l'impact direct de la prime de 1 000 000 FCFA sur la croissance de votre entreprise..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none"
                      value={budgetExplanation}
                      onChange={(e) => setBudgetExplanation(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-slate-800">Détail des dépenses budgétisées :</span>
                    <span className={`text-xs font-black ${totalBudget > 1000000 ? 'text-red-600' : 'text-emerald-700'}`}>
                      Total : {totalBudget.toLocaleString()} / 1 000 000 FCFA
                    </span>
                  </div>


                  {budgetItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="sm:col-span-4">
                        <select
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none"
                          value={item.category}
                          onChange={(e) => handleBudgetItemChange(item.id, 'category', e.target.value)}
                        >
                          {BUDGET_CATEGORIES.map((bc) => (
                            <option key={bc} value={bc}>{bc}</option>
                          ))}
                        </select>
                      </div>
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          placeholder="Ex: Machine d'emballage et scelleuse sous vide"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                          value={item.description}
                          onChange={(e) => handleBudgetItemChange(item.id, 'description', e.target.value)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          placeholder="Montant FCFA (ex: 600000)"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                          value={item.amount || ''}
                          onChange={(e) => handleBudgetItemChange(item.id, 'amount', Number(e.target.value))}
                        />
                      </div>
                      <div className="sm:col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveBudgetItem(item.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddBudgetItem}
                    className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-festive text-xs font-bold rounded-xl border border-dashed border-slate-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Ajouter une ligne budgétaire
                  </button>
                </div>
              )}

              {/* ÉTAPE 4: 14. Photo du produit & 15. Vidéo de présentation */}
              {step === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <h3 className="font-festive text-sm text-slate-950 font-black uppercase tracking-wider">
                      4. Téléversement Photo Produit & Vidéo de Présentation
                    </h3>
                  </div>

                  {/* 14. Une photo du produit ou de l'activité */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-2">
                      <ImageIcon size={18} className="text-slate-950" />
                      <span>14. Une photo du produit ou de l'activité *</span>
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      <label className="cursor-pointer px-5 py-3 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-black flex items-center gap-2.5 shadow-md transition-all">
                        <Upload size={16} />
                        <span>Téléverser depuis l'appareil</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoFileUpload}
                        />
                      </label>
                    </div>
                    {productPhotoUrl && (
                      <div className="mt-3 flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-200">
                        <div className="w-20 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                          <img src={productPhotoUrl} alt="Aperçu produit" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col text-xs">
                          <span className="text-emerald-700 flex items-center gap-1 font-bold">
                            <CheckCircle2 size={16} /> Photo sélectionnée avec succès.
                          </span>
                          {photoFile && (
                            <span className="text-slate-500 text-[11px] mt-0.5">
                              {photoFile.name} ({(photoFile.size / (1024 * 1024)).toFixed(2)} Mo)
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 15. Une courte vidéo de présentation de 1 à 3 minutes */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-900 flex items-center gap-2">
                      <Video size={18} className="text-purple-700" />
                      <span>15. Une courte vidéo de présentation (1 à 3 minutes) *</span>
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                      <label className="cursor-pointer px-5 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-black flex items-center gap-2.5 shadow-md transition-all">
                        <Upload size={16} />
                        <span>Téléverser depuis l'appareil</span>
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoFileUpload}
                        />
                      </label>
                    </div>
                    {videoUrl && (
                      <div className="mt-3 bg-white p-3 rounded-xl border border-slate-200 text-xs text-emerald-700 flex flex-col gap-0.5 font-bold">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 size={16} /> Vidéo sélectionnée avec succès.
                        </span>
                        {videoFile && (
                          <span className="text-slate-500 font-normal text-[11px] pl-5">
                            {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} Mo)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Engagements & Certification */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <label className="flex items-start gap-3 text-xs text-slate-800 cursor-pointer font-semibold">
                      <input
                        type="checkbox"
                        className="mt-0.5 rounded border-slate-300 text-slate-950 focus:ring-0"
                        checked={certifiedExact}
                        onChange={(e) => setCertifiedExact(e.target.checked)}
                      />
                      <span>Je certifie sur l'honneur l'exactitude absolue des informations et pièces transmises.</span>
                    </label>

                    <label className="flex items-start gap-3 text-xs text-slate-800 cursor-pointer font-semibold">
                      <input
                        type="checkbox"
                        className="mt-0.5 rounded border-slate-300 text-slate-950 focus:ring-0"
                        checked={acceptedRules}
                        onChange={(e) => setAcceptedRules(e.target.checked)}
                      />
                      <span>J'accepte sans réserve le règlement officiel du Startups Challenge EAT & DRINK 2027.</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-festive text-xs font-bold rounded-xl transition-all flex items-center gap-2"
                  >
                    <ArrowLeft size={16} /> Précédent
                  </button>
                ) : <div></div>}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-slate-950 hover:bg-slate-800 text-white font-festive font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 uppercase tracking-wider"
                  >
                    Suivant <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 bg-brand-yellow hover:bg-yellow-400 text-slate-950 font-festive font-black text-xs rounded-xl shadow-xl transition-all uppercase tracking-wider flex items-center gap-2"
                  >
                    {loading ? (
                      <span>TRANSMISSION EN COURS...</span>
                    ) : (
                      <>
                        <Upload size={16} />
                        <span>SOUMETTRE MON DOSSIER COMPLET</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
