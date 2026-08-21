import { Form, redirect, useActionData, type ActionFunctionArgs } from "react-router";
import { loginAPI } from "~/utilities/api";
import { parseJwt, sessionStorage } from "~/utilities/auth";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const redirectTo = formData.get("redirectTo")?.toString() || "/";

  if (!email || !password) {
    return { error: "Email and Password are required" };
  }

  try {

    const authResponse = await loginAPI(email, password);

    const claims = parseJwt(authResponse.access_token);

    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    session.set("access_token", authResponse.access_token);
    session.set("refresh_token", authResponse.refresh_token);
    session.set("user_id", claims?.employee_id);
    session.set("email", claims?.email);

    return redirect(redirectTo.startsWith("/") ? redirectTo : "/", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  }
  catch {
    return { error: "Invalid email or password" };
  }

}

export default function Login() {
  const actionData = useActionData() as { error?: string } | undefined;

  return <div>
    <p>Login</p>
    {actionData?.error && (
      <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
        <p className="text-sm text-red-700">{actionData.error}</p>
      </div>
    )}

    <Form className="form" method="post" >

      <label htmlFor="email">email</label><br></br>

      <input
        type="text"
        name="email"
        id="email"
        required
      />

      <label htmlFor="password">password</label><br></br>
      <input type="password" id="password" name="password" required></input><br></br>
      <input type="submit"></input>
    </Form>
  </div>
}
