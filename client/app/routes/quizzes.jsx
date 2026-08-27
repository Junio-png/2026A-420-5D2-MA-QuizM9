import { Link, useLoaderData } from 'react-router';

/**
 * La liste de l'animateur : ses questionnaires. (Tous, en fait — les
 * comptes arrivent à la semaine 5.)
 *
 * Rendu CÔTÉ SERVEUR : le loader s'exécute sur le serveur, AVANT le rendu.
 * Affichez la source de la page — les titres y sont, déjà en HTML.
 */
export async function loader() {
  // Ici, pas de relais Vite : on appelle l'API par son adresse complète.
  const response = await fetch('http://localhost:3000/api/quizzes');
  if (!response.ok) {
    throw new Error(`L'API répond ${response.status}.`);
  }
  return response.json();
}

export default function Quizzes() {
  const quizzes = useLoaderData();

  return (
    <main className="screen">
      <h1>Mes questionnaires</h1>
      <ul className="quiz-list">
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="card row">
            <div>
              <h2>
                <Link to={`/quizzes/${quiz.id}`}>{quiz.title}</Link>
              </h2>
              <p className="progress">{quiz.questionCount} questions</p>
            </div>
            <Link className="button" to={`/quizzes/${quiz.id}/edit`}>Modifier</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
