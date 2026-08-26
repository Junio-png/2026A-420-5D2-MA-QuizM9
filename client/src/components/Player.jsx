import { useState } from 'react';
import { useGame } from '../useGame.js';
import { sendAnswer } from '../api.js';
import Leaderboard from './Leaderboard.jsx';
import Countdown from './Countdown.jsx';

export default function Player({ code, nickname }) {
  const game = useGame(code);
  // L'index de la dernière question à laquelle on a répondu : le bouton se
  // désactive après un clic, puis se réactive à la question suivante.
  const [answeredIndex, setAnsweredIndex] = useState(null);

  if (!game) return <main className="screen">Chargement…</main>;

  const hasAnswered = answeredIndex === game.questionIndex;

  async function answer(choiceId) {
    setAnsweredIndex(game.questionIndex);
    try {
      await sendAnswer(code, nickname, choiceId);
    } catch {
      // Trop tard, ou déjà répondu : le classement tranchera.
    }
  }

  return (
    <main className="screen">
      <header className="header">
        <h1>{game.title}</h1>
        <p className="code">{nickname} — partie {game.code}</p>
      </header>

      {game.state === 'lobby' && (
        <>
          <h2>En attente de l'animateur…</h2>
          <Leaderboard players={game.players} currentNickname={nickname} />
        </>
      )}

      {game.state === 'question' && (
        <>
          <p className="progress">
            Question {game.questionIndex + 1} / {game.questionCount}
          </p>
          <h2>{game.question.text}</h2>
          <Countdown deadline={game.question.deadline} />
          {hasAnswered ? (
            <p>Réponse envoyée. On attend les autres…</p>
          ) : (
            <div className="choices">
              {game.question.choices.map((c) => (
                <button key={c.id} onClick={() => answer(c.id)}>
                  {c.text}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {game.state === 'results' && (
        <>
          <h2>Classement</h2>
          <Leaderboard players={game.players} currentNickname={nickname} />
        </>
      )}

      {game.state === 'finished' && (
        <>
          <h2>Partie terminée 🎉</h2>
          <Leaderboard players={game.players} currentNickname={nickname} />
        </>
      )}
    </main>
  );
}
