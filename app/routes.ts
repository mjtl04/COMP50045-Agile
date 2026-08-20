import {
  type RouteConfig,
  route,
  index,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/logout", "routes/logout.tsx"),
  route("/holiday", "routes/holiday.tsx"),
  route("/requests", "routes/requests.tsx"),
  route("/admin", "routes/admin.tsx"),
  route("*", "components/notfound.tsx"),
] satisfies RouteConfig;