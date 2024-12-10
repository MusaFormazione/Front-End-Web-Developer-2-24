import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  // layout definisce il layout della pagina, cioè la struttura generale
  layout("routes/layout.tsx", [
    // index definisce la pagina principale
    index("routes/home.tsx"),
    // route definisce una pagina, i parametri sono il nome della pagina e il file che la contiene
    route("login", "routes/login.tsx"),
    route("signup", "routes/signup.tsx"),
    route("logout", "routes/logout.tsx"),
    // prefix definisce un prefisso per le pagine, cioè un percorso comune a tutte le pagine che lo seguono
    ...prefix("tasks", [
      // queste sono le pagine relative a /tasks
      // index è la pagina principale (/tasks)
      index("routes/tasks.tsx"),
      // questa è la pagina per aggiungere un task (/tasks/add)
      route("add", "routes/addTask.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
