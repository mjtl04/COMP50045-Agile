import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

//   layout("./auth/layout.tsx", [
//     route("login", "./auth/login.tsx"),
//     route("register", "./auth/register.tsx"),
//   ]),

  ...prefix("holiday", [
    // index("routes/holiday/index.tsx"),
    route("/:id", "routes/holiday/show.tsx"),
  ]),
] satisfies RouteConfig;
