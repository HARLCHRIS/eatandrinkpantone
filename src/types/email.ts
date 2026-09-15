/**
 * @file src/types/email.ts
 * @description Types TypeScript stricts pour l'envoi d'emails transactionnels via Brevo API et Supabase.
 * Aucune utilisation de 'any'.
 */

/**
 * Représente un destinataire d'email transactionnel.
 */
export interface EmailRecipient {
  email: string;
  name?: string;
}

/**
 * Représente l'expéditeur d'un email transactionnel.
 */
export interface EmailSender {
  email: string;
  name: string;
}

/**
 * Types de notifications par email prédéfinis pour le concours.
 */
export type EmailNotificationType =
  | 'APPLICATION_CONFIRMATION'
  | 'ADMIN_NOTIFICATION'
  | 'STATUS_UPDATE'
  | 'EVALUATION_ASSIGNED'
  | 'CUSTOM_MESSAGE';

/**
 * Payload complet de la requête d'envoi d'email transmise au serveur.
 */
export interface SendEmailRequestPayload {
  to: EmailRecipient[];
  sender?: EmailSender;
  subject: string;
  htmlContent: string;
  textContent?: string;
  templateId?: number;
  params?: Record<string, string | number | boolean>;
  replyTo?: EmailRecipient;
  notificationType: EmailNotificationType;
  applicationId?: string;
}

/**
 * Réponse renvoyée par le serveur après la tentative d'envoi d'email Brevo.
 */
export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  message: string;
  timestamp: string;
}

/**
 * État asynchrone standardisé (gestion stricte des 3 états : loading, success, error).
 */
export interface TransactionalEmailState {
  loading: boolean;
  success: boolean;
  error: string | null;
  data: SendEmailResult | null;
}

/**
 * Paramètres pour l'envoi de confirmation de candidature.
 */
export interface ApplicationConfirmationParams {
  candidateEmail: string;
  candidateName: string;
  projectName: string;
  applicationId: string;
}

/**
 * Paramètres pour l'envoi de notification de changement de statut.
 */
export interface StatusUpdateEmailParams {
  candidateEmail: string;
  candidateName: string;
  projectName: string;
  applicationId: string;
  newStatus: string;
  customNote?: string;
}
