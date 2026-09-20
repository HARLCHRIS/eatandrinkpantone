import { useState } from 'react';
import { useTransactionalEmail } from './useTransactionalEmail';
import { supabase } from '../config/supabaseClient';
import type {
  Application,
  CandidateInfo,
  ProjectInfo,
  BudgetItem,
  CandidateStatus,
  ProjectCategory,
  ProjectStage,
} from '../types';

export interface UseCandidateFormProps {
  onSubmitApplication: (app: Application) => Promise<boolean>;
}

export interface UseCandidateFormReturn {
  step: number;
  loading: boolean;
  error: string | null;
  success: boolean;
  candidate: CandidateInfo;
  project: ProjectInfo;
  budgetExplanation: string;
  budgetItems: BudgetItem[];
  totalBudget: number;
  productPhotoUrl: string;
  videoUrl: string;
  photoFile: File | null;
  videoFile: File | null;
  certifiedExact: boolean;
  acceptedRules: boolean;
  setCandidate: React.Dispatch<React.SetStateAction<CandidateInfo>>;
  setProject: React.Dispatch<React.SetStateAction<ProjectInfo>>;
  setBudgetExplanation: (val: string) => void;
  setProductPhotoUrl: (val: string) => void;
  setVideoUrl: (val: string) => void;
  setPhotoFile: (file: File | null) => void;
  setVideoFile: (file: File | null) => void;
  setCertifiedExact: (val: boolean) => void;
  setAcceptedRules: (val: boolean) => void;
  handleAddBudgetItem: () => void;
  handleRemoveBudgetItem: (id: string) => void;
  handleBudgetItemChange: (id: string, field: keyof BudgetItem, value: string | number) => void;
  goToStep: (targetStep: number) => void;
  nextStep: () => boolean;
  prevStep: () => void;
  submitForm: (e: React.FormEvent, turnstileToken?: string) => Promise<void>;
  resetForm: () => void;
}

const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100 Mo

/**
 * Hook personnalisé de gestion du formulaire de candidature pour le concours.
 * Exige la présence d'une photo du produit ou d'une vidéo de présentation avant la soumission.
 * Téléverse les médias natifs vers Supabase Storage 'submissions-media'.
 *
 * @param {UseCandidateFormProps} props - Props contenant la fonction d'enregistrement de la candidature.
 * @returns {UseCandidateFormReturn} État et handlers pour le formulaire.
 */
