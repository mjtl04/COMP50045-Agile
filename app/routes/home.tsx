import type { Route } from "./+types/home";
import { getUserFromRequest, requireAuthMiddleware } from "~/utilities/auth";
import { useLoaderData, Link, type LoaderFunctionArgs } from "react-router";
import { Header } from "~/components/header";
import type { User } from "~/utilities/interfaces/user";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const middleware: Route.MiddlewareFunction[] = [requireAuthMiddleware];

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, cookieHeader } = await getUserFromRequest(request);

  return Response.json({ user }, cookieHeader ? { headers: { "Set-Cookie": cookieHeader } } : undefined);
}

export default function Home() {
  const { user } = useLoaderData<{ user: User }>();

  return < >
    <Header user={user}></Header>
    <h1>home component</h1>
  </>;
}
