import CONSTANTS from "@/lib/constants";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export class HTTPService {
	private async getAccessToken(): Promise<string | undefined> {
		const cookieStore = await cookies();
		return cookieStore.get(CONSTANTS.ACCESS_TOKEN)?.value;
	}

	private async getRefreshToken(): Promise<string | undefined> {
		const cookieStore = await cookies();
		return cookieStore.get(CONSTANTS.REFRESH_TOKEN)?.value;
	}

	private async refreshAccessToken(): Promise<string | null> {
		const refreshToken = await this.getRefreshToken();
		if (!refreshToken) return null;

		try {
			const response = await fetch(`${API_URL}/auth/refresh`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${refreshToken}`,
				},
			});

			if (!response.ok) {
				return null;
			}

			const data = await response.json();

			if (data.access_token) {
				// Attempt to update cookies. This works in Server Actions or Route Handlers,
				// but will silently fail in Server Components during rendering.
				try {
					const cookieStore = await cookies();
					cookieStore.set(CONSTANTS.ACCESS_TOKEN, data.access_token, {
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						sameSite: "lax",
						path: "/",
						maxAge: CONSTANTS.AUTH_MAX_AGE,
					});

					if (data.refresh_token) {
						cookieStore.set(CONSTANTS.REFRESH_TOKEN, data.refresh_token, {
							httpOnly: true,
							secure: process.env.NODE_ENV === "production",
							sameSite: "lax",
							path: "/",
							maxAge: CONSTANTS.AUTH_MAX_AGE,
						});
					}
				} catch {
					// Expected to fail if called during Server Component render phase.
				}

				return data.access_token;
			}
			return null;
		} catch {
			return null;
		}
	}

	protected async request<T>(
		endpoint: string,
		options: RequestOptions = {},
	): Promise<T> {
		const { requireAuth = true, ...customOptions } = options;

		const headers = new Headers(customOptions.headers);
		if (
			!headers.has("Content-Type") &&
			!(customOptions.body instanceof FormData)
		) {
			headers.set("Content-Type", "application/json");
		}

		if (requireAuth) {
			const token = await this.getAccessToken();
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
		}

		let response = await fetch(`${API_URL}${endpoint}`, {
			...customOptions,
			headers,
		});

		// 401 Unauthorized -> Attempt to refresh token and retry
		if (response.status === 401 && requireAuth) {
			const newToken = await this.refreshAccessToken();
			if (newToken) {
				// Retry with new token
				headers.set("Authorization", `Bearer ${newToken}`);
				response = await fetch(`${API_URL}${endpoint}`, {
					...customOptions,
					headers,
				});
			}
		}

		if (!response.ok) {
			// Extract specific error details if possible
			let errorMessage = "Request failed";
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorData.error || errorMessage;
			} catch {
				errorMessage = response.statusText || errorMessage;
			}

			const error = new Error(errorMessage) as Error & { status: number };
			error.status = response.status;
			throw error;
		}

		// Handle empty responses
		if (response.status === 204) {
			return {} as T;
		}

		return response.json();
	}

	protected async get<T>(
		endpoint: string,
		options?: Omit<RequestOptions, "method" | "body">,
	): Promise<T> {
		return this.request<T>(endpoint, { ...options, method: "GET" });
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected async post<T>(
		endpoint: string,
		body: any,
		options?: Omit<RequestOptions, "method" | "body">,
	): Promise<T> {
		const isFormData = body instanceof FormData;
		return this.request<T>(endpoint, {
			...options,
			method: "POST",
			body: isFormData ? body : JSON.stringify(body),
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected async patch<T>(
		endpoint: string,
		body: any,
		options?: Omit<RequestOptions, "method" | "body">,
	): Promise<T> {
		const isFormData = body instanceof FormData;
		return this.request<T>(endpoint, {
			...options,
			method: "PATCH",
			body: isFormData ? body : JSON.stringify(body),
		});
	}

	protected async delete<T>(
		endpoint: string,
		options?: Omit<RequestOptions, "method" | "body">,
	): Promise<T> {
		return this.request<T>(endpoint, { ...options, method: "DELETE" });
	}
}
