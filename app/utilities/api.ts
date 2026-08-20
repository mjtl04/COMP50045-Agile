import type { AuthResponse } from "./interfaces/authResponse";
import type { LeaveRequest } from "./interfaces/leaveRequest";

const API_URL = 'http://localhost:8900'

export async function loginAPI(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Login failed: ${data.message}`);
    }

    const access_token: AuthResponse = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
    };

    return access_token;

}

export async function getUserHolidayAPI(user_id: number, access_token: string): Promise<LeaveRequest[]> {
    const response = await fetch(`${API_URL}/leave-requests/user/${user_id}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${access_token}`,
        },
    });

    const contentType = response.headers.get("content-type") ?? "";
    const body =
        contentType.includes("application/json")
            ? await response.json().catch(() => null)
            : await response.text().catch(() => "");

    if (!response.ok) {
        throw new Error(
            `Holiday Fetch Failed: status ${response.status} ${response.statusText} | body: ${typeof body === "string" ? body : JSON.stringify(body)
            }`
        );
    }

    return body as LeaveRequest[];
}