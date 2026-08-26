import { useGame } from '../useGame.js';
import { nextQuestion } from '../api.js';
import Leaderboard from './Leaderboard.jsx';
import Countdown from './Countdown.jsx';

export default function Host({ code }) {
  const game = useGame(code);

  if (!game) return <main className="screen">Chargement…</main>;

  async function advance() {
    try {
      await nextQuestion(code);
    } catch {
      // L'état suivant arrivera par le sondage.
    }
  }

  return (
    <main className="screen">
      <header className="header">
        <h1>{game.title}</h1>
        <p className="code">Code de partie : <strong>{game.code}</strong></p>
      </header>

      {game.state === 'lobby' && (
        <>
          <h2>Salon d'attente — {game.players.length} joueur(s)</h2>
          <Leaderboard players={game.players} />
          <button onClick={advance} disabled={game.players.length === 0}>
            Commencer la partie
          </button>
        </>
      )}

      {game.state === 'question' && (
        <>
          <p className="progress">
            Question {game.questionIndex + 1} / {game.questionCount}
          </p>
          <h2>{game.question.text}</h2>
          <Countdown deadline={game.question.deadline} />
          <p>{game.answerCount} / {game.players.length} réponse(s) reçue(s)</p>
          <button onClick={advance}>Clore la question</button>
        </>
      )}

      {game.state === 'results' && (
        <>
          <h2>Classement</h2>
          <Leaderboard players={game.players} />
          <button onClick={advance}>
            {game.questionIndex + 1 < game.questionCount ? 'Question suivante' : 'Terminer la partie'}
          </button>
        </>
      )}

      {game.state === 'finished' && (
        <>
          <h2>Partie terminée 🎉</h2>
          <Leaderboard players={game.players} />
        </>
      )}
    </main>
  );
}
