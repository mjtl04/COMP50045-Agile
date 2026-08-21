import { createContext, createCookieSessionStorage, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import type { User } from "./interfaces/user";

const AUTH_COOKIE_NAME = "__session";

export interface JWTPayload {
  jti: string,
  employee_id: number,
  first_name: string,
  last_name: string,
  email: string,
  role: { id: number },
  exp: number
}

interface RefreshResponse {
  access_token: string;
  refresh_token?: string;
}

export const authContext = createContext<User | null>(null);
export const tokenContext = createContext<string | null>(null);

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

export async function getUserFromRequest(request: Request): Promise<{ user: User | null; cookieHeader?: string; token?: string }> {

  let cookieHeader: string | undefined;
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));

  let access_token = session.get("access_token");
  let refresh_token = session.get("refresh_token");

  let claims = parseJwt(access_token);

  if (!claims) {
    return { user: null };
  }

  const now = Math.floor(Date.now() / 1000);
  const expired = claims.exp <= now + 60;

  if (expired) {
    if (!refresh_token) {
      cookieHeader = await sessionStorage.destroySession(session);
      return { user: null, cookieHeader };
    }
    try {
      const refreshedTokens = await refreshAccessToken(refresh_token);
      access_token = refreshedTokens.access_token;
      claims = parseJwt(access_token);
      if (!claims) {
        cookieHeader = await sessionStorage.destroySession(session);
        return { user: null, cookieHeader };
      }
      session.set("access_token", access_token);
      if (refreshedTokens.refresh_token) {
        session.set("refresh_token", refreshedTokens.refresh_token);
      }
      cookieHeader = await sessionStorage.commitSession(session);
    } catch (error) {
      cookieHeader = await sessionStorage.destroySession(session);
      return { user: null, cookieHeader };
    }
  }

  const user: User = {
    id: claims.employee_id,
    email: claims.email
  };

  return { user: user, cookieHeader: cookieHeader, token: access_token };
}

export async function refreshAccessToken(refreshToken: string): Promise<RefreshResponse> {
  const response = await fetch('http://localhost:8900/refresh', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Refresh failed with status ${response.status}`);
  }

  const authResponse: RefreshResponse = await response.json();

  return authResponse;

}

export async function requireAuthMiddleware({ request, context }: LoaderFunctionArgs | ActionFunctionArgs, next?: () => Promise<Response>): Promise<Response | void> {
  const { user, cookieHeader, token } = await getUserFromRequest(request);

  if (!user) {
    const url = new URL(request.url);
    const redirectTo = url.pathname + url.search;
    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  context.set(authContext, user);
  context.set(tokenContext, token ?? null);

  if (next) {
    const response = await next();
    if (cookieHeader && response instanceof Response) {
      response.headers.append("Set-Cookie", cookieHeader);
    }
    return response;
  }
}
