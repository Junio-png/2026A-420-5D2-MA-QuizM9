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

    let unmounted = false;

    async function poll() {
      try {
        const nextGame = await fetchGame(code);
        if (!unmounted) setGame(nextGame);
      } catch {
        // Le serveur redémarre ou la partie a disparu : on réessaiera
        // à la prochaine seconde.
      }
    }

    poll();
    const timer = setInterval(poll, 1000);

    return () => {
      unmounted = true;
      clearInterval(timer);
    };
  }, [code]);

  return game;
}
