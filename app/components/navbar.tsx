import { NavLink } from "react-router";

export default function NavBar() {
    return <>
        <section>
            <div className="topbar">
                <NavLink className="link" to="/">company</NavLink>

                <div className="navbar">
                    <NavLink className="link" to="/holiday">holiday</NavLink>
                    <NavLink className="link" to="/team">team</NavLink>
                    <NavLink className="link" to="/admin">admin</NavLink>
                </div>
            </div>
        </section>
    </>;
}