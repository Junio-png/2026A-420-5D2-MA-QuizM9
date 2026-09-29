import {
  Form,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteLoaderData,
} from 'react-router';
import { apiFetch } from '../app/api-url.js';
import './styles.css';

/**
 * Le loader de la racine tourne pour TOUTES les pages : qui est connecté ?
 * L'API répond 401 si personne ; la barre de navigation s'adapte.
 */
export async function loader({ request }) {
  // /api/dev/accounts n'existe qu'en atelier (DEV_LOGIN) : 404 sinon, et le
  // sélecteur ne s'affiche pas.
  const [me, dev] = await Promise.all([
    apiFetch(request, '/api/me'),
    apiFetch(request, '/api/dev/accounts'),
  ]);
  return {
    account: me.ok ? await me.json() : null,
    devAccounts: dev.ok ? await dev.json() : null,
  };
}

/**
 * L'enveloppe de toutes les pages : le document HTML et la barre de
 * navigation. <Outlet /> est remplacé par la page de la route courante.
 */
export function Layout({ children }) {
  // Les données du loader de la racine, lisibles depuis n'importe où.
  const data = useRouteLoaderData('root');
  const account = data?.account;
  const devAccounts = data?.devAccounts;

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Quiz M9</title>
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="topnav">
          <NavLink to="/" end>Accueil</NavLink>
          <NavLink to="/catalogue">Catalogue</NavLink>
          {account ? (
            <>
              <NavLink to="/quizzes">Mes questionnaires</NavLink>
              <span className="account">
                {account.avatarUrl && <img src={account.avatarUrl} alt="" />}
                {account.login}
              </span>
              <Form method="post" action="/logout">
                <button className="link">Se déconnecter</button>
              </Form>
            </>
          ) : (
            // Un lien ordinaire, pas un <Link> : on quitte l'application
            // pour aller chez GitHub, et on en reviendra par une redirection.
            <a href="/api/auth/github">Se connecter avec GitHub</a>
          )}
          {/* Atelier XSS (DEV_LOGIN) : devenir un compte de test en un clic. */}
          {devAccounts && (
            <span className="dev-switch" title="Atelier : changer d'identité sans mot de passe">
              Devenir :
              {devAccounts.map((a) => (
                <Form method="post" action="/login-as" key={a.id}>
                  <input type="hidden" name="accountId" value={a.id} />
                  <button className="link">{a.login}</button>
                </Form>
              ))}
            </span>
          )}
        </nav>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function ErrorBoundary({ error }) {
  // Une réponse lancée par un loader (throw data(...)) porte son message dans
  // error.data ; une exception ordinaire, dans error.message.
  const message = isRouteErrorResponse(error)
    ? error.data || error.statusText
    : error?.message;
  return (
    <main className="screen">
      <h1>Oups.</h1>
      <p className="error">{message || 'Erreur inconnue.'}</p>
    </main>
  );
}
