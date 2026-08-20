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

// export async function loader(): Promise<LeaveRequest[]> {

// }

// export async function action() { }

// export default function Index() {
//   const leaveRequests = useLoaderData<typeof loader>();

//   return (
//     <section>
//       <NavBar></NavBar>
//       <h1>index holiday page</h1>

//       <NavLink to="/holiday/create">create</NavLink>

//       <p>Holiday Requests: </p>
//       <ul>
//         {leaveRequests.map((leave) => (
//           <li key={leave.id}>
//             {leave.start_date} to {leave.end_date} — {leave.status}
//             {leave.comment && ` (${leave.comment})`}
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }