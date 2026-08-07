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
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbXBsb3llZV9pZCI6MSwiZmlyc3RfbmFtZSI6IkFkbWluIiwibGFzdF9uYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluLmFkbWluQGVtYWlsLmNvbSIsInJvbGUiOnsiaWQiOjJ9LCJpYXQiOjE3ODYxMDA2MzUsImV4cCI6MTc4NjExMTQzNX0.9MkabVewHhsimX2fDkxpl2yLhE2kaQBlSyUQ4CasC4E';
  const userId = 2;

  const response = await fetch(`http://localhost:8900/api/leave-requests/user/${userId}`, {
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
      <NavLink to="/holiday/create">create</NavLink>
      <p>index holiday page</p>

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