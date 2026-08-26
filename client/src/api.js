/**
 * Les appels à l'API du serveur. Chaque fonction renvoie le JSON de la
 * réponse, ou lève une Error portant le message d'erreur du serveur.
 */
async function request(method, path, body) {
  const response = await fetch(path, {
    method,
    headers: body ? { 'content-type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error ?? `Erreur ${response.status}`);
  }
  return data;
}

export function createGame() {
  return request('POST', '/api/games');
}

export function joinGame(code, nickname) {
  return request('POST', `/api/games/${code}/players`, { nickname });
}

export function fetchGame(code) {
  return request('GET', `/api/games/${code}`);
}

export function nextQuestion(code) {
  return request('POST', `/api/games/${code}/next`);
}

export function sendAnswer(code, nickname, choiceId) {
  return request('POST', `/api/games/${code}/answers`, { nickname, choiceId });
}
