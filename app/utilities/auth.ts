import { createContext, createCookieSessionStorage, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";

const AUTH_COOKIE_NAME = "__session";
const API_URL = 'http://localhost:8900'

export interface AuthToken {
    access_token?: string
    refresh_token?: string
    expires_at?: number;
}

export interface User {
    email: string;
    accessToken: string;
}

export interface JWTPayload {
    sub?: string;
    email?: string;
    exp?: number;
    [key: string]: unknown;
}

export const authContext = createContext<User | null>(null);
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

    const contentType = response.headers.get("content-type") ?? "";

    const data = contentType.includes("application/json") ? await response.json() : await response.text();

    if (!response.ok) {
        const message = typeof data === "string" ? data : (data?.message ?? JSON.stringify(data));
        throw new Error(`Login failed: ${message}`);
    }

    const token: AuthToken = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_in ? Math.floor(Date.now() / 1000) + data.expires_in : undefined,
    };

    if (typeof data === "object" && data !== null) {
        return { access_token: data.jwt };
    }

    return { access_token: data };
}

export function parseJwt(token: string): JWTPayload | null {
    try {
        const base64Url = token.split(".")[1];

        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

        const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export async function getUserFromRequest(request: Request): Promise<{ user: User | null; setCookieHeader?: string }> {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    let token: AuthToken | undefined = session.get("token");

    if (!token || !token.access_token) {
        return { user: null };
    }

    const now = Math.floor(Date.now() / 1000);
    let setCookieHeader: string | undefined;

    const isExpired = token.expires_at ? token.expires_at <= now + 60 : false;

    if (isExpired && token.refresh_token) {
        try {
            // const refreshed = await refreshAccessToken(tokens.refresh_token);
            // token = refreshed;
            // session.set("tokens", token);
            // setCookieHeader = await sessionStorage.commitSession(session);
        } catch {
            setCookieHeader = await sessionStorage.destroySession(session);
            return { user: null, setCookieHeader };
        }
    }

    const payload = parseJwt(token.access_token);
    const email = session.get("email") || payload?.email || "User";

    return {
        user: {
            email,
            accessToken: token.access_token,
        },
        setCookieHeader,
    };
}

export async function requireAuthMiddleware({ request, context }: LoaderFunctionArgs | ActionFunctionArgs, next?: () => Promise<Response>): Promise<Response | void> {
    const { user, setCookieHeader } = await getUserFromRequest(request);

    if (!user) {
        const url = new URL(request.url);
        const redirectTo = url.pathname + url.search;
        throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    }

    context.set(authContext, user);

    if (next) {
        const response = await next();
        if (setCookieHeader && response instanceof Response) {
            response.headers.append("Set-Cookie", setCookieHeader);
        }
        return response;
    }
}