/**
 * Le crochet qui tient l'état de la partie à jour dans le navigateur.
 *
 * LA DETTE DE LA SEMAINE 1 : on interroge le serveur toutes les secondes en
 * HTTP, même quand il ne se passe rien. À régler la semaine 7.
 */
import { useEffect, useState } from 'react';
import { fetchGame } from './api.js';

export function useGame(code) {
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (!code) return;

    // TODO : interroger le serveur toutes les secondes.
    //
    // - écrire une fonction async interne qui appelle fetchGame(code)
    //   puis setGame(...) avec le résultat (dans un try/catch : si le
    //   serveur ne répond pas, on réessaiera à la prochaine seconde) ;
    // - l'appeler une première fois tout de suite ;
    // - puis la répéter avec setInterval(..., 1000) ;
    // - IMPORTANT : renvoyer une fonction de nettoyage qui fait
    //   clearInterval, sinon les minuteries s'empilent à chaque
    //   changement d'écran.
  }, [code]);

  return game;
}
