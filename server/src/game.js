/**
 * L'état des parties, EN MÉMOIRE. Tout est perdu au redémarrage du serveur —
 * c'est le problème que la semaine 2 règle.
 *
 * Une partie (game) :
 *   {
 *     code,            // six chiffres, affiché par l'animateur
 *     quiz,            // chargé de quiz.db au démarrage
 *     state,           // 'lobby' | 'question' | 'results' | 'finished'
 *     questionIndex,   // -1 dans le salon
 *     players,         // Map nickname -> { nickname, score }
 *     answers,         // Map nickname -> { choiceId, receivedAt } (question courante)
 *     openedAt,        // horodatage serveur d'ouverture de la question
 *     deadline,        // openedAt + durée de la question
 *   }
 */
import { calculateScore } from './scoring.js';

const games = new Map();

/** Un code de partie à six chiffres, unique parmi les parties en cours. */
function generateCode() {
  let code;
  do {
    code = String(Math.floor(100000 + Math.random() * 900000));
  } while (games.has(code));
  return code;
}

export function createGame(quiz) {
  const game = {
    code: generateCode(),
    quiz,
    state: 'lobby',
    questionIndex: -1,
    players: new Map(),
    answers: new Map(),
    openedAt: null,
    deadline: null,
  };
  games.set(game.code, game);
  return game;
}

export function findGame(code) {
  return games.get(code) ?? null;
}

export function currentQuestion(game) {
  return game.quiz.questions[game.questionIndex] ?? null;
}

/**
 * Clôt la question courante : calcule le pointage de chaque réponse reçue
 * et l'ajoute au total du joueur. Le bonus de la première bonne réponse va à
 * la première bonne réponse dans l'ordre d'arrivée (horloge du serveur).
 */
export function closeQuestion(game) {
  if (game.state !== 'question') return;
  const question = currentQuestion(game);
  const correctChoices = new Set(question.choices.filter((c) => c.isCorrect).map((c) => c.id));
  const questionDurationMs = question.durationSeconds * 1000;

  const inArrivalOrder = [...game.answers.entries()].sort(
    (a, b) => a[1].receivedAt - b[1].receivedAt,
  );

  let firstAwarded = false;
  for (const [nickname, answer] of inArrivalOrder) {
    const responseTimeMs = answer.receivedAt - game.openedAt;
    const isCorrect = correctChoices.has(answer.choiceId);
    const isFirstCorrectAnswer =
      isCorrect && responseTimeMs <= questionDurationMs && !firstAwarded;
    if (isFirstCorrectAnswer) firstAwarded = true;

    game.players.get(nickname).score += calculateScore({
      isCorrect,
      responseTimeMs,
      questionDurationMs,
      isFirstCorrectAnswer,
    });
  }

  game.state = 'results';
  game.answers = new Map();
  game.openedAt = null;
  game.deadline = null;
}

/** Clôt la question courante si son échéance est passée. */
export function closeQuestionIfExpired(game) {
  if (game.state === 'question' && Date.now() > game.deadline) {
    closeQuestion(game);
  }
}

/** Passe à la question suivante, ou termine la partie s'il n'y en a plus. */
export function advance(game) {
  if (game.state === 'finished') return;
  if (game.questionIndex + 1 >= game.quiz.questions.length) {
    game.state = 'finished';
    return;
  }
  game.questionIndex += 1;
  game.state = 'question';
  game.answers = new Map();
  game.openedAt = Date.now();
  game.deadline = game.openedAt + currentQuestion(game).durationSeconds * 1000;
}

/**
 * L'état visible par les clients. Les choix sont transmis SANS is_correct :
 * le serveur ne dit jamais au navigateur où est la bonne réponse.
 */
export function publicState(game) {
  const question = game.state === 'question' ? currentQuestion(game) : null;
  return {
    code: game.code,
    state: game.state,
    questionIndex: game.questionIndex,
    questionCount: game.quiz.questions.length,
    title: game.quiz.title,
    question: question && {
      text: question.text,
      deadline: game.deadline,
      choices: question.choices.map((c) => ({ id: c.id, text: c.text })),
    },
    players: [...game.players.values()]
      .map((p) => ({ nickname: p.nickname, score: p.score }))
      .sort((a, b) => b.score - a.score || a.nickname.localeCompare(b.nickname)),
    answerCount: game.answers.size,
  };
}
