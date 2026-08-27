import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { createGame, fetchQuizzes } from '../api.js';
import { saveSession } from '../session.js';

/**
 * Le catalogue public : tous les questionnaires jouables. Les données sont
 * chargées DANS LE NAVIGATEUR, après le rendu — du rendu côté client.
 */
export default function Catalogue() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuizzes().then(setQuizzes).catch((e) => setError(e.message));
  }, []);

  async function host(quizId) {
    try {
      const { code } = await createGame(quizId);
      saveSession(code, { role: 'host' });
      navigate(`/salon/${code}`);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="screen">
      <h1>Catalogue</h1>
      {error && <p className="error">{error}</p>}
      {!quizzes && !error && <p>Chargement…</p>}
      {quizzes?.map((quiz) => (
        <section key={quiz.id} className="card row">
          <div>
            <h2>{quiz.title}</h2>
            <p className="progress">{quiz.questionCount} questions</p>
          </div>
          <button onClick={() => host(quiz.id)}>Animer</button>
        </section>
      ))}
    </main>
  );
}
