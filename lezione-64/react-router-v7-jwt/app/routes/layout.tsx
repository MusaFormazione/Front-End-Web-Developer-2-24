// create a layout component with a header showing login, logout, tasks, and signup links
// and a main section with the children components

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

export async function clientLoader() {
  let token = getUserToken();
  return token;
}

// the layout component will be used by the router
export default function Layout({
  children,
  loaderData,
}: {
  children: ReactNode;
  loaderData: Route.ComponentProps;
}) {
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  const token: any = loaderData;

  // Uso un effect per controllare il token
  useEffect(() => {
    // Se non esiste il token, non faccio nulla.
    if (!token) {
      return;
    }

    if (token === "tokenExpired") {
      // fetcher.submit consente di inviare un form:
      // qui non abbiamo un form vero e proprio, quindi passiamo null
      // Utilizziamo il secondo parametro per effettuare una chiamata a logout
      fetcher.submit(null, { action: "/logout", method: "post" });
    }

    // Se abbiamo un token valido, facciamo partire un timeout impostato sulla sua durata.
    // Quando il timeout si esaurisce, effettuo un logout.
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
                className={({ isActive, isPending, isTransitioning }) =>
                  [
                    isPending ? "bg-blue-800" : "",
                    isActive ? "bg-blue-300" : "",
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
