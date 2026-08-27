import { Link, useParams } from 'react-router';

/**
 * L'éditeur de questionnaire — une MAQUETTE. Créer et modifier un
 * questionnaire depuis le navigateur, c'est la semaine 3 (les `action`).
 */
export default function QuizEdit() {
  const { id } = useParams();

  return (
    <main className="screen">
      <h1>Éditeur de questionnaire</h1>
      <p className="notice">
        Maquette — l'enregistrement arrive à la semaine 3.
      </p>
      <p>
        <Link to={`/quizzes/${id}`}>← Retour au questionnaire</Link>
      </p>

      <form className="card">
        <label>
          Titre
          <input disabled placeholder="Titre du questionnaire" />
        </label>
        <label>
          Question 1
          <input disabled placeholder="Texte de la question" />
        </label>
        <label>
          Durée (secondes)
          <input disabled type="number" placeholder="20" />
        </label>
        <button disabled>Enregistrer</button>
      </form>
    </main>
  );
}
