/**
 * @file supabase/functions/send-transactional-email/index.ts
 * @description Supabase Edge Function (Deno Runtime).
 * Effectue l'envoi d'email transactionnel Brevo côté serveur de manière ultra-sécurisée.
 * La clé BREVO_API_KEY reste strictement côté serveur dans les secrets Deno / Supabase.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://eatandrink.pantoneafrica.com',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BrevoRecipient {
  email: string;
  name?: string;
}

interface BrevoSender {
  email: string;
  name: string;
}

interface IncomingEmailPayload {
  to: BrevoRecipient[];
  sender?: BrevoSender;
  subject: string;
  htmlContent: string;
  textContent?: string;
  templateId?: number;
  params?: Record<string, string | number | boolean>;
  replyTo?: BrevoRecipient;
}

serve(async (req: Request) => {
  // Gérer la requête CORS de pré-vérification (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Extraire la clé Brevo depuis les variables d'environnement du serveur Deno
    const apiKey = Deno.env.get('BREVO_API_KEY');
    if (!apiKey) {
      console.error('BREVO_API_KEY absente des variables d environnement serveur Deno.');
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Erreur de configuration serveur : BREVO_API_KEY non configurée dans Supabase Secrets.',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const defaultSenderEmail = Deno.env.get('BREVO_SENDER_EMAIL') || 'concours@festival-agro-benin.bj';
    const defaultSenderName = Deno.env.get('BREVO_SENDER_NAME') || 'Festival Agro-Innovation Bénin';

    // 2. Parser le corps de la requête client
    const body: IncomingEmailPayload = await req.json();

    if (!body.to || !Array.isArray(body.to) || body.to.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Destinataire invalide ou manquant.',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Préparer le payload Brevo v3 SMTP Email
    const brevoPayload = {
      sender: body.sender || {
        email: defaultSenderEmail,
        name: defaultSenderName,
      },
      to: body.to,
      subject: body.subject,
      htmlContent: body.htmlContent,
      ...(body.textContent ? { textContent: body.textContent } : {}),
      ...(body.templateId ? { templateId: body.templateId } : {}),
      ...(body.params ? { params: body.params } : {}),
      ...(body.replyTo ? { replyTo: body.replyTo } : {}),
    };

    // 4. Appel HTTP vers l'API Brevo v3
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(brevoPayload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Erreur retournée par l API Brevo:', responseData);
      return new Response(
        JSON.stringify({
          success: false,
          message: responseData.message || 'Échec de l envoi d email via Brevo.',
          timestamp: new Date().toISOString(),
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 5. Envoi réussi
    return new Response(
      JSON.stringify({
        success: true,
        messageId: responseData.messageId || 'sent',
        message: 'Email transactionnel envoyé avec succès via Brevo API.',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur serveur inconnue.';
    console.error('Exception lors du traitement de l email:', errorMessage);

    return new Response(
      JSON.stringify({
        success: false,
        message: `Erreur serveur: ${errorMessage}`,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
