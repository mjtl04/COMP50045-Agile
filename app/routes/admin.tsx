import { requireAuthMiddleware } from "~/utilities/auth";
import type { Route } from "../+types/root";

export const middleware: Route.MiddlewareFunction[] = [requireAuthMiddleware];

export default function Index() {
    return <>
        <section>
            <h1>index admin page</h1>
        </section>
    </>;
}