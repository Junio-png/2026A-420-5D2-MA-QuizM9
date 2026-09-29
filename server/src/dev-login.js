/**
 * ATELIER SEULEMENT. Une porte pour changer d'identité sans mot de passe,
 * afin de jouer tour à tour l'attaquant et la victime dans la démo du XSS
 * (exercice 13). Elle n'existe QUE si DEV_LOGIN=1 dans server/.env.
 *
 * C'est volontairement une faille béante : n'importe qui devient n'importe
 * qui. En production, ce fichier n'est jamais monté (voir app.js) ; c'est
 * pour ça que le drapeau est éteint par défaut. Ne copiez rien de ceci dans
 * un vrai projet.
 */
import { Router } from 'express';
import * as repository from './repository/index.js';
import { writeSession } from './session.js';

// Le routeur n'est monté que si ce drapeau est vrai (app.js).
export const devLoginEnabled = process.env.DEV_LOGIN === '1';

export const devLogin = Router();

// La liste des comptes qu'on peut endosser : de quoi peupler le sélecteur.
devLogin.get('/api/dev/accounts', async (req, res) => {
  res.status(200).json(await repository.listAccounts());
});

// Devenir ce compte : on pose sa session, sans vérifier ni mot de passe ni
// quoi que ce soit. Tout l'intérêt, et tout le danger.
devLogin.post('/api/dev/login-as', async (req, res) => {
  const account = await repository.findAccount(Number(req.body?.accountId));
  if (!account) {
    return res.status(404).json({ error: 'Compte inconnu.' });
  }
  writeSession(res, { accountId: account.id });
  res.status(204).end();
});
