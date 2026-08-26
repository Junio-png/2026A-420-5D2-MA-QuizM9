/**
 * Quiz M9 — le serveur de la salle de jeu, version semaine 1.
 *
 * L'état des parties vit en mémoire (voir game.js). Le questionnaire vient
 * de data/quiz.db, lu une fois au démarrage. Le client interroge l'état par
 * sondage HTTP toutes les secondes — c'est la dette de la semaine 1, à
 * régler la semaine 7.
 *
 * Le contrat de l'API :
 *
 *   POST /api/games                    201 { code }
 *   POST /api/games/:code/players      201 { nickname }   corps : { nickname }
 *   GET  /api/games/:code              200 état public
 *   POST /api/games/:code/next         200 état public
 *   POST /api/games/:code/answers      201 {}             corps : { nickname, choiceId }
 *
 * Toute erreur a la forme { error: "un message" } : 404 si la partie
 * n'existe pas, 400 pour une demande invalide.
 */
import express from 'express';
import { fileURLToPath } from 'node:url';
import { loadQuiz } from './quiz.js';
import {
  advance,
  closeQuestion,
  closeQuestionIfExpired,
  createGame,
  currentQuestion,
  findGame,
  publicState,
} from './game.js';

const app = express();
app.use(express.json());

const quiz = loadQuiz(
  fileURLToPath(new URL('../data/quiz.db', import.meta.url)),
);

/** Retrouve la partie du paramètre :code, ou répond 404. */
function requestedGame(req, res) {
  const game = findGame(req.params.code);
  if (!game) {
    res.status(404).json({ error: 'Partie introuvable.' });
    return null;
  }
  return game;
}

// Créer une partie (animateur).
app.post('/api/games', (req, res) => {
  const game = createGame(quiz);
  res.status(201).json({ code: game.code });
});

// Rejoindre une partie avec un pseudonyme (joueur).
app.post('/api/games/:code/players', (req, res) => {
  const game = requestedGame(req, res);
  if (!game) return;

  const nickname = typeof req.body?.nickname === 'string' ? req.body.nickname.trim() : '';
  if (nickname === '') {
    return res.status(400).json({ error: 'Le pseudonyme est obligatoire.' });
  }
  if (game.state !== 'lobby') {
    return res.status(400).json({ error: 'La partie est déjà commencée.' });
  }
  if (game.players.has(nickname)) {
    return res.status(400).json({ error: 'Ce pseudonyme est déjà pris.' });
  }

  game.players.set(nickname, { nickname, score: 0 });
  res.status(201).json({ nickname });
});

// L'état de la partie — la route que le client sonde toutes les secondes.
app.get('/api/games/:code', (req, res) => {
  const game = requestedGame(req, res);
  if (!game) return;

  closeQuestionIfExpired(game);
  res.status(200).json(publicState(game));
});

// L'animateur avance : clôt la question en cours, ou passe à la suivante.
app.post('/api/games/:code/next', (req, res) => {
  const game = requestedGame(req, res);
  if (!game) return;

  closeQuestionIfExpired(game);
  if (game.state === 'question') {
    closeQuestion(game);
  } else {
    advance(game);
  }
  res.status(200).json(publicState(game));
});

// Un joueur répond à la question en cours.
app.post('/api/games/:code/answers', (req, res) => {
  const game = requestedGame(req, res);
  if (!game) return;

  closeQuestionIfExpired(game);
  if (game.state !== 'question') {
    return res.status(400).json({ error: 'Aucune question en cours.' });
  }

  const { nickname, choiceId } = req.body ?? {};
  if (!game.players.has(nickname)) {
    return res.status(400).json({ error: 'Joueur inconnu dans cette partie.' });
  }
  if (game.answers.has(nickname)) {
    return res.status(400).json({ error: 'Ce joueur a déjà répondu.' });
  }
  const question = currentQuestion(game);
  if (!question.choices.some((c) => c.id === choiceId)) {
    return res.status(400).json({ error: 'Choix inconnu pour cette question.' });
  }

  // Le moment de la réponse est celui du SERVEUR : le bonus de rapidité ne
  // se négocie pas avec l'horloge du client (on y reviendra, semaine 11).
  game.answers.set(nickname, { choiceId, receivedAt: Date.now() });
  res.status(201).json({});
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Quiz M9 — serveur démarré sur http://localhost:${port}`);
});
