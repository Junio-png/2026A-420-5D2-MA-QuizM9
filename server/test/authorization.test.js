/**
 * Exercice 12 : qui peut faire quoi. Alice est l'autrice, Bob un autre
 * compte, root un administrateur.
 */
import { test, before, after } from 'node:test';
import { startServer } from './helpers.js';

let api;
let alice;
let bob;
let root;
before(async () => {
  api = await startServer();
  alice = await api.login('alice');
  bob = await api.login('bob');
  root = await api.login('root', { admin: true });
});
after(() => api.close());

/** Crée un questionnaire d'Alice, avec une question, et retourne son id. */
async function aliceQuiz() {
  const { data } = await api.request('POST', '/api/quizzes', { title: 'Le quiz d’Alice' }, alice);
  await api.request('POST', `/api/quizzes/${data.id}/questions`, {
    text: 'Capitale du Canada ?',
    durationSeconds: 20,
    choices: [
      { text: 'Ottawa', isCorrect: true },
      { text: 'Toronto', isCorrect: false },
    ],
  }, alice);
  return data.id;
}

// ── Jalon 1 : il faut un compte ───────────────────────────────────────────

test.todo('GET /api/quizzes/:id sans session est refusé (401)');

// ── Jalon 2 : son questionnaire, pas celui des autres ─────────────────────

test.todo('Bob ne voit pas le questionnaire d’Alice (403)');
test.todo('Bob ne peut pas ajouter de question au questionnaire d’Alice (403)');
test.todo('Alice voit son questionnaire (200)');

// ── Jalon 3 : la partie et son animateur ──────────────────────────────────

test.todo('créer une partie sans session est refusé (401)');
test.todo('Bob ne peut pas faire avancer la partie d’Alice (403)');

// ── Jalon 4 : l'administrateur ────────────────────────────────────────────

test.todo('un administrateur voit le questionnaire d’Alice (200)');
