/**
 * Exercice 13 : les attaques de la semaine 6, rejouées ici pour qu'elles ne
 * reviennent pas. Écrivez chaque test AVANT la correction : il doit
 * d'abord échouer.
 */
import { test, before, after } from 'node:test';
import { startServer } from './helpers.js';

let api;
let alice;
before(async () => {
  api = await startServer();
  alice = await api.login('alice');
});
after(() => api.close());

// ── Jalon 1 : l'injection SQL ─────────────────────────────────────────────

test.todo('une apostrophe dans la recherche ne fait pas planter l’API (200)');
test.todo('une recherche piégée ne sort pas les comptes');

// ── Jalon 3 : le CSRF ─────────────────────────────────────────────────────

test.todo('un GET sur /api/quizzes/:id/delete ne supprime rien');
test.todo('DELETE /api/quizzes/:id supprime le questionnaire de son auteur (200)');
