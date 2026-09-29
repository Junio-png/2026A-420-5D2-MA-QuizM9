import { Form, Link, data, redirect, useActionData, useLoaderData } from 'react-router';
import { apiFetch } from '../api-url.js';

/**
 * Mes questionnaires : ceux de l'auteur connecté, et seulement les siens.
 *
 * Rendu CÔTÉ SERVEUR : le loader s'exécute sur le serveur, AVANT le rendu.
 * Il transmet le cookie du navigateur à l'API (apiFetch) ; si l'API répond
 * 401, personne n'est connecté et on renvoie à l'accueil.
 */
export async function loader({ request }) {
  const response = await apiFetch(request, '/api/me/quizzes');
  if (response.status === 401) {
    throw redirect('/');
  }
  if (!response.ok) {
    throw new Error(`L'API répond ${response.status}.`);
  }
  return response.json();
}

/**
 * L'action qui crée ou supprime un questionnaire. React Router l'appelle
 * quand un <Form method="post"> de la page est envoyé ; elle s'exécute sur
 * le serveur, comme le loader, et transmet le cookie de la même façon. Le
 * champ caché « intent » dit quel formulaire a été envoyé.
 */
export async function action({ request }) {
  const formData = await request.formData();

  if (formData.get('intent') === 'delete') {
    return deleteQuiz(request, Number(formData.get('quizId')));
  }

  const response = await apiFetch(request, '/api/quizzes', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title: formData.get('title') }),
  });
  const body = await response.json();

  if (response.status === 401) {
    return redirect('/');
  }
  if (!response.ok) {
    // L'erreur retourne à la page, avec le code de l'API ; useActionData la lit.
    return data({ error: body.error }, { status: response.status });
  }
  // Créé : on envoie l'auteur remplir son questionnaire.
  return redirect(`/quizzes/${body.id}/edit`);
}

async function deleteQuiz(request, quizId) {
  const response = await apiFetch(request, `/api/quizzes/${quizId}`, { method: 'DELETE' });
  if (response.status === 401) {
    return redirect('/');
  }
  if (!response.ok) {
    const body = await response.json();
    return data({ error: body.error }, { status: response.status });
  }
  return { deleted: true };
}

export default function Quizzes() {
  const quizzes = useLoaderData();
  const actionData = useActionData();

  return (
    <main className="screen">
      <h1>Mes questionnaires</h1>
      {actionData?.error && <p className="error">{actionData.error}</p>}
      {quizzes.length === 0 && <p>Vous n'avez pas encore de questionnaire.</p>}
      <ul className="quiz-list">
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="card row">
            <div>
              <h2>
                <Link to={`/quizzes/${quiz.id}`}>{quiz.title}</Link>
              </h2>
              <p className="progress">{quiz.questionCount} questions</p>
            </div>
            <div className="actions">
              <Link className="button" to={`/quizzes/${quiz.id}/edit`}>Modifier</Link>
              {/* Un formulaire POST, pas un lien : supprimer modifie les données. */}
              <Form method="post">
                <input type="hidden" name="intent" value="delete" />
                <input type="hidden" name="quizId" value={quiz.id} />
                <button className="secondary">Supprimer</button>
              </Form>
            </div>
          </li>
        ))}
      </ul>

      {/* Un formulaire HTML classique : method et action, comme au livre
          d'or. <Form> de React Router l'envoie à l'action de cette route
          sans recharger la page, et rejoue le loader ensuite. */}
      <Form method="post" className="card">
        <h2>Nouveau questionnaire</h2>
        <label>
          Titre
          <input name="title" placeholder="Titre du questionnaire" required />
        </label>
        <button>Créer</button>
      </Form>
    </main>
  );
}
