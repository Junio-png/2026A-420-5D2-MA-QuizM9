/**
 * Le harnais de vérification de la semaine 1.
 *
 * Il joue une partie complète contre votre serveur et vérifie le contrat de
 * l'API ainsi que la fonction de pointage. Lancez-le depuis la racine, avec
 * le serveur démarré dans un autre terminal :
 *
 *     npm run dev        (terminal 1)
 *     npm run verifier   (terminal 2)
 *
 * Chaque ligne est une vérification : ✔ elle passe, ✘ elle échoue. Ce n'est
 * pas une note — c'est la boucle « écrire, lancer, regarder ». On l'ouvrira
 * ensemble la semaine 4 pour écrire les nôtres.
 */
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { calculateScore } from '../src/scoring.js';

const BASE = `http://localhost:${process.env.PORT ?? 3000}`;
const results = [];

function check(name, condition, detail = '') {
  results.push({ name, ok: Boolean(condition), detail });
}

async function request(method, path, body) {
  const response = await fetch(BASE + path, {
    method,
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await response.json();
  } catch {
    // pas de corps JSON : data reste null
  }
  return { status: response.status, data };
}

// ── 1. La fonction de pointage, testée directement (sans serveur) ─────────

check(
  'pointage : bonne réponse instantanée = 8 (5 + bonus rapidité 3)',
  calculateScore({ isCorrect: true, responseTimeMs: 0, questionDurationMs: 20000, isFirstCorrectAnswer: false }) === 8,
);
check(
  'pointage : première bonne réponse instantanée = 10 (maximum)',
  calculateScore({ isCorrect: true, responseTimeMs: 0, questionDurationMs: 20000, isFirstCorrectAnswer: true }) === 10,
);
check(
  'pointage : bonne réponse à mi-parcours = 6 (5 + bonus rapidité 1)',
  calculateScore({ isCorrect: true, responseTimeMs: 10000, questionDurationMs: 20000, isFirstCorrectAnswer: false }) === 6,
);
check(
  'pointage : mauvaise réponse = 0',
  calculateScore({ isCorrect: false, responseTimeMs: 0, questionDurationMs: 20000, isFirstCorrectAnswer: false }) === 0,
);
check(
  'pointage : bonne réponse après l’échéance = 0',
  calculateScore({ isCorrect: true, responseTimeMs: 25000, questionDurationMs: 20000, isFirstCorrectAnswer: false }) === 0,
);

// ── 2. Le serveur est-il là ? ─────────────────────────────────────────────

try {
  await fetch(BASE + '/api/games/000000');
} catch {
  console.log(render());
  console.log(`\n✘ Serveur injoignable sur ${BASE}.`);
  console.log('  Démarrez-le d’abord dans un autre terminal : npm run dev');
  process.exit(1);
}

// ── 3. Une partie complète, jouée contre l'API ────────────────────────────

// La bonne réponse de chaque question, lue directement dans quiz.db.
const db = new DatabaseSync(
  fileURLToPath(new URL('../data/quiz.db', import.meta.url)),
  { readOnly: true },
);
const correctChoices = db
  .prepare('SELECT question_id, id FROM choice WHERE is_correct = 1')
  .all();
db.close();
const correctChoiceByQuestion = new Map(correctChoices.map((c) => [c.question_id, c.id]));

let r = await request('POST', '/api/games');
check('POST /api/games → 201 et un code', r.status === 201 && typeof r.data?.code === 'string');
const code = r.data?.code;

r = await request('GET', '/api/games/000000');
check('GET sur une partie inconnue → 404 { error }', r.status === 404 && r.data?.error);

r = await request('GET', `/api/games/${code}`);
check(
  'GET état initial → 200, lobby, aucun joueur',
  r.status === 200 && r.data?.state === 'lobby' && r.data?.players?.length === 0,
);

r = await request('POST', `/api/games/${code}/players`, { nickname: 'Alice' });
check('Alice rejoint → 201', r.status === 201);
await request('POST', `/api/games/${code}/players`, { nickname: 'Bob' });

r = await request('POST', `/api/games/${code}/players`, { nickname: 'Alice' });
check('pseudonyme déjà pris → 400 { error }', r.status === 400 && r.data?.error);

r = await request('POST', `/api/games/${code}/players`, {});
check('pseudonyme manquant → 400 { error }', r.status === 400 && r.data?.error);

r = await request('GET', `/api/games/${code}`);
check('GET état → les deux joueurs sont là', r.data?.players?.length === 2);

r = await request('POST', `/api/games/${code}/answers`, { nickname: 'Alice', choiceId: 1 });
check('répondre avant la première question → 400', r.status === 400);

r = await request('POST', `/api/games/${code}/next`);
check(
  'next → question 1 ouverte, avec texte, échéance et choix',
  r.status === 200 &&
    r.data?.state === 'question' &&
    r.data?.questionIndex === 0 &&
    r.data?.question?.text &&
    r.data?.question?.deadline > 0 &&
    r.data?.question?.choices?.length === 4,
);
check(
  'les choix envoyés au client ne disent PAS où est la bonne réponse',
  r.data?.question?.choices?.every((c) => !('isCorrect' in c) && !('is_correct' in c)),
);

const choicesQ1 = r.data?.question?.choices ?? [];
const correctQ1 = choicesQ1.find((c) => correctChoiceByQuestion.get(1) === c.id)?.id;
const wrongQ1 = choicesQ1.find((c) => c.id !== correctQ1)?.id;

r = await request('POST', `/api/games/${code}/answers`, { nickname: 'Alice', choiceId: correctQ1 });
check('Alice répond (bonne réponse) → 201', r.status === 201);

r = await request('POST', `/api/games/${code}/answers`, { nickname: 'Alice', choiceId: correctQ1 });
check('Alice répond une deuxième fois → 400', r.status === 400);

r = await request('POST', `/api/games/${code}/answers`, { nickname: 'Zoé', choiceId: correctQ1 });
check('un joueur inconnu répond → 400', r.status === 400);

await request('POST', `/api/games/${code}/answers`, { nickname: 'Bob', choiceId: wrongQ1 });

r = await request('GET', `/api/games/${code}`);
check('l’état annonce 2 réponses reçues', r.data?.answerCount === 2);

r = await request('POST', `/api/games/${code}/next`);
check('next pendant une question → la question est close (résultats)', r.data?.state === 'results');

const alice = r.data?.players?.find((p) => p.nickname === 'Alice');
const bob = r.data?.players?.find((p) => p.nickname === 'Bob');
check(
  'Alice (bonne réponse rapide, première) a entre 7 et 10 points',
  alice && alice.score >= 7 && alice.score <= 10,
  alice ? `Alice a ${alice.score}` : 'Alice absente du classement',
);
check('Bob (mauvaise réponse) a 0 point', bob?.score === 0);
check(
  'le classement est trié : Alice devant Bob',
  r.data?.players?.[0]?.nickname === 'Alice',
);

// On épuise les questions restantes (deux « next » par question) pour finir la partie.
for (let i = 0; i < 12; i += 1) {
  r = await request('POST', `/api/games/${code}/next`);
  if (r.data?.state === 'finished') break;
}
check('après la dernière question, la partie est terminée', r.data?.state === 'finished');

// ── Bilan ─────────────────────────────────────────────────────────────────

function render() {
  return results
    .map((x) => `${x.ok ? '✔' : '✘'} ${x.name}${!x.ok && x.detail ? `\n    ↳ ${x.detail}` : ''}`)
    .join('\n');
}

console.log(render());
const passed = results.filter((x) => x.ok).length;
console.log(`\n${passed}/${results.length} vérifications passent.`);
process.exit(passed === results.length ? 0 : 1);
