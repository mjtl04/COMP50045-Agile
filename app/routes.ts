import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/holiday", "routes/holiday/holidayIndex.tsx"),
  route("/requests", "routes/requests/requestsIndex.tsx"),
  route("/admin", "routes/admin/adminIndex.tsx"),
  route("*", "components/notfound.tsx"),
] satisfies RouteConfig;