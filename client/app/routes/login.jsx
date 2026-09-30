import { Form, data, redirect, useActionData } from 'react-router';
import { apiFetch } from '../api-url.js';

/**
 * Se connecter : avec GitHub, ou par mot de passe pour les comptes de
 * démonstration (alice / alice).
 *
 * Comme la déconnexion, l'API pose la session dans SA réponse (Set-Cookie) ;
 * l'action recopie cet en-tête vers le navigateur.
 */
export async function action({ request }) {
  const formData = await request.formData();
  const response = await apiFetch(request, '/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      login: formData.get('login'),
      password: formData.get('password'),
    }),
  });
  if (!response.ok) {
    const body = await response.json();
    return data({ error: body.error }, { status: response.status });
  }
  return redirect('/quizzes', {
    headers: { 'set-cookie': response.headers.get('set-cookie') ?? '' },
  });
}

export default function Login() {
  const actionData = useActionData();

  return (
    <main className="screen">
      <h1>Se connecter</h1>

      <section className="card">
        {/* Un lien ordinaire, pas un <Link> : on quitte l'application pour
            aller chez GitHub, et on en reviendra par une redirection. */}
        <a className="button" href="/api/auth/github">Se connecter avec GitHub</a>
      </section>

      <Form method="post" className="card">
        <h2>Compte de démonstration</h2>
        <label>
          Identifiant
          <input name="login" autoComplete="username" required />
        </label>
        <label>
          Mot de passe
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        {actionData?.error && <p className="error">{actionData.error}</p>}
        <button>Se connecter</button>
      </Form>
    </main>
  );
}
