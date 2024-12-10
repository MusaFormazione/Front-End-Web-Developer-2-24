import { useEffect, type ReactNode } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useFetcher,
  useNavigation,
  useSubmit,
} from "react-router";
import { getUserToken, getUserTokenValidity } from "~/utilities/authorization";
import type { Route } from "../+types/root";

// con il loader possiamo ottenere i dati necessari per renderizzare il componente
export async function clientLoader() {
  // otteniamo il token dell'utente
  let token = getUserToken();
  return token;
}

// questo è il componente che viene renderizzato in tutte le pagine
export default function Layout({
  children,
  loaderData,
}: {
  children: ReactNode;
  loaderData: Route.ComponentProps;
}) {
  const fetcher = useFetcher();
  const navigation = useNavigation();
  // isNavigating è true se c'è una richiesta in corso, cioè se l'utente sta navigando da una pagina all'altra
  const isNavigating = Boolean(navigation.location);
  const token: any = loaderData;

  // Uso un effect per controllare il token
  useEffect(() => {
    // Se non esiste il token, non faccio nulla.
    if (!token) {
      return;
    }

    // Se il token è scaduto, effettuo un logout.
    if (token === "tokenExpired") {
      // fetcher.submit consente di inviare un form: qui non abbiamo un form vero e proprio, quindi passiamo null come primo parametro.
      // Utilizziamo il secondo parametro per effettuare una chiamata POST a logout
      fetcher.submit(null, { action: "/logout", method: "post" });
    }

    // Se abbiamo un token valido, facciamo partire un timeout impostato sulla sua durata.
    // Quando il timeout si esaurisce, effettuo un logout.
    // Ottima UX: l'utente non deve fare nulla, il logout avviene automaticamente quando il token scade!
    // In uno scenario reale, il token dovrebbe essere rinnovato automaticamente prima della scadenza effettuando una richiesta al server.
    const userTokenDuration = getUserTokenValidity();
    setTimeout(() => {
      fetcher.submit(null, { action: "/logout", method: "post" });
    }, userTokenDuration);
  }, [token, fetcher.submit]);

  return (
    <div>
      <header className="bg-slate-300">
        <nav className="max-w-screen-xl mx-auto">
          <ul className="flex gap-8 py-4">
            <li>
              <NavLink
                to="/"
                // isActive è true se la pagina corrente è la home
                // isPending è true se c'è una richiesta in corso
                // https://reactrouter.com/start/framework/pending-ui
                className={({ isActive, isPending, isTransitioning }) =>
                  [
                    // se la pagina è in caricamento, mostriamo un colore diverso
                    isPending ? "bg-blue-800" : "",
                    // se la pagina è attiva, mostriamo un colore diverso
                    isActive ? "bg-blue-300" : "",
                    // se la pagina sta facendo una transizione, mostriamo un colore diverso
                    isTransitioning ? "bg-red-800" : "",
                  ].join(" ")
                }
              >
                Home
              </NavLink>
            </li>
            {token ? (
              <>
                <li>
                  {/* Form e fetcher.Form sono due componenti che ci permettono di inviare una richiesta al server. */}
                  <fetcher.Form method="post" action="/logout">
                    <button type="submit">Logout</button>
                  </fetcher.Form>
                </li>
                <li>
                  <NavLink
                    to="/tasks/add"
                    className={({ isActive, isPending, isTransitioning }) =>
                      [
                        isPending ? "bg-blue-800" : "",
                        isActive ? "bg-blue-300" : "",
                        isTransitioning ? "bg-red-800" : "",
                      ].join(" ")
                    }
                  >
                    Add Task
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive, isPending, isTransitioning }) =>
                      [
                        isPending ? "bg-blue-800" : "",
                        isActive ? "bg-blue-300" : "",
                        isTransitioning ? "bg-red-800" : "",
                      ].join(" ")
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/signup"
                    className={({ isActive, isPending, isTransitioning }) =>
                      [
                        isPending ? "bg-blue-800" : "",
                        isActive ? "bg-blue-300" : "",
                        isTransitioning ? "bg-red-800" : "",
                      ].join(" ")
                    }
                  >
                    Signup
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <NavLink
                to="/tasks"
                end
                className={({ isActive, isPending, isTransitioning }) =>
                  [
                    isPending ? "bg-blue-800" : "",
                    isActive ? "bg-blue-300" : "",
                    isTransitioning ? "bg-red-800" : "",
                  ].join(" ")
                }
              >
                Tasks
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>
      <main>{isNavigating ? <div>Loading...</div> : <Outlet />}</main>
    </div>
  );
}
