import { useState } from 'react';
import Home from './components/Home.jsx';
import Host from './components/Host.jsx';
import Player from './components/Player.jsx';

/**
 * Trois écrans : l'accueil, la vue de l'animateur, la vue du joueur.
 * `session` retient qui on est : null tant qu'on n'a ni créé ni rejoint.
 */
export default function App() {
  const [session, setSession] = useState(null);

  if (!session) {
    return <Home onSession={setSession} />;
  }
  if (session.role === 'host') {
    return <Host code={session.code} />;
  }
  return <Player code={session.code} nickname={session.nickname} />;
}
