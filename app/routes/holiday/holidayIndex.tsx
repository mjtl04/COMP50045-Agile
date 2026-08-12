import { NavLink, redirect, useLoaderData } from "react-router";

interface LeaveRequest {
  id: number;
  employee_id: number;
  raised_date: string;
  start_date: string;
  end_date: string;
  status: string;
  comment: string | null;
}

export async function loader(): Promise<LeaveRequest[]> {
  if (typeof window === "undefined") {
    return [];
  }

  const employee_id = localStorage.getItem("employee_id");
  const token = localStorage.getItem("token");

  console.log(token)

  if (typeof token !== 'undefined' && token !== null) {
    throw redirect("/login");
  }

  const response = await fetch(`http://localhost:8900/api/leave-requests/user/${employee_id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error('Fetch failed:', response.status, response.statusText, body);
    throw new Error(`Failed to fetch holidays: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function action() { }

export default function Index() {
  const leaveRequests = useLoaderData<typeof loader>();

  return (
    <section>
      <h1>index holiday page</h1>

      <NavLink to="/holiday/create">create</NavLink>

      <p>Holiday Requests: </p>
      <ul>
        {leaveRequests.map((leave) => (
          <li key={leave.id}>
            {leave.start_date} to {leave.end_date} — {leave.status}
            {leave.comment && ` (${leave.comment})`}
          </li>
        ))}
      </ul>
    </section>
  );
}