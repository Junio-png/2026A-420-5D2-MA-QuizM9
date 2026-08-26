/**
 * Les règles de pointage de Quiz M9. Fixées pour toute la session.
 *
 * - Bonne réponse : 5 points.
 * - Bonus de rapidité : jusqu'à 3 points de plus, décroissant avec le temps
 *   de réponse. Formule : floor(3 × (1 − temps/durée)), jamais négatif.
 * - Bonus de la première bonne réponse : 2 points, une seule fois par
 *   question.
 * - Une réponse après l'échéance vaut 0.
 * - Une mauvaise réponse vaut 0.
 *
 * Une question vaut donc 10 points au maximum.
 *
 * Cette fonction est PURE : elle ne lit ni l'horloge, ni la base, ni l'état
 * de la partie. Tout ce dont elle a besoin arrive en paramètre. C'est ce qui
 * la rend testable seule (semaine 4) et digne de confiance côté serveur
 * (semaine 11).
 *
 * @param {object} r
 * @param {boolean} r.isCorrect             le choix est le bon
 * @param {number}  r.responseTimeMs        temps de réponse, horloge du serveur
 * @param {number}  r.questionDurationMs    durée allouée à la question
 * @param {boolean} r.isFirstCorrectAnswer  première bonne réponse de la question
 * @returns {number} points obtenus, entier entre 0 et 10
 */
export function calculateScore({ isCorrect, responseTimeMs, questionDurationMs, isFirstCorrectAnswer }) {
  // TODO : appliquer les règles ci-dessus, dans l'ordre.
  //
  // 1. Une mauvaise réponse vaut 0.
  // 2. Une réponse après l'échéance (temps > durée) vaut 0.
  // 3. Sinon : 5 points, plus le bonus de rapidité, plus 2 si c'est la
  //    première bonne réponse.
  //
  // Bonus de rapidité : Math.floor(3 * (1 - responseTimeMs / questionDurationMs)),
  // jamais négatif.
  //
  // Les cinq premières vérifications de « npm run verifier » testent cette
  // fonction directement, sans serveur : commencez ici.
  return 0;
}
