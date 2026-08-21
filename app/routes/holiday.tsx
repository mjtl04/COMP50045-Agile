import { NavLink, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import type { Route } from "../+types/root";
import { authContext, getUserFromRequest, requireAuthMiddleware, tokenContext, } from "~/utilities/auth";
import { Header } from "~/components/header";
import type { User } from "~/utilities/interfaces/user";
import { getUserHolidayAPI } from "~/utilities/api";
import type { LeaveRequest } from "~/utilities/interfaces/leaveRequest";

export const middleware: Route.MiddlewareFunction[] = [requireAuthMiddleware];

export async function loader({ request, context }: LoaderFunctionArgs) {

  const { user, token } = await getUserFromRequest(request);

  if (!user || !token) {
    throw redirect("/login")
  }

  const data = await getUserHolidayAPI(user.id, token);
  return Response.json({ user, data });

}


export default function Index() {
  const { user, data } = useLoaderData<{ user: User; data: LeaveRequest[] }>();

  return (
    <section>
      <Header user={user}></Header>
      <h1>index holiday page</h1>

      <NavLink to="/holiday/create">create</NavLink>

      <p>Holiday Requests: </p>
      {<ul>
        {data.map((leave) => (
          <li key={leave.id}>
            {leave.start_date} to {leave.end_date} — {leave.status}
            {leave.comment && ` (${leave.comment})`}
          </li>
        ))}
      </ul>}
    </section>
  );
}
