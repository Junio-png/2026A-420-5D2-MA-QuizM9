/**
 * Les mots de passe : jamais stockés en clair, seulement leur empreinte.
 *
 * scrypt est une fonction de hachage volontairement LENTE : vérifier un mot
 * de passe prend quelques millisecondes, en essayer des milliards devient
 * hors de prix. Le sel, aléatoire et propre à chaque compte, empêche de
 * reconnaître deux mots de passe identiques ou de précalculer des tables.
 *
 * Forme stockée :  scrypt$<sel en hex>$<empreinte en hex>
 */
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

/** L'empreinte d'un mot de passe, à ranger dans account.password_hash. */
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `scrypt$${salt}$${hash}`;
}

/** Le mot de passe correspond-il à cette empreinte ? */
export function verifyPassword(password, stored) {
  const [algorithm, salt, hash] = (stored ?? '').split('$');
  if (algorithm !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, expected.length);
  // Comparaison à temps constant, comme pour la signature de la session.
  return timingSafeEqual(actual, expected);
}
