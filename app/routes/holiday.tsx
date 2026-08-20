import { NavLink, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Route } from "../+types/root";
import { getUserFromRequest, requireAuthMiddleware, } from "~/utilities/auth";
import { Header } from "~/components/header";
import { getUserHolidayAPI } from "~/utilities/api";
import type { LeaveRequest } from "~/utilities/interfaces/leaveRequest";
import type { User } from "~/utilities/interfaces/user";

export const middleware: Route.MiddlewareFunction[] = [requireAuthMiddleware];

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, cookieHeader } = await getUserFromRequest(request);
  return Response.json({ user }, cookieHeader ? { headers: { "Set-Cookie": cookieHeader } } : undefined);
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