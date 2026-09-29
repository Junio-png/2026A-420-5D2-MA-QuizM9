import { redirect } from 'react-router';
import { apiFetch } from '../api-url.js';

/**
 * ATELIER : devenir un compte de test sans mot de passe (voir le serveur,
 * DEV_LOGIN, exercice 13). Une route sans page, seulement une action. Le
 * sélecteur de la barre de navigation est un <Form method="post"
 * action="/login-as"> avec un champ caché accountId.
 *
 * Comme la déconnexion, l'API pose la session dans SA réponse (Set-Cookie) ;
 * l'action recopie cet en-tête vers le navigateur.
 */
export async function action({ request }) {
  const form = await request.formData();
  const response = await apiFetch(request, '/api/dev/login-as', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ accountId: Number(form.get('accountId')) }),
  });
  return redirect('/catalogue', {
    headers: { 'set-cookie': response.headers.get('set-cookie') ?? '' },
  });
}
