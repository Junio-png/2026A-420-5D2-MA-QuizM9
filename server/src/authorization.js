/**
 * L'autorisation : qui a le droit de faire quoi. Trois intergiciels
 * (middleware) à placer devant les routes, dans app.js :
 *
 *   app.get('/api/quizzes/:id', requireAccount, requireQuizAuthor, (req, res) => …)
 *
 * Express les exécute dans l'ordre. Chacun répond lui-même (401, 403, 404)
 * et s'arrête là, ou appelle next() pour passer au suivant. Ce qu'il a
 * trouvé en chemin, il le range dans req pour la suite : req.account,
 * req.quiz, req.game.
 *
 * Les rôles :
 *   visiteur         pas de session : le catalogue, et jouer avec un pseudonyme
 *   compte connecté  créer ses questionnaires, animer une partie
 *   auteur           modifier SON questionnaire ; l'animateur, avancer SA partie
 *   administrateur   account.is_admin : passe partout où passe l'auteur
 */
import * as repository from './repository/index.js';
import { currentAccount } from './auth.js';

/**
 * 401 si personne n'est connecté ; sinon req.account est le compte.
 *
 * À faire (exercice 12, jalon 1). Pour l'instant, laisse tout passer.
 */
export async function requireAccount(req, res, next) {
  next();
}

/**
 * Le questionnaire du paramètre :id, modifiable par le compte connecté.
 * 404 s'il n'existe pas, 403 s'il est à quelqu'un d'autre ; sinon
 * req.quiz est le questionnaire. S'utilise APRÈS requireAccount.
 *
 * À faire (exercice 12, jalons 2 et 4). Pour l'instant, laisse tout passer.
 */
export async function requireQuizAuthor(req, res, next) {
  next();
}

/**
 * La partie du paramètre :code, animée par le compte connecté. 404 si elle
 * n'existe pas, 403 si le compte n'est pas son animateur ; sinon req.game
 * est la partie. S'utilise APRÈS requireAccount.
 *
 * À faire (exercice 12, jalon 3). Pour l'instant, laisse tout passer.
 */
export async function requireGameHost(req, res, next) {
  next();
}
