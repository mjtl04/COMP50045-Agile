import { authContext, getUserFromRequest, requireAuthMiddleware } from "~/utilities/auth";
import type { Route } from "../+types/root";
import { Header } from "~/components/header";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { User } from "~/utilities/interfaces/user";

export const middleware: Route.MiddlewareFunction[] = [requireAuthMiddleware];

export async function loader({ context }: LoaderFunctionArgs) {
  const user = context.get(authContext);
  return Response.json({ user });
}

export default function Index() {
  const { user } = useLoaderData<{ user: User | null }>();

  return <>
    <Header user={user}></Header>
    <section>
      <h1>index admin page</h1>
    </section>
  </>;
}
