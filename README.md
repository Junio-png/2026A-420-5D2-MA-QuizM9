# Quiz M9 — semaine 1 : le prototype jouable

Le fil rouge du cours 420-5D2. Un jeu-questionnaire en direct : un animateur
crée une partie et obtient un **code** ; les joueurs rejoignent avec ce code et
un pseudonyme, sans compte ; les questions défilent, le classement monte.

Cette semaine, la version **grossière** : l'état de la partie vit en mémoire,
le questionnaire est lu dans un fichier SQLite, et le client interroge le
serveur toutes les secondes en HTTP.

## Prérequis

- Node.js **LTS** (24 ou plus récent) — tout le cours se fait sur la LTS ;
- deux navigateurs, ou une fenêtre normale et une fenêtre privée, pour jouer
  à la fois animateur et joueur ;
- sous Windows : clonez **hors d'un dossier synchronisé OneDrive**
  (Documents, Bureau…) — la synchronisation interfère avec `node --watch`,
  Vite et SQLite.

## Démarrer

```bash
npm install     # installe server/ et client/ d'un coup
npm run dev     # démarre le serveur (port 3000) et le client (port 5173)
```

Ouvrez <http://localhost:5173>. Créez une partie dans une fenêtre, rejoignez-la
dans l'autre.

> **Au départ, ça ne marche pas — c'est normal.** Cliquer « Créer une partie »
> affiche l'erreur « À faire. » : les routes du serveur sont des trous à
> remplir (voir plus bas). Le scénario ci-dessus devient possible une fois
> votre travail de la semaine terminé.

## Votre travail

Quatre trous à remplir. Chacun est marqué `TODO` dans le code et décrit sur
place ce qu'il attend. Dans l'ordre suggéré, vous devez :

1. **Implémenter `calculateScore`** dans `server/src/scoring.js` — la fonction
   **pure** qui applique [les règles de pointage](#les-règles-de-pointage).
   Les cinq premières vérifications du harnais la testent directement, sans
   serveur : commencez ici.
2. **Implémenter `loadQuiz`** dans `server/src/quiz.js` — le `SELECT` qui
   charge le questionnaire depuis `data/quiz.db` au démarrage. Les requêtes
   SQL sont données en commentaire dans le fichier.
3. **Implémenter les cinq routes** dans `server/src/server.js` — créer,
   rejoindre, état, suivante, répondre, selon
   [le contrat de l'API](#le-contrat-de-lapi). La logique de partie
   (`game.js`) est fournie ; les routes l'assemblent.
4. **Implémenter le sondage** dans `client/src/useGame.js` — `fetch` de l'état
   toutes les secondes avec `setInterval`. Tout le reste du client est fourni.

Quand tout est en place : `npm run verifier` affiche 24 ✔ (voir
[Vérifier votre travail](#vérifier-votre-travail)) et vous pouvez jouer une
partie complète à deux navigateurs. On ne touche à rien d'autre : les
fichiers marqués « fournis » dans la
[structure du dépôt](#structure-du-dépôt) ne sont pas à modifier.

## Vérifier votre travail

Le serveur démarré dans un terminal, lancez dans un autre :

```bash
npm run verifier
```

Le harnais joue une partie complète contre votre serveur et affiche une liste
de ✔ et de ✘. **Au départ, presque tout est ✘ : c'est normal.** Votre travail
de la semaine consiste à faire monter les ✔. La règle de la session : on ne
pousse pas ce qu'on n'a pas lancé.

## Les règles de pointage

Fixées pour toute la session — une question vaut **10 points au maximum**.

- Bonne réponse : **5 points**.
- Bonus de rapidité : jusqu'à **3 points**, décroissant avec le temps de
  réponse, mesuré par **l'horloge du serveur**.
- Bonus de la première bonne réponse : **2 points**, une seule fois par
  question.
- Une réponse après l'échéance vaut **0**. Une mauvaise réponse vaut **0**.
- Un joueur ne répond qu'une fois par question.

## Le contrat de l'API

Toute réponse avec un corps est en JSON ; toute erreur a la forme
`{ "error": "un message" }`.

| Méthode | Chemin | Succès | Erreurs |
|---|---|---|---|
| `POST` | `/api/games` | `201` `{ code }` | — |
| `POST` | `/api/games/:code/players` | `201` `{ nickname }` | `404` partie inconnue ; `400` pseudonyme manquant, pris, ou partie commencée |
| `GET` | `/api/games/:code` | `200` état public | `404` |
| `POST` | `/api/games/:code/next` | `200` état public — clôt la question en cours, sinon avance | `404` |
| `POST` | `/api/games/:code/answers` | `201` `{}` | `404` ; `400` pas de question en cours, joueur inconnu, déjà répondu, choix inconnu |

L'état public renvoyé par `GET` :

```json
{
  "code": "483920",
  "state": "lobby | question | results | finished",
  "questionIndex": 0,
  "questionCount": 5,
  "title": "Révision express du développement web",
  "question": { "text": "…", "deadline": 1756180000000, "choices": [{ "id": 1, "text": "…" }] },
  "players": [{ "nickname": "Alice", "score": 8 }],
  "answerCount": 1
}
```

Les choix arrivent **sans** la bonne réponse : le serveur ne dit jamais au
navigateur où elle est.

## Structure du dépôt

```
server/
  src/server.js         les routes Express             ← trou 3
  src/game.js           la logique de partie           (fournie)
  src/scoring.js        les règles de pointage         ← trou 1
  src/quiz.js           la lecture de quiz.db          ← trou 2
  data/quiz.db          le questionnaire (SQLite)
  verifier/             le harnais npm run verifier
client/
  src/useGame.js        le sondage toutes les secondes ← trou 4
  src/…                 l'interface React              (fournie)
```
