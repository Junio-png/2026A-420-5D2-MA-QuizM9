import { useState } from 'react';

/** Affiche le chat de la partie. Un joueur lit et écrit ; l'animateur lit seulement. */
export default function Chat({ chat, sendMessage, nickname }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  async function send(event) {
    event.preventDefault();
    const reply = await sendMessage(nickname, text);

    if (reply.error) {
      setError(reply.error);
      return;
    }

    setText('');
    setError(null);
  }

  return (
    <section className="card chat">
      <h2>Chat</h2>
      <ul className="chat-messages">
        {chat.messages.map((m) => (
          <li key={m.id}>
            <strong>{m.nickname}</strong> : {m.text} 
          </li>
        ))}
      </ul>

      {nickname && (
        <form className="chat-form" onSubmit={send}>
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <button>Envoyer</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </section>
  );
}