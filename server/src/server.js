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
  // TODO : créer la partie avec createGame(quiz) et répondre
  // 201 { code }.
  res.status(500).json({ error: 'À faire.' });
});

// Rejoindre une partie avec un pseudonyme (joueur).
app.post('/api/games/:code/players', (req, res) => {
  const game = requestedGame(req, res);
  if (!game) return;

  // TODO : valider puis inscrire le joueur.
  //
  // - le pseudonyme vient de req.body.nickname : refuser (400) s'il est
  //   absent, n'est pas une chaîne, ou est vide une fois coupé avec trim() ;
  // - refuser (400) si la partie n'est plus dans l'état 'lobby' ;
  // - refuser (400) si le pseudonyme est déjà dans game.players ;
  // - sinon : game.players.set(nickname, { nickname, score: 0 }) et
  //   répondre 201 { nickname }.
  res.status(500).json({ error: 'À faire.' });
});

// L'état de la partie — la route que le client sonde toutes les secondes.
app.get('/api/games/:code', (req, res) => {
  const game = requestedGame(req, res);
  if (!game) return;

  // TODO : clore la question si son échéance est passée
  // (closeQuestionIfExpired), puis répondre 200 avec publicState(game).
  res.status(500).json({ error: 'À faire.' });
});

// L'animateur avance : clôt la question en cours, ou passe à la suivante.
app.post('/api/games/:code/next', (req, res) => {
  const game = requestedGame(req, res);
  if (!game) return;

  // TODO : d'abord closeQuestionIfExpired(game). Ensuite :
  //
  // - si une question est encore en cours (state 'question'), la clore avec
  //   closeQuestion(game) — l'animateur passe au classement ;
  // - sinon, advance(game) — question suivante, ou fin de partie.
  //
  // Dans les deux cas, répondre 200 avec publicState(game).
  res.status(500).json({ error: 'À faire.' });
});

// Un joueur répond à la question en cours.
app.post('/api/games/:code/answers', (req, res) => {
  const game = requestedGame(req, res);
  if (!game) return;

  // TODO : enregistrer la réponse { nickname, choiceId } de req.body.
  //
  // Dans l'ordre :
  // - closeQuestionIfExpired(game) : une réponse qui arrive après
  //   l'échéance trouve la question close ;
  // - refuser (400) si game.state n'est pas 'question' ;
  // - refuser (400) si le pseudonyme n'est pas dans game.players ;
  // - refuser (400) si le joueur a déjà répondu (game.answers) ;
  // - refuser (400) si le choiceId n'appartient pas à la question courante
  //   (currentQuestion(game)) ;
  // - sinon : game.answers.set(nickname, { choiceId, receivedAt: Date.now() })
  //   et répondre 201 {}.
  //
  // Le moment de la réponse est celui du SERVEUR : le bonus de rapidité ne
  // se négocie pas avec l'horloge du client (on y reviendra, semaine 11).
  res.status(500).json({ error: 'À faire.' });
});

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  console.log(`Quiz M9 — serveur démarré sur http://localhost:${port}`);
});
