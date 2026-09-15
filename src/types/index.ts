/**
 * Types TypeScript complets pour la plateforme du Concours Entrepreneurial Agroalimentaire.
 * Aucun usage du type 'any'.
 */

export * from './email';

export type UserRole = 'public' | 'admin' | 'jury';

export type CandidateStatus =
  | 'Entrepreneur'
  | 'Porteur de projet'
  | 'Startup'
  | 'Entreprise'
  | 'Association / organisation';

export type ProjectCategory =
  | 'Transformation agroalimentaire'
  | 'Production agricole avec transformation'
  | 'Boissons'
  | 'Produits alimentaires transformés'
  | 'Conservation / stockage'
  | 'Emballage / conditionnement'
  | 'Distribution agroalimentaire'
  | 'Technologie appliquée à l\'agroalimentaire'
  | 'Autre';

export type ProjectStage =
  | 'Idée'
  | 'Prototype'
  | 'Premières ventes'
  | 'Activité en cours'
  | 'Entreprise déjà établie'
  | 'En phase de développement';

export type ApplicationStatus =
  | 'NOUVELLE'
  | 'EN ÉVALUATION'
  | 'PRÉSÉLECTIONNÉE'
  | 'NON RETENUE'
  | 'FINALISTE'
  | 'LAURÉAT';

export type BudgetCategory =
  | 'Matières premières'
  | 'Équipement'
  | 'Production'
  | 'Emballage'
  | 'Marketing / communication'
  | 'Distribution'
  | 'Autre';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  amount: number;
  description: string;
}

export interface FestivalExperience {
  id: string;
  title: string;
  slogan: string;
  imageUrl: string;
  category: string;
  badgeColor: string;
}

export interface CandidateInfo {
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  status: CandidateStatus;
}

export interface ProjectInfo {
  name: string;
  sector: string;
  category: ProjectCategory;
  description: string;
  problem: string;
  solution: string;
  targetClients: string;
  revenueModel: string;
  competitors: string;
  differentiation: string;
  stage: ProjectStage;
  existenceDuration: string;
  resultsAchieved: string;
  approximateRevenue?: string;
}

export interface BudgetPlan {
  explanation: string;
  items: BudgetItem[];
  total: number;
}

export interface MediaFiles {
  logoUrl?: string;
  productPhotoUrl?: string;
  activityPhotoUrl?: string;
  videoUrl?: string;
}

export interface ValidationInfo {
  certifiedExact: boolean;
  acceptedRules: boolean;
}

export interface Application {
  id: string;
  submittedAt: string;
  status: ApplicationStatus;
  candidate: CandidateInfo;
  project: ProjectInfo;
  budget: BudgetPlan;
  media: MediaFiles;
  validation: ValidationInfo;
  assignedJuryIds: string[];
}

export type SelectionCriteriaKey =
  | 'problemRelevance'
  | 'innovation'
  | 'commercialPotential'
  | 'localEconomicImpact'
  | 'feasibility'
  | 'traction'
  | 'founderQuality';

export interface CriteriaDefinition {
  key: SelectionCriteriaKey;
  title: string;
  maxPoints: number;
  description: string;
}

export interface JuryEvaluation {
  id: string;
  applicationId: string;
  juryId: string;
  juryName: string;
  scores: Record<SelectionCriteriaKey, number>; // 0 to 10 for each
  feedback?: string;
  evaluatedAt: string;
  totalWeightedScore: number; // calculated out of 100 points
}

export interface ApplicationSummaryWithScore {
  application: Application;
  averageScore: number;
  evaluationsCount: number;
  rank?: number;
}

export interface CompetitionConfig {
  festivalName: string;
  organizerName: string;
  prizeAmountFCFA: number;
  launchDate: string;
  closingDate: string;
  pitchDate: string;
  awardCeremonyDate: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface FilterState {
  search: string;
  category: string;
  city: string;
  status: string;
}

export interface FestivalChallenge {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  reward: string;
  objective: string;
  badgeTag: string;
  badgeColor: string;
  imageUrl?: string;
  isPitchChallenge?: boolean;
}

export interface WindowDimensions {
  width: number;
  height: number;
  isMobile: boolean;
}

