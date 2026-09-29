/**
 * Les comptes : une ligne par identité GitHub. Tout le SQL sur account vit
 * ici, nulle part ailleurs.
 */
import { pool } from './db.js';

/** Le compte qui porte cet id, ou undefined. */
export async function findAccount(id) {
  const { rows } = await pool.query('SELECT * FROM account WHERE id = $1', [id]);
  return rows[0];
}

/**
 * Retrouve le compte de cet utilisateur GitHub, ou le crée à sa première
 * connexion. Le login, le nom et l'avatar sont rafraîchis à chaque fois :
 * GitHub est la source de vérité, pas nous.
 *
 * @param {{githubId: number, login: string, name: string | null, avatarUrl: string | null}} profile
 * @returns {Promise<{id: number, github_id: number, login: string, name: string | null, avatar_url: string | null}>}
 */
export async function findOrCreateAccount({ githubId, login, name, avatarUrl }) {
  const { rows } = await pool.query(
    `INSERT INTO account (github_id, login, name, avatar_url)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (github_id) DO UPDATE
       SET login = EXCLUDED.login, name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url
     RETURNING *`,
    [githubId, login, name, avatarUrl],
  );
  return rows[0];
}

/** Tous les comptes, du plus ancien au plus récent : sert au sélecteur d'atelier (DEV_LOGIN). */
export async function listAccounts() {
  const { rows } = await pool.query(
    'SELECT id, login, name, is_admin AS "isAdmin" FROM account ORDER BY id',
  );
  return rows;
}

/** Accorde ou retire le rôle d'administrateur. En classe : un UPDATE dans psql. */
export async function setAdmin(accountId, isAdmin) {
  await pool.query('UPDATE account SET is_admin = $1 WHERE id = $2', [isAdmin, accountId]);
}
