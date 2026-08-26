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

  const quiz = db
    .prepare('SELECT id, title FROM quiz LIMIT 1')
    .get();

  const questions = db
    .prepare(
      `SELECT id, text, duration_seconds
         FROM question
        WHERE quiz_id = ?
        ORDER BY position`,
    )
    .all(quiz.id)
    .map((q) => ({
      id: q.id,
      text: q.text,
      durationSeconds: q.duration_seconds,
      choices: db
        .prepare('SELECT id, text, is_correct FROM choice WHERE question_id = ? ORDER BY id')
        .all(q.id)
        .map((c) => ({ id: c.id, text: c.text, isCorrect: c.is_correct === 1 })),
    }));

  db.close();
  return { id: quiz.id, title: quiz.title, questions };
}
