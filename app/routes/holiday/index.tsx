import { redirect } from "react-router";

export async function loader() {
    // let user = await getUser(request);
    let user = null;

    if (!user) {
        return redirect("/login");
    }
    return { userName: user.name };
}

export async function action() { }

export default function Index() {
    return <>
        <section>
            <p>index holiday page</p>
        </section>
    </>;
}