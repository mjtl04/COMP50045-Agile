import { NavLink } from "react-router";
import type { User } from "~/utilities/auth";

interface HeaderProps {
    user?: User | null;
}

export function Header({ user }: HeaderProps) {
    return <>
        <section>
            <div className="topbar">
                <NavLink className="nav-logo" to="/">company</NavLink>

                <div className="navbar">
                    <NavLink className="link" to="/holiday">holiday</NavLink>
                    <NavLink className="link" to="/requests">requests</NavLink>
                    <NavLink className="link" to="/admin">admin</NavLink>
                </div>

                {user ? (<> <p>{user.email} </p> <button>Logout</button> </>) : (<></>)}
            </div>
        </section>
    </>;
}