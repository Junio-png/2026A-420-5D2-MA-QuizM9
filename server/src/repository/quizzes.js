/**
 * Les lectures des questionnaires. Tout le SQL sur quiz, question et choice
 * vit ici — nulle part ailleurs.
 */
import { db } from './db.js';

/**
 * Écrite en démonstration — votre MODÈLE pour une lecture.
 *
 * Tous les questionnaires, avec leur nombre de questions.
 * @returns {Array<{id: number, title: string, questionCount: number}>}
 */
export function listQuizzes() {
  return db
    .prepare(
      `SELECT quiz.id, quiz.title, COUNT(question.id) AS questionCount
         FROM quiz
         LEFT JOIN question ON question.quiz_id = quiz.id
        GROUP BY quiz.id
        ORDER BY quiz.id`,
    )
    .all();
}

/**
 * Un questionnaire complet : ses questions en ordre, leurs choix, et où est
 * la bonne réponse. C'est la version pour le moteur de jeu et pour l'auteur
 * — jamais pour un joueur en pleine partie.
 *
 * @returns {null | {id, title, questions: Array<{id, text, durationSeconds,
 *   choices: Array<{id, text, isCorrect}>}>}}
 */
export function getQuizWithQuestions(quizId) {
  const quiz = db.prepare('SELECT id, title FROM quiz WHERE id = ?').get(quizId);
  if (!quiz) return null;

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

  return { id: quiz.id, title: quiz.title, questions };
}
