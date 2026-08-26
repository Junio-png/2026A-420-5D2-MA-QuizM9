export default function Leaderboard({ players, currentNickname }) {
  if (players.length === 0) {
    return <p>Personne n'a encore rejoint.</p>;
  }
  return (
    <ol className="leaderboard">
      {players.map((p) => (
        <li key={p.nickname} className={p.nickname === currentNickname ? 'me' : ''}>
          <span>{p.nickname}</span>
          <span>{p.score} pts</span>
        </li>
      ))}
    </ol>
  );
}
