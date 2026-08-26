/**
 * Regénère data/quiz.db à partir de rien. À lancer depuis la racine :
 *
 *     node server/data/create_quiz_db.mjs
 *
 * Le fichier quiz.db est versionné : ce script ne sert que si on veut
 * changer le questionnaire de démonstration.
 */
import { DatabaseSync } from 'node:sqlite';
import { existsSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const path = fileURLToPath(new URL('./quiz.db', import.meta.url));
if (existsSync(path)) unlinkSync(path);

const db = new DatabaseSync(path);

db.exec(`
  CREATE TABLE quiz (
    id    INTEGER PRIMARY KEY,
    title TEXT NOT NULL
  );

  CREATE TABLE question (
    id               INTEGER PRIMARY KEY,
    quiz_id          INTEGER NOT NULL REFERENCES quiz(id),
    position         INTEGER NOT NULL,
    text             TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL
  );

  CREATE TABLE choice (
    id          INTEGER PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES question(id),
    text        TEXT NOT NULL,
    is_correct  INTEGER NOT NULL DEFAULT 0
  );
`);

db.prepare('INSERT INTO quiz (id, title) VALUES (1, ?)').run(
  'Révision express du développement web',
);

const questions = [
  {
    text: 'Quel code de statut HTTP signifie « Créé » ?',
    duration: 20,
    choices: [['200', 0], ['201', 1], ['404', 0], ['500', 0]],
  },
  {
    text: 'Dans Express, où se trouve la valeur de :id dans la route /api/films/:id ?',
    duration: 20,
    choices: [['req.params', 1], ['req.query', 0], ['req.body', 0], ['res.locals', 0]],
  },
  {
    text: 'Quelle méthode HTTP sert à créer une ressource dans une API REST ?',
    duration: 20,
    choices: [['GET', 0], ['POST', 1], ['PUT', 0], ['DELETE', 0]],
  },
  {
    text: 'Dans React, quel crochet exécute du code après le rendu du composant ?',
    duration: 20,
    choices: [['useState', 0], ['useEffect', 1], ['useMemo', 0], ['useRef', 0]],
  },
  {
    text: 'Deux routes GET déclarées sur le même chemin : que fait Express ?',
    duration: 20,
    choices: [
      ['Il refuse de démarrer', 0],
      ['Il exécute les deux', 0],
      ['Seule la première répond, la seconde est du code mort', 1],
      ['Seule la dernière répond', 0],
    ],
  },
];

const insertQuestion = db.prepare(
  'INSERT INTO question (quiz_id, position, text, duration_seconds) VALUES (1, ?, ?, ?)',
);
const insertChoice = db.prepare(
  'INSERT INTO choice (question_id, text, is_correct) VALUES (?, ?, ?)',
);

questions.forEach((q, i) => {
  const { lastInsertRowid } = insertQuestion.run(i + 1, q.text, q.duration);
  for (const [text, isCorrect] of q.choices) {
    insertChoice.run(lastInsertRowid, text, isCorrect);
  }
});

db.close();
console.log(`quiz.db regénéré : ${questions.length} questions.`);
