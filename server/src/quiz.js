/**
 * Lecture du questionnaire dans data/quiz.db (SQLite).
 *
 * Le fichier est ouvert en lecture seule, une seule fois, au démarrage du
 * serveur. Trois tables : quiz, question, choice.
 */
import { DatabaseSync } from 'node:sqlite';

/**
 * @param {string} path  chemin du fichier quiz.db
 * @returns {{id: number, title: string, questions: Array<{id: number,
 *   text: string, durationSeconds: number, choices: Array<{id: number,
 *   text: string, isCorrect: boolean}>}>}}
 */
export function loadQuiz(path) {
  const db = new DatabaseSync(path, { readOnly: true });

  // TODO : lire le questionnaire, ses questions et leurs choix, puis
  // construire l'objet documenté ci-dessus.
  //
  // Les requêtes SQL dont vous avez besoin :
  //
  //   SELECT id, title FROM quiz LIMIT 1
  //
  //   SELECT id, text, duration_seconds
  //     FROM question
  //    WHERE quiz_id = ?
  //    ORDER BY position
  //
  //   SELECT id, text, is_correct FROM choice WHERE question_id = ? ORDER BY id
  //
  // Le mode d'emploi de node:sqlite :
  //
  //   db.prepare(sql).get(...params)   → la première ligne (un objet)
  //   db.prepare(sql).all(...params)   → toutes les lignes (un tableau)
  //
  // Attention aux conversions : la base dit « duration_seconds » et
  // « is_correct » (0 ou 1) ; l'objet attendu dit « durationSeconds » et
  // « isCorrect » (booléen). Fermez la base avec db.close() avant de renvoyer.

  db.close();
  return { id: 0, title: 'À FAIRE', questions: [] };
}
