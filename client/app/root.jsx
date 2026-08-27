import { Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration } from 'react-router';
import './styles.css';

/**
 * L'enveloppe de toutes les pages : le document HTML et la barre de
 * navigation. <Outlet /> est remplacé par la page de la route courante.
 */
export function Layout({ children }) {
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
          <NavLink to="/quizzes">Mes questionnaires</NavLink>
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
  return (
    <main className="screen">
      <h1>Oups.</h1>
      <p className="error">{error?.statusText ?? error?.message ?? 'Erreur inconnue.'}</p>
    </main>
  );
}
