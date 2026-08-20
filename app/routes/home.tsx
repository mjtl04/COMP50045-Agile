import type { Route } from "./+types/home";
import { getUserFromRequest, type User } from "~/utilities/auth";
import { useLoaderData, Link, type LoaderFunctionArgs } from "react-router";
import { Header } from "~/components/header";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, setCookieHeader } = await getUserFromRequest(request);

  return Response.json({ user }, setCookieHeader ? { headers: { "Set-Cookie": setCookieHeader } } : undefined);
}

export default function Home() {
  const { user } = useLoaderData<{ user: User | null }>();

  return < >
    <Header user={user}></Header>
    <h1>home component</h1>
  </>;
}
