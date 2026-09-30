/**
 * La connexion par mot de passe : le compte de démonstration alice / alice
 * (seed.sql).
 */
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers.js';

let api;
before(async () => {
  api = await startServer();
});
after(() => api.close());

/** POST /api/auth/login ; retourne le statut et le cookie de session posé. */
async function passwordLogin(login, password) {
  const response = await fetch(`${api.base}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });
  const cookie = response.headers.get('set-cookie')?.split(';')[0];
  const body = response.status === 204 ? null : await response.json();
  return { status: response.status, cookie, body };
}

test('alice / alice ouvre une session (204)', async () => {
  const { status, cookie } = await passwordLogin('alice', 'alice');
  assert.equal(status, 204);
  const { status: meStatus, data } = await api.request('GET', '/api/me', null, cookie);
  assert.equal(meStatus, 200);
  assert.equal(data.login, 'alice');
  assert.equal(data.password_hash, undefined);
});

test('un mauvais mot de passe est refusé (401), sans cookie', async () => {
  const { status, cookie } = await passwordLogin('alice', 'bob');
  assert.equal(status, 401);
  assert.equal(cookie, undefined);
});

test('un login inconnu donne le même message qu’un mauvais mot de passe', async () => {
  const unknown = await passwordLogin('mallory', 'alice');
  const wrong = await passwordLogin('alice', 'bob');
  assert.equal(unknown.status, 401);
  assert.equal(unknown.body.error, wrong.body.error);
});

test('un compte GitHub ne se connecte pas par mot de passe', async () => {
  await api.login('octocat'); // un compte GitHub, sans mot de passe
  const { status } = await passwordLogin('octocat', '');
  assert.equal(status, 401);
});

test('sans identifiant ni mot de passe : 400', async () => {
  const { status } = await passwordLogin(undefined, undefined);
  assert.equal(status, 400);
});
