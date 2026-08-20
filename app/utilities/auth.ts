import { createContext, createCookieSessionStorage } from "react-router";

const AUTH_COOKIE_NAME = "__session";
const API_URL = 'http://localhost:8900'

export interface Employee {
    email: string;
    accessToken: string;
    refreshToken: string;
}

export interface AuthToken {
    jwt?: string
}

export const authContext = createContext<Employee | null>(null);
export const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: AUTH_COOKIE_NAME,
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secrets: ["jwt"],
        secure: process.env.NODE_ENV === "production",
    }
});

export async function login(email: string, password: string): Promise<AuthToken> {

    const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" }
    });

    const jwt = await response.text();

    if (!response.ok) {
        throw new Error(`Login failed (Status: ${response.status})`);
    }

    const token: AuthToken = {
        jwt: jwt
    };

    return token;
}