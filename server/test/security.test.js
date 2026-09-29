/**
 * Exercice 13 : les attaques de la semaine 6, rejouées ici pour qu'elles ne
 * reviennent pas. Écrivez chaque test AVANT la correction : il doit
 * d'abord échouer.
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers.js';

let api;
let alice;
before(async () => {
  api = await startServer();
  alice = await api.login('alice');
});
after(() => api.close());

// ── Jalon 1 : l'injection SQL ─────────────────────────────────────────────

/** La recherche du catalogue, avec ce texte dans ?q=. */
function search(text) {
  return api.request('GET', `/api/quizzes?q=${encodeURIComponent(text)}`);
}

test('une apostrophe dans la recherche ne fait pas planter l’API (200)', async () => {
  const { status, data } = await search("l'histoire");
  assert.equal(status, 200);
  assert.deepEqual(data, []);
});
test('une recherche piégée ne sort pas les comptes', async () => {
  const { status, data } = await search("' UNION SELECT id, login, login, 0 FROM account --");
  assert.equal(status, 200);
  assert.ok(data.every((quiz) => quiz.title !== 'alice'));
});

// ── Jalon 3 : le CSRF ─────────────────────────────────────────────────────

test('un GET sur /api/quizzes/:id/delete ne supprime rien', async () => {
  const { data } = await api.request('POST', '/api/quizzes', { title: 'À garder' }, alice);
  await api.request('GET', `/api/quizzes/${data.id}/delete`, undefined, alice);

  const mine = await api.request('GET', '/api/me/quizzes', undefined, alice);
  assert.ok(mine.data.some((quiz) => quiz.id === data.id));
});
test('DELETE /api/quizzes/:id supprime le questionnaire de son auteur (200)', async () => {
  const { data } = await api.request('POST', '/api/quizzes', { title: 'À jeter' }, alice);
  const { status } = await api.request('DELETE', `/api/quizzes/${data.id}`, undefined, alice);
  assert.equal(status, 200);

  const mine = await api.request('GET', '/api/me/quizzes', undefined, alice);
  assert.ok(mine.data.every((quiz) => quiz.id !== data.id));
});