export const useCandidateForm = ({
  onSubmitApplication,
}: UseCandidateFormProps): UseCandidateFormReturn => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Étape 1 : Infos Candidat (Nom/Prénom, Téléphone/WhatsApp, Email, Localisation)
  const [candidate, setCandidate] = useState<CandidateInfo>({
    lastName: '',
    firstName: '',
    phone: '',
    email: '',
    city: 'Cotonou',
    address: '',
    status: 'Startup' as CandidateStatus,
  });

  // Étape 2 : Infos Projet (Nom, Domaine, Description, Problème, Solution, Clients, Modèle éco, Stade, Résultats)
  const [project, setProject] = useState<ProjectInfo>({
    name: '',
    sector: 'Agroalimentaire',
    category: 'Transformation agroalimentaire' as ProjectCategory,
    description: '',
    problem: '',
    solution: '',
    targetClients: '',
    revenueModel: '',
    competitors: '',
    differentiation: '',
    stage: 'Premières ventes' as ProjectStage,
    existenceDuration: '',
    resultsAchieved: '',
    approximateRevenue: '',
  });

  // Étape 3 : Budget Dotation (Champs vides par défaut avec placeholders)
  const [budgetExplanation, setBudgetExplanation] = useState<string>('');
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: 'b-1', category: 'Équipement', amount: 0, description: '' },
  ]);

  // Étape 4 : Médias obligatoires (Stockage direct des objets File)
  const [productPhotoUrl, setProductPhotoUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [certifiedExact, setCertifiedExact] = useState<boolean>(true);
  const [acceptedRules, setAcceptedRules] = useState<boolean>(true);

  const { sendApplicationConfirmation, sendAdminNotification } = useTransactionalEmail();

  const totalBudget = budgetItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

  const handleAddBudgetItem = () => {
    setBudgetItems([
      ...budgetItems,
      { id: `b-${Date.now()}`, category: 'Autre', amount: 100000, description: '' },
    ]);
  };

  const handleRemoveBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter((i) => i.id !== id));
  };

  const handleBudgetItemChange = (id: string, field: keyof BudgetItem, value: string | number) => {
    setBudgetItems(
      budgetItems.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const validateStep = (currentStep: number): boolean => {
    setError(null);
    if (currentStep === 1) {
      if (!candidate.lastName.trim() || !candidate.firstName.trim()) {
        setError('Le nom et le prénom sont obligatoires.');
        return false;
      }
      if (!candidate.phone.trim()) {
        setError('Le numéro de téléphone / WhatsApp est obligatoire.');
        return false;
      }
    } else if (currentStep === 2) {
      if (!project.name.trim()) {
        setError('Le nom du projet / entreprise est obligatoire.');
        return false;
      }
    } else if (currentStep === 3) {
      if (totalBudget > 1000000) {
        setError('Le budget total ne peut pas dépasser la dotation maximale de 1 000 000 FCFA.');
        return false;
      }
    } else if (currentStep === 4) {
      if (!photoFile && !videoFile && !productPhotoUrl.trim() && !videoUrl.trim()) {
        setError('Veuillez téléverser une photo du produit/activité ou une vidéo de présentation pour valider votre dossier.');
        return false;
      }
    }
    return true;
  };

  const goToStep = (targetStep: number) => {
    setError(null);
    setStep(Math.max(1, Math.min(targetStep, 4)));
  };

  const nextStep = (): boolean => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
      return true;
    }
    return false;
  };

  const prevStep = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const submitForm = async (e: React.FormEvent, turnstileToken?: string) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    // Contrôle strict de la présence d'au moins la photo ou la vidéo
    if (!photoFile && !videoFile && !productPhotoUrl.trim() && !videoUrl.trim()) {
      setError('Veuillez téléverser une photo du produit/activité ou ajouter une vidéo de présentation pour valider votre dossier.');
      setLoading(false);
      return;
    }

    if (photoFile && photoFile.size > MAX_PHOTO_SIZE_BYTES) {
      setError('La taille de la photo ne doit pas dépasser 10 Mo.');
      setLoading(false);
      return;
    }

    if (videoFile && videoFile.size > MAX_VIDEO_SIZE_BYTES) {
      setError('La taille de la vidéo ne doit pas dépasser 100 Mo.');
      setLoading(false);
      return;
    }

    if (!certifiedExact || !acceptedRules) {
      setError('Vous devez certifier l\'exactitude des informations et accepter le règlement.');
      setLoading(false);
      return;
    }

    if (!turnstileToken) {
      setError('Veuillez valider la vérification de sécurité avant de soumettre.');
      setLoading(false);
      return;
    }

    try {
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
      const verifyRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-turnstile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`,
            'apikey': anonKey,
          },
          body: JSON.stringify({ token: turnstileToken }),
        }
      );
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        if (typeof window !== 'undefined' && window.turnstile) {
          try {
            window.turnstile.reset();
          } catch (_e) {
            // Ignorer si reset indisponible
          }
        }

        const hasTimeoutOrDuplicate =
          (Array.isArray(verifyData.errorCodes) && verifyData.errorCodes.includes('timeout-or-duplicate')) ||
          (typeof verifyData.message === 'string' && verifyData.message.includes('timeout-or-duplicate'));

        if (hasTimeoutOrDuplicate) {
          setError('La vérification de sécurité a expiré. Veuillez cocher à nouveau la case de vérification puis soumettre votre dossier.');
        } else {
          setError(
            verifyData.message ||
              (verifyData.errorCodes && verifyData.errorCodes.length > 0
                ? `Vérification échouée (${verifyData.errorCodes.join(', ')}). Veuillez réessayer.`
                : 'Vérification de sécurité échouée. Le jeton a été réinitialisé, veuillez revalider le captcha.')
          );
        }
        setLoading(false);
        return;
      }
    } catch (_verifyErr) {
      setError('Erreur réseau lors de la vérification de sécurité. Veuillez réessayer.');
      setLoading(false);
      return;
    }

    let finalPhotoUrl = 'https://images.unsplash.com/photo-1546171753-97d7676e418b?w=800&q=80';
    let finalVideoUrl = 'https://www.youtube.com/watch?v=demo-presentation-eat-drink';

    try {
      const uploadPromises: Promise<void>[] = [];

      if (photoFile) {
        uploadPromises.push(
          (async () => {
            const photoExt = photoFile.name.split('.').pop();
            const photoPath = `photos/${Date.now()}-${crypto.randomUUID()}.${photoExt}`;
            const { error: photoError } = await supabase.storage
              .from('submissions-media')
              .upload(photoPath, photoFile);
            if (photoError) throw new Error('Échec upload photo : ' + photoError.message);
            const { data: photoUrlData } = supabase.storage
              .from('submissions-media')
              .getPublicUrl(photoPath);
            finalPhotoUrl = photoUrlData.publicUrl;
          })()
        );
      }

      if (videoFile) {
        uploadPromises.push(
          (async () => {
            const videoExt = videoFile.name.split('.').pop();
            const videoPath = `videos/${Date.now()}-${crypto.randomUUID()}.${videoExt}`;
            const { error: videoError } = await supabase.storage
              .from('submissions-media')
              .upload(videoPath, videoFile);
            if (videoError) throw new Error('Échec upload vidéo : ' + videoError.message);
            const { data: videoUrlData } = supabase.storage
              .from('submissions-media')
              .getPublicUrl(videoPath);
            finalVideoUrl = videoUrlData.publicUrl;
          })()
        );
      }

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }
    } catch (uploadErr) {
      setError(uploadErr instanceof Error ? uploadErr.message : 'Erreur lors du téléversement des fichiers.');
      setLoading(false);
      return;
    }

    const newApplication: Application = {
      id: `CAND-2027-${Date.now().toString().slice(-5)}`,
      submittedAt: new Date().toISOString(),
      status: 'NOUVELLE',
      candidate,
      project,
      budget: {
        explanation: budgetExplanation || 'Plan de dotation pour équipement et matières premières.',
        items: budgetItems,
        total: totalBudget,
      },
      media: {
        productPhotoUrl: finalPhotoUrl,
        videoUrl: finalVideoUrl,
      },
      validation: {
        certifiedExact,
        acceptedRules,
      },
      assignedJuryIds: [],
    };

    const isSaved = await onSubmitApplication(newApplication);
    setLoading(false);

    if (isSaved) {
      setSuccess(true);

      // 1. Email de confirmation au candidat
      sendApplicationConfirmation({
        candidateEmail: candidate.email,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        projectName: project.name,
        applicationId: newApplication.id,
      }).catch((err) => {
        console.warn('Notification email candidat non envoyée:', err);
      });

      // 2. Notification complète à l'organisateur
      sendAdminNotification(newApplication).catch((err) => {
        console.warn('Notification admin non envoyée:', err);
      });
    } else {
      setError('Échec de la soumission du dossier. Veuillez réessayer.');
    }
  };

  const resetForm = () => {
    setStep(1);
    setLoading(false);
    setError(null);
    setSuccess(false);
    setProductPhotoUrl('');
    setVideoUrl('');
    setPhotoFile(null);
    setVideoFile(null);
  };

  return {
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
    resetForm,
  };
};

