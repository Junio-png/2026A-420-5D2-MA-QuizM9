/**
 * La mise en forme des descriptions : **gras** et *italique*, comme sur
 * GitHub. Retourne du HTML.
 *
 * Le texte est échappé AVANT d'ajouter nos balises : un < tapé par l'auteur
 * s'affiche, il ne devient jamais une balise.
 */
export function formatDescription(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

/** Les cinq caractères qui ont un sens en HTML, remplacés par leur entité. */
function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
