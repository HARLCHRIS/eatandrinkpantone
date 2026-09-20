/**
 * @file supabase/functions/verify-turnstile/index.ts
 * @description Supabase Edge Function pour la vérification serveur des tokens Cloudflare Turnstile.
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();
    const secretKey = Deno.env.get('TURNSTILE_SECRET_KEY');

    if (!token || !secretKey) {
      console.error('[Verify Turnstile] Données manquantes:', { hasToken: Boolean(token), hasSecret: Boolean(secretKey) });
      return new Response(
        JSON.stringify({ success: false, message: 'Token ou clé secrète manquant.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const verifyResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      }
    );

    const verifyData = await verifyResponse.json();
    console.log('[Verify Turnstile Result]:', verifyData);

    return new Response(
      JSON.stringify({
        success: verifyData.success === true,
        errorCodes: verifyData['error-codes'] || [],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[Verify Turnstile Exception]:', message);
    return new Response(
      JSON.stringify({ success: false, message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
