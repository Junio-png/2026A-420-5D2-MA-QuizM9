/**
 * Le temps restant, calculé à partir de l'échéance donnée par le serveur.
 *
 * Il ne se rafraîchit qu'au rythme du sondage : il SAUTE. C'est la dette de
 * la semaine 1, visible à l'œil nu.
 */
export default function Countdown({ deadline }) {
  const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
  return <p className="countdown">{remaining} s</p>;
}
