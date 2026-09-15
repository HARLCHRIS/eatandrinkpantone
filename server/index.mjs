/**
 * @file server/index.mjs
 * @description Serveur d'envoi d'email transactionnel Node.js léger pour développement local.
 * Exécute l'appel API Brevo v3 côté serveur en lisant BREVO_API_KEY depuis process.env ou le fichier .env.
 * Protège les clés API contre toute fuite vers le navigateur.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Charge manuellement le fichier .env sans dépendance externe
 */
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const val = valueParts.join('=').trim();
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    }
  }
}

loadEnv();

const PORT = process.env.EMAIL_SERVER_PORT || 3001;

const server = http.createServer((req, res) => {
  // Headers CORS pour autoriser le frontend Vite
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/send-email') {
    let bodyData = '';

    req.on('data', (chunk) => {
      bodyData += chunk;
    });

    req.on('end', async () => {
      try {
        const apiKey = process.env.BREVO_API_KEY;
        if (!apiKey || apiKey.includes('your-actual-brevo-api-key')) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: false,
              message:
                'BREVO_API_KEY non valide ou non configurée dans le fichier .env (doit contenir votre clé réelle xkeysib-...).',
              timestamp: new Date().toISOString(),
            })
          );
          return;
        }

        const payload = JSON.parse(bodyData);
        const defaultSenderEmail = process.env.BREVO_SENDER_EMAIL || 'concours@festival-agro-benin.bj';
        const defaultSenderName = process.env.BREVO_SENDER_NAME || 'Festival Agro-Innovation Bénin';

        const brevoPayload = {
          sender: payload.sender || {
            email: defaultSenderEmail,
            name: defaultSenderName,
          },
          to: payload.to,
          subject: payload.subject,
          htmlContent: payload.htmlContent,
          ...(payload.textContent ? { textContent: payload.textContent } : {}),
          ...(payload.templateId ? { templateId: payload.templateId } : {}),
          ...(payload.params ? { params: payload.params } : {}),
        };

        console.log(`[Brevo Server Proxy] Envoi d'email vers ${payload.to.map((r) => r.email).join(', ')}...`);

        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'api-key': apiKey,
            'content-type': 'application/json',
          },
          body: JSON.stringify(brevoPayload),
        });

        const resJson = await brevoRes.json();

        if (!brevoRes.ok) {
          console.error('[Brevo Server Proxy] Erreur Brevo:', resJson);
          res.writeHead(brevoRes.status, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              success: false,
              message: resJson.message || 'Erreur Brevo API lors de l envoi.',
              timestamp: new Date().toISOString(),
            })
          );
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: true,
            messageId: resJson.messageId,
            message: 'Email transactionnel Brevo envoyé avec succès.',
            timestamp: new Date().toISOString(),
          })
        );
      } catch (err) {
        console.error('[Brevo Server Proxy] Exception:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: false,
            message: `Erreur serveur d email: ${err.message}`,
            timestamp: new Date().toISOString(),
          })
        );
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, message: 'Endpoint non trouvé' }));
});

server.listen(PORT, () => {
  console.log(`🚀 Serveur proxy d'email transactionnel Brevo à l'écoute sur http://localhost:${PORT}/api/send-email`);
});
