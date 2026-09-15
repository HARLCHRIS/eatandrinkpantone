/**
 * @file src/components/TransactionalEmailModal.tsx
 * @description Modal UI d'envoi d'email transactionnel via Brevo API côté serveur.
 * Vérifie le rôle de l'utilisateur ('admin' ou 'jury') et gère les 3 états (loading, success, error).
 */

import React, { useState } from 'react';
import { Mail, Send, X, AlertCircle, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import { useTransactionalEmail } from '../hooks/useTransactionalEmail';
import type { UserRole, Application } from '../types';

interface TransactionalEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  currentUserRole: UserRole;
}

/**
 * Modal d'envoi d'email transactionnel sécurisé.
 *
 * @param props Propriétés du composant modal d'email.
 */
export const TransactionalEmailModal: React.FC<TransactionalEmailModalProps> = ({
  isOpen,
  onClose,
  application,
  currentUserRole,
}) => {
  const { loading, success, error, data, sendEmail, resetState } = useTransactionalEmail();

  const [subject, setSubject] = useState<string>(
    application ? `Notification - Concours Agro : Candidature "${application.project.name}"` : ''
  );
  const [customMessage, setCustomMessage] = useState<string>('');

  if (!isOpen || !application) return null;

  // 1. RÈGLE 6 : Vérifier le rôle utilisateur avant d'autoriser l'envoi d'email
  const isAuthorized = currentUserRole === 'admin' || currentUserRole === 'jury';

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4 border border-red-100">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Accès non autorisé</h3>
          <p className="text-sm text-gray-600">
            Seuls les administrateurs et membres du jury autorisés peuvent envoyer des emails transactionnels.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !customMessage.trim()) return;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background-color: #15803d; padding: 16px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Festival Agro-Innovation Bénin 2026</h1>
        </div>
        <div style="padding: 20px 0;">
          <p style="font-size: 16px; color: #1f2937;">Bonjour <strong>${application.candidate.firstName} ${application.candidate.lastName}</strong>,</p>
          <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
            ${customMessage.replace(/\n/g, '<br>')}
          </p>
          <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px; border-left: 4px solid #166534;">
            <p style="margin: 0; font-size: 13px; color: #64748b;"><strong>Dossier concerné :</strong> ${application.project.name}</p>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;"><strong>Référence :</strong> ${application.id}</p>
          </div>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
          Cet email vous a été envoyé via l'API transactionnelle Brevo (exécutée côté serveur).
        </p>
      </div>
    `;

    await sendEmail({
      to: [
        {
          email: application.candidate.email,
          name: `${application.candidate.firstName} ${application.candidate.lastName}`,
        },
      ],
      subject,
      htmlContent,
      notificationType: 'CUSTOM_MESSAGE',
      applicationId: application.id,
    });
  };

  const handleCloseModal = () => {
    resetState();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-green-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Mail className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Email Transactionnel Brevo</h3>
              <p className="text-xs text-emerald-200">Envoi sécurisé côté serveur (Clé API protégée)</p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Informations destinataire */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 flex items-center justify-between text-sm">
            <div>
              <span className="text-emerald-800 font-medium">Destinataire :</span>{' '}
              <span className="font-semibold text-gray-900">
                {application.candidate.firstName} {application.candidate.lastName}
              </span>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-mono px-2.5 py-1 rounded-md">
              {application.candidate.email}
            </span>
          </div>

          {/* GESTION DES 3 ÉTATS (RÈGLE 5) */}

          {/* État 1 : ERREUR */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-bold text-red-900">Échec de l'envoi de l'email</p>
                <p className="mt-1 text-red-700">{error}</p>
                <p className="mt-2 text-xs text-red-500">
                  Vérifiez la clé <code>BREVO_API_KEY</code> dans le fichier <code>.env</code> ou dans les secrets Supabase Edge Functions.
                </p>
              </div>
            </div>
          )}

          {/* État 2 : SUCCÈS */}
          {success && data && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-green-900 text-lg">Email envoyé avec succès !</h4>
              <p className="text-sm text-green-700">{data.message}</p>
              {data.messageId && (
                <p className="text-xs font-mono bg-white inline-block px-3 py-1 rounded-md border border-green-200 text-green-800">
                  MessageID: {data.messageId}
                </p>
              )}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}

          {/* Formulaire d'envoi (quand pas encore en succès) */}
          {!success && (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Sujet de l'email
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  placeholder="Sujet de votre message..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Contenu du message
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  disabled={loading}
                  required
                  rows={6}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                  placeholder="Saisissez le corps du message à transmettre au candidat..."
                />
              </div>

              {/* État 3 : CHARGEMENT */}
              <div className="pt-3 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={loading}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading || !subject.trim() || !customMessage.trim()}
                  className="px-6 py-2.5 bg-emerald-700 text-white font-medium rounded-xl text-sm hover:bg-emerald-800 disabled:opacity-50 flex items-center gap-2 transition shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Envoi serveur...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Envoyer via Brevo API</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
