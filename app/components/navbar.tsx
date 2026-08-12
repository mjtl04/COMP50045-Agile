import { NavLink } from "react-router";

export default function NavBar() {
    const name = localStorage.getItem("first_name")
    return <>
        <section>
            <div className="topbar">
                <NavLink className="nav-logo" to="/">company</NavLink>

                <div className="navbar">
                    <NavLink className="link" to="/holiday">holiday</NavLink>
                    <NavLink className="link" to="/requests">requests</NavLink>
                    <NavLink className="link" to="/admin">admin</NavLink>
                </div>

                <p>{name}</p>
            </div>
        </section>
    </>;
}