import { useState } from "react";
import { Navigate, useNavigate } from "react-router";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const API_URL = import.meta.env.VITE_API_URL

    const submit = async (e: any) => {

        e.preventDefault();

        const response = await fetch(`${API_URL}/api/login`, {
            method: `POST`,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {

        }

        const token = await response.text();
        const object = JSON.parse(atob(token.split('.')[1]))

        localStorage.setItem("token", token)
        localStorage.setItem("employee_id", object.employee_id)
        localStorage.setItem("first_name", object.first_name)
        localStorage.setItem("last_name", object.last_name)
        localStorage.setItem("email", object.email)
        localStorage.setItem("role", object.role.id)

        if (token) {
            navigate("/");
        }

    }

    return <div>
        <p>Login</p>
        <form className="form" method="post" onSubmit={(e) => submit(e)}>
            <label htmlFor="email">email</label><br></br>
            <input type="text" id="email" onChange={(e) => setEmail(e.target.value)}></input><br></br>

            <label htmlFor="password">password</label><br></br>
            <input type="text" id="password" onChange={(e) => setPassword(e.target.value)}></input><br></br>
            <input type="submit"></input>
        </form>
    </div>
}