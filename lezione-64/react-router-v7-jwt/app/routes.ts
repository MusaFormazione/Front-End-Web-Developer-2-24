import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("signup", "routes/signup.tsx"),
    route("logout", "routes/logout.tsx"),
    ...prefix("tasks", [
      index("routes/tasks.tsx"),
      route("add", "routes/addTask.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
