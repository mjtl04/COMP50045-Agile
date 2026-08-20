import { getUserFromRequest, requireAuthMiddleware } from "~/utilities/auth";
import type { Route } from "../+types/root";
import { Header } from "~/components/header";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import type { User } from "~/utilities/interfaces/user";

export const middleware: Route.MiddlewareFunction[] = [requireAuthMiddleware];

export async function loader({ request }: LoaderFunctionArgs) {
    const { user, cookieHeader } = await getUserFromRequest(request);
    return Response.json({ user }, cookieHeader ? { headers: { "Set-Cookie": cookieHeader } } : undefined);
}

export default function Index() {
    const { user } = useLoaderData<{ user: User | null }>();

    return <>
        <Header user={user}></Header>
        <section>
            <h1>index requests page</h1>
        </section>
    </>;
}