-- Les questionnaires de démonstration. Chargé une seule fois, quand la table
-- quiz est vide (voir repository/db.js).

INSERT INTO quiz (id, title) VALUES
  (1, 'Révision express du développement web'),
  (2, 'SQL et SQLite'),
  (3, 'React en révision');

-- Quiz 1 — celui de la semaine 1.
INSERT INTO question (id, quiz_id, position, text, duration_seconds) VALUES
  (1, 1, 1, 'Quel code de statut HTTP signifie « Créé » ?', 20),
  (2, 1, 2, 'Dans Express, où se trouve la valeur de :id dans la route /api/films/:id ?', 20),
  (3, 1, 3, 'Quelle méthode HTTP sert à créer une ressource dans une API REST ?', 20),
  (4, 1, 4, 'Dans React, quel crochet exécute du code après le rendu du composant ?', 20),
  (5, 1, 5, 'Deux routes GET déclarées sur le même chemin : que fait Express ?', 20);

INSERT INTO choice (question_id, text, is_correct) VALUES
  (1, '200', 0), (1, '201', 1), (1, '404', 0), (1, '500', 0),
  (2, 'req.params', 1), (2, 'req.query', 0), (2, 'req.body', 0), (2, 'res.locals', 0),
  (3, 'GET', 0), (3, 'POST', 1), (3, 'PUT', 0), (3, 'DELETE', 0),
  (4, 'useState', 0), (4, 'useEffect', 1), (4, 'useMemo', 0), (4, 'useRef', 0),
  (5, 'Il refuse de démarrer', 0), (5, 'Il exécute les deux', 0),
  (5, 'Seule la première répond, la seconde est du code mort', 1),
  (5, 'Seule la dernière répond', 0);

-- Quiz 2 — la matière de la semaine.
INSERT INTO question (id, quiz_id, position, text, duration_seconds) VALUES
  (6, 2, 1, 'Que deviennent les données d''une base SQLite quand le serveur redémarre ?', 20),
  (7, 2, 2, 'Dans db.prepare(''… VALUES (?, ?)'').run(a, b), à quoi servent les « ? » ?', 20),
  (8, 2, 3, 'Quelle propriété du résultat de run() donne l''id attribué par un INSERT ?', 20),
  (9, 2, 4, 'Plusieurs écritures qui doivent réussir ensemble s''enveloppent dans…', 20);

INSERT INTO choice (question_id, text, is_correct) VALUES
  (6, 'Elles sont perdues', 0), (6, 'Elles sont toujours là : elles vivent dans un fichier', 1),
  (6, 'Elles sont rechargées depuis le client', 0), (6, 'Ça dépend du port', 0),
  (7, 'À décorer le SQL', 0), (7, 'À passer les valeurs à part, jamais collées dans la chaîne', 1),
  (7, 'À marquer les colonnes NULL', 0), (7, 'À accélérer la requête', 0),
  (8, 'lastInsertRowid', 1), (8, 'insertedId', 0), (8, 'rowCount', 0), (8, 'newId', 0),
  (9, 'un try/catch', 0), (9, 'une promesse', 0), (9, 'une transaction', 1), (9, 'un index', 0);

-- Quiz 3.
INSERT INTO question (id, quiz_id, position, text, duration_seconds) VALUES
  (10, 3, 1, 'Que provoque un appel à une fonction setState de useState ?', 20),
  (11, 3, 2, 'Quelle prop rend une liste d''éléments React stable d''un rendu à l''autre ?', 20),
  (12, 3, 3, 'Un composant React doit être…', 20);

INSERT INTO choice (question_id, text, is_correct) VALUES
  (10, 'Un nouveau rendu du composant', 1), (10, 'Un rechargement de la page', 0),
  (10, 'Une requête au serveur', 0), (10, 'Rien du tout', 0),
  (11, 'id', 0), (11, 'key', 1), (11, 'ref', 0), (11, 'name', 0),
  (12, 'une fonction qui retourne du JSX', 1), (12, 'une classe qui étend Element', 0),
  (12, 'un fichier HTML', 0), (12, 'une balise script', 0);
