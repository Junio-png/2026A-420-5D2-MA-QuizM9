-- Les questionnaires de démonstration. Chargé une seule fois, quand la table
-- quiz est vide (voir repository/db-postgres.js et db-sqlite.js). Les id sont
-- donnés à la main ; PostgreSQL avance ensuite ses compteurs (db-postgres.js).

-- Un compte de démonstration, administrateur. Sert entre autres à la note
-- sur l'injection SQL : c'est cette ligne qu'une requête piégée fait sortir.
-- Pas d'id explicite ici : on laisse la base l'attribuer (ce sera 1), pour
-- que le prochain compte, créé à la connexion GitHub, n'entre pas en collision.
INSERT INTO account (github_id, login, name, is_admin) VALUES
  (583231, 'prof-quizm9', 'Vincent A.', TRUE);

-- Un compte lambda, sans droits, pour la démo XSS (exercice 13). Alice écrit
-- la description piégée ; l'attaque frappe ensuite quiconque, connecté, ouvre
-- le catalogue. Pas de GitHub pour elle : identifiant alice, mot de passe
-- alice. La base n'en garde que l'empreinte, calculée une fois par :
--   node -e "import('./src/password.js').then((m) => console.log(m.hashPassword('alice')))"
INSERT INTO account (login, name, password_hash) VALUES
  ('alice', 'Alice', 'scrypt$789b96c75e0b4002f354db5721a34e69$415eadd58720a92ee0deb6ed26038831c012eee81116a1ae3c357bc765db9dbc4cdc69d2b9e4f562f36c43aa5dd2076e820b2f048943de7d5de57b113c98cd99');

INSERT INTO quiz (id, title, description) VALUES
  (1, 'Révision express du développement web', 'HTTP, Express et React : **cinq questions** pour se réchauffer.'),
  (2, 'SQL et PostgreSQL', 'La matière de la *semaine 5*.'),
  (3, 'React en révision', 'Trois questions sur les **composants**.');

-- Quiz 1 : celui de la semaine 1.
INSERT INTO question (id, quiz_id, position, text, duration_seconds) VALUES
  (1, 1, 1, 'Quel code de statut HTTP signifie « Créé » ?', 20),
  (2, 1, 2, 'Dans Express, où se trouve la valeur de :id dans la route /api/films/:id ?', 20),
  (3, 1, 3, 'Quelle méthode HTTP sert à créer une ressource dans une API REST ?', 20),
  (4, 1, 4, 'Dans React, quel crochet exécute du code après le rendu du composant ?', 20),
  (5, 1, 5, 'Deux routes GET déclarées sur le même chemin : que fait Express ?', 20);

INSERT INTO choice (question_id, text, is_correct) VALUES
  (1, '200', FALSE), (1, '201', TRUE), (1, '404', FALSE), (1, '500', FALSE),
  (2, 'req.params', TRUE), (2, 'req.query', FALSE), (2, 'req.body', FALSE), (2, 'res.locals', FALSE),
  (3, 'GET', FALSE), (3, 'POST', TRUE), (3, 'PUT', FALSE), (3, 'DELETE', FALSE),
  (4, 'useState', FALSE), (4, 'useEffect', TRUE), (4, 'useMemo', FALSE), (4, 'useRef', FALSE),
  (5, 'Il refuse de démarrer', FALSE), (5, 'Il exécute les deux', FALSE),
  (5, 'Seule la première répond, la seconde est du code mort', TRUE),
  (5, 'Seule la dernière répond', FALSE);

-- Quiz 2 : la matière de la semaine 5.
INSERT INTO question (id, quiz_id, position, text, duration_seconds) VALUES
  (6, 2, 1, 'Que deviennent les données d''une base PostgreSQL quand le serveur Node redémarre ?', 20),
  (7, 2, 2, 'Dans pool.query(''… VALUES ($1, $2)'', [a, b]), à quoi servent $1 et $2 ?', 20),
  (8, 2, 3, 'Comment obtenir l''id attribué par un INSERT dans PostgreSQL ?', 20),
  (9, 2, 4, 'Plusieurs écritures qui doivent réussir ensemble s''enveloppent dans…', 20);

INSERT INTO choice (question_id, text, is_correct) VALUES
  (6, 'Elles sont perdues', FALSE), (6, 'Elles sont toujours là : elles vivent dans un autre processus', TRUE),
  (6, 'Elles sont rechargées depuis le client', FALSE), (6, 'Ça dépend du port', FALSE),
  (7, 'À décorer le SQL', FALSE), (7, 'À passer les valeurs à part, jamais collées dans la chaîne', TRUE),
  (7, 'À marquer les colonnes NULL', FALSE), (7, 'À accélérer la requête', FALSE),
  (8, 'RETURNING id', TRUE), (8, 'lastInsertRowid', FALSE), (8, 'SELECT LAST_ID()', FALSE), (8, 'rows.length', FALSE),
  (9, 'un try/catch', FALSE), (9, 'une promesse', FALSE), (9, 'une transaction', TRUE), (9, 'un index', FALSE);

-- Quiz 3.
INSERT INTO question (id, quiz_id, position, text, duration_seconds) VALUES
  (10, 3, 1, 'Que provoque un appel à une fonction setState de useState ?', 20),
  (11, 3, 2, 'Quelle prop rend une liste d''éléments React stable d''un rendu à l''autre ?', 20),
  (12, 3, 3, 'Un composant React doit être…', 20);

INSERT INTO choice (question_id, text, is_correct) VALUES
  (10, 'Un nouveau rendu du composant', TRUE), (10, 'Un rechargement de la page', FALSE),
  (10, 'Une requête au serveur', FALSE), (10, 'Rien du tout', FALSE),
  (11, 'id', FALSE), (11, 'key', TRUE), (11, 'ref', FALSE), (11, 'name', FALSE),
  (12, 'une fonction qui retourne du JSX', TRUE), (12, 'une classe qui étend Element', FALSE),
  (12, 'un fichier HTML', FALSE), (12, 'une balise script', FALSE);
