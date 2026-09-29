/**
 * La mise en forme des descriptions : **gras** et *italique*, comme sur
 * GitHub. Retourne du HTML.
 */
export function formatDescription(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}
