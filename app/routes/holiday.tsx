import { NavLink, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Route } from "../+types/root";
import { authContext, requireAuthMiddleware, tokenContext, } from "~/utilities/auth";
import { Header } from "~/components/header";
import type { User } from "~/utilities/interfaces/user";

export const middleware: Route.MiddlewareFunction[] = [requireAuthMiddleware];

export async function loader({ context }: LoaderFunctionArgs) {
  const user = context.get(authContext);
  const token = context.get(tokenContext);
  return Response.json({ user });
}

export default function Index() {
  const { user } = useLoaderData<{ user: User }>();

  return (
    <section>
      <Header user={user}></Header>
      <h1>index holiday page</h1>

      <NavLink to="/holiday/create">create</NavLink>

      <p>Holiday Requests: </p>
      {/* <ul>
        {holiday.map((leave) => (
          <li key={leave.id}>
            {leave.start_date} to {leave.end_date} — {leave.status}
            {leave.comment && ` (${leave.comment})`}
          </li>
        ))}
      </ul> */}
    </section>
  );
}
