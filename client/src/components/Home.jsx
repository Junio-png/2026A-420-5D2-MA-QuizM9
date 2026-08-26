import { useState } from 'react';
import { createGame, joinGame } from '../api.js';

export default function Home({ onSession }) {
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState(null);

  async function host() {
    try {
      const { code: newCode } = await createGame();
      onSession({ role: 'host', code: newCode });
    } catch (e) {
      setError(e.message);
    }
  }

  async function join(event) {
    event.preventDefault();
    try {
      await joinGame(code.trim(), nickname.trim());
      onSession({ role: 'player', code: code.trim(), nickname: nickname.trim() });
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="screen">
      <h1>Quiz M9</h1>

      <section className="card">
        <h2>Rejoindre une partie</h2>
        <form onSubmit={join}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Code de partie"
            inputMode="numeric"
          />
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Pseudonyme"
          />
          <button type="submit">Rejoindre</button>
        </form>
      </section>

      <section className="card">
        <h2>Animer</h2>
        <button onClick={host}>Créer une partie</button>
      </section>

      {error && <p className="error">{error}</p>}
    </main>
  );
}
