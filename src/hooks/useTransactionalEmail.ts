import { useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../config/supabaseClient';
import type { Application } from '../types';
import type {
  SendEmailRequestPayload,
  SendEmailResult,
  TransactionalEmailState,
  ApplicationConfirmationParams,
  StatusUpdateEmailParams,
} from '../types/email';

/**
 * URL du service d'email local ou configuré (fallback si Supabase Edge Function n'est pas activée)
 */
const EMAIL_SERVICE_URL =
  import.meta.env.VITE_EMAIL_SERVICE_URL || 'http://localhost:3001/api/send-email';

/**
 * Hook personnalisé gérant l'envoi d'emails transactionnels côté serveur.
 * Gère strictement les 3 états : loading, success et error.
 *
 * @returns Objet contenant l'état asynchrone et les méthodes d'envoi d'emails.
 */
export function useTransactionalEmail() {
  const [state, setState] = useState<TransactionalEmailState>({
    loading: false,
    success: false,
    error: null,
    data: null,
  });

  /**
   * Réinitialise les états de chargement, succès et d'erreur du hook.
   */
  const resetState = useCallback(() => {
    setState({
      loading: false,
      success: false,
      error: null,
      data: null,
    });
  }, []);

  /**
   * Fonction principale d'envoi d'email via le serveur.
   * Transmet la requête soit à la Supabase Edge Function `send-transactional-email`,
   * soit au serveur proxy local si Supabase n'est pas déployé en local.
   *
   * @param payload Données d'envoi de l'email transactionnel.
   * @returns Résultat d'exécution d'envoi d'email.
   */
  const sendEmail = useCallback(
    async (payload: SendEmailRequestPayload): Promise<SendEmailResult> => {
      setState({ loading: true, success: false, error: null, data: null });

      try {
        let result: SendEmailResult;

        // Tenter en priorité l'appel sécurisé via Supabase Edge Functions si Supabase est configuré
        if (isSupabaseConfigured()) {
          const { data, error } = await supabase.functions.invoke('send-transactional-email', {
            body: payload,
          });

          if (error) {
            throw new Error(error.message || 'Erreur lors de l appel de la Supabase Edge Function');
          }

          result = data as SendEmailResult;
        } else {
          // Sinon, utiliser le serveur proxy local dédié (http://localhost:3001/api/send-email)
          const res = await fetch(EMAIL_SERVICE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const json = await res.json();

          if (!res.ok || !json.success) {
            throw new Error(json.message || `Erreur serveur HTTP ${res.status}`);
          }

          result = json as SendEmailResult;
        }

        setState({
          loading: false,
          success: true,
          error: null,
          data: result,
        });

        return result;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.';

        const errorResult: SendEmailResult = {
          success: false,
          message: errorMsg,
          timestamp: new Date().toISOString(),
        };

        setState({
          loading: false,
          success: false,
          error: errorMsg,
          data: errorResult,
        });

        return errorResult;
      }
    },
    []
  );

  /**
   * Envoie un email de confirmation de réception de candidature au candidat.
   *
   * @param params Informations du candidat et de la candidature.
   */
  const sendApplicationConfirmation = useCallback(
    async (params: ApplicationConfirmationParams): Promise<SendEmailResult> => {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <img src="https://eatandrink.pantoneafrica.com/EATDRINKCOTONOU8_VECTORIEL%20noire.png" alt="Eat and Drink Cotonou Festival" style="max-width: 180px; margin-bottom: 15px; display: block;" />
          <h2 style="color: #166534; margin-bottom: 5px;">EAT AND DRINK COTONOU FESTIVAL</h2>
          <p style="margin-top: 0; font-weight: bold; color: #92400e; text-transform: uppercase; letter-spacing: 1px; font-size: 13px;">Startup Challenge</p>
          <p>Bonjour <strong>${params.candidateName}</strong>,</p>
          <p>Nous avons bien reçu votre dossier de candidature pour le projet <strong>"${params.projectName}"</strong> (Ref: <code>${params.applicationId}</code>).</p>
          <p>Votre dossier est désormais enregistré et entre dans la phase de revue administrative et d'évaluation par notre comité d'experts.</p>
          <div style="background-color: #f0fdf4; padding: 15px; border-left: 4px solid #15803d; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #166534;">Prochaines étapes :</p>
            <ul style="margin: 5px 0 0 20px; color: #374151;">
              <li>Évaluation par le jury restreint</li>
              <li>Annonce de la liste des candidats pré-sélectionnés</li>
              <li>Invitation aux sessions de coaching & pitch</li>
            </ul>
          </div>
          <p>Si vous avez des questions, n'hésitez pas à nous contacter via <a href="https://eatandrink.pantoneafrica.com" target="_blank">eatandrink.pantoneafrica.com</a>.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Cordialement,<br>L'équipe d'organisation du EAT AND DRINK COTONOU FESTIVAL</p>
        </div>
      `;

      return sendEmail({
        to: [{ email: params.candidateEmail, name: params.candidateName }],
        subject: `Confirmation de réception - Candidature "${params.projectName}"`,
        htmlContent,
        notificationType: 'APPLICATION_CONFIRMATION',
        applicationId: params.applicationId,
      });
    },
    [sendEmail]
  );

  const sendAdminNotification = useCallback(
    async (application: Application): Promise<SendEmailResult> => {
      const { candidate, project, budget, media } = application;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <img src="https://eatandrink.pantoneafrica.com/EATDRINKCOTONOU8_VECTORIEL%20noire.png" alt="Eat and Drink Cotonou Festival" style="max-width: 180px; margin-bottom: 15px; display: block;" />
          <h2 style="color: #1e3a8a; margin-bottom: 5px;">EAT AND DRINK COTONOU FESTIVAL</h2>
          <p style="margin-top: 0; font-weight: bold; color: #92400e; text-transform: uppercase; letter-spacing: 1px; font-size: 13px;">Startup Challenge — Nouvelle candidature reçue</p>
          <p><strong>Référence :</strong> ${application.id}</p>
          <p><strong>Soumise le :</strong> ${new Date(application.submittedAt).toLocaleString('fr-FR')}</p>

          <h3 style="color: #166534; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">1. Candidat</h3>
          <p><strong>Nom :</strong> ${candidate.lastName} ${candidate.firstName}</p>
          <p><strong>Téléphone / WhatsApp :</strong> ${candidate.phone}</p>
          <p><strong>Email :</strong> ${candidate.email}</p>
          <p><strong>Localisation :</strong> ${candidate.city}${candidate.address ? ', ' + candidate.address : ''}</p>
          <p><strong>Statut :</strong> ${candidate.status}</p>

          <h3 style="color: #166534; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">2. Le Projet</h3>
          <p><strong>Nom du projet/entreprise :</strong> ${project.name}</p>
          <p><strong>Domaine d'activité :</strong> ${project.category}</p>
          <p><strong>Où en êtes-vous aujourd'hui :</strong> ${project.stage}</p>
          <p><strong>Description :</strong> ${project.description}</p>
          <p><strong>Quel problème résolvez-vous :</strong> ${project.problem}</p>
          <p><strong>Quelle est votre solution :</strong> ${project.solution}</p>
          <p><strong>Qui sont vos clients :</strong> ${project.targetClients}</p>
          <p><strong>Comment gagnez-vous de l'argent :</strong> ${project.revenueModel}</p>
          <p><strong>Résultats déjà obtenus :</strong> ${project.resultsAchieved}</p>

          <h3 style="color: #166534; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">3. Utilisation de la dotation</h3>
          <p><strong>Explication :</strong> ${budget.explanation}</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background-color: #f3f4f6;">
              <th style="text-align: left; padding: 8px; border: 1px solid #e5e7eb;">Catégorie</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #e5e7eb;">Description</th>
              <th style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">Montant (FCFA)</th>
            </tr>
            ${budget.items
              .map(
                (item) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.category}</td>
                <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.description}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">${item.amount.toLocaleString()}</td>
              </tr>
            `
              )
              .join('')}
            <tr style="font-weight: bold; background-color: #f9fafb;">
              <td colspan="2" style="padding: 8px; border: 1px solid #e5e7eb;">Total</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #e5e7eb;">${budget.total.toLocaleString()} FCFA</td>
            </tr>
          </table>

          <h3 style="color: #166534; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-top: 20px;">4. Photo & Vidéo</h3>
          <p><strong>Photo du produit :</strong> <a href="${media.productPhotoUrl}" target="_blank">Voir la photo</a></p>
          <p><strong>Vidéo de présentation :</strong> <a href="${media.videoUrl}" target="_blank">Voir la vidéo</a></p>

          <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Cordialement,<br>L'équipe d'organisation du EAT AND DRINK COTONOU FESTIVAL</p>
        </div>
      `;

      return sendEmail({
        to: [{ email: 'agence@pantoneafrica.com' }],
        subject: `Nouvelle candidature : ${project.name} (${candidate.lastName} ${candidate.firstName})`,
        htmlContent,
        notificationType: 'ADMIN_NOTIFICATION',
        applicationId: application.id,
      });
    },
    [sendEmail]
  );

  /**
   * Envoie une notification par email au candidat lors du changement d'état de sa candidature.
   *
   * @param params Détails de la mise à jour du statut.
   */
  const sendStatusUpdateNotification = useCallback(
    async (params: StatusUpdateEmailParams): Promise<SendEmailResult> => {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <img src="https://eatandrink.pantoneafrica.com/EATDRINKCOTONOU8_VECTORIEL%20noire.png" alt="Eat and Drink Cotonou Festival" style="max-width: 180px; margin-bottom: 15px; display: block;" />
          <h2 style="color: #166534; margin-bottom: 5px;">EAT AND DRINK COTONOU FESTIVAL</h2>
          <p style="margin-top: 0; font-weight: bold; color: #92400e; text-transform: uppercase; letter-spacing: 1px; font-size: 13px;">Startup Challenge — Notification du Jury</p>
          <p>Bonjour <strong>${params.candidateName}</strong>,</p>
          <p>Le statut de votre dossier <strong>"${params.projectName}"</strong> (Ref: <code>${params.applicationId}</code>) a été mis à jour.</p>
          <div style="background-color: #eff6ff; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
            <span style="font-size: 14px; color: #4b5563;">Nouveau statut :</span><br>
            <strong style="font-size: 20px; color: #1d4ed8; text-transform: uppercase;">${params.newStatus}</strong>
          </div>
          ${
            params.customNote
              ? `<div style="background-color: #f9fafb; padding: 12px; border-left: 3px solid #9ca3af; margin-bottom: 20px;">
                  <p style="margin:0; font-size: 14px; color: #4b5563;"><strong>Note du comité :</strong> ${params.customNote}</p>
                </div>`
              : ''
          }
          <p>Vous pouvez consulter les détails de votre candidature depuis la plateforme officielle via <a href="https://eatandrink.pantoneafrica.com" target="_blank">eatandrink.pantoneafrica.com</a>.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">Cordialement,<br>L'équipe d'organisation du EAT AND DRINK COTONOU FESTIVAL</p>
        </div>
      `;

      return sendEmail({
        to: [{ email: params.candidateEmail, name: params.candidateName }],
        subject: `Mise à jour de votre candidature - Statut: ${params.newStatus}`,
        htmlContent,
        notificationType: 'STATUS_UPDATE',
        applicationId: params.applicationId,
      });
    },
    [sendEmail]
  );

  return {
    state,
    loading: state.loading,
    success: state.success,
    error: state.error,
    data: state.data,
    sendEmail,
    sendApplicationConfirmation,
    sendAdminNotification,
    sendStatusUpdateNotification,
    resetState,
  };
}
