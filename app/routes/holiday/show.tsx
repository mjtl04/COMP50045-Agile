import { Link, useLoaderData } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
    const { id } = params;

    if (!id) {
        throw new Response("List ID is required", { status: 400 });
    }

    const token = ``

    const response = await fetch(`http://localhost:8900/api/leave-requests/user/balance/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Response(
            "Failed to fetch list",
            { status: response.status }
        );
    }

    const list = await response.json();
    return list;
}

export default function DisplayList() {
    const data = useLoaderData();

    return <>
        <section>
            <p>Available: {data.available_leave}</p>
            <p>Pending: {data.pending_leave}</p>
            <p>Used: {data.used_leave}</p>
        </section>
    </>;
}