export const API_URL = import.meta.env.VITE_API_URL ?? "https://api.localhost";
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://localhost";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const body = await res.json().catch(() => undefined);
  if (!res.ok) {
    throw new ApiError(body?.message ?? "Erro inesperado. Tente novamente.", res.status);
  }
  return body as T;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "CLIENT" | "PROFESSIONAL";
}

export interface AuthResponse {
  user: AuthUser;
  tokens: { accessToken: string; refreshToken: string };
}

export const authApi = {
  register: (data: { email: string; password: string; name: string; consent: boolean }) =>
    request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  me: (token: string) => request<AuthUser>("/auth/me", {}, token),
};

export interface Plan {
  id: string;
  code: "ESSENCIAL" | "PLUS" | "ELITE";
  name: string;
  tagline: string;
  monthlyPrice: number;
  features: string[];
}

export const plansApi = {
  list: () => request<Plan[]>("/plans"),
};

export const couponsApi = {
  validate: (code: string) => request<{ code: string; percentOff: number }>("/coupons/validate", { method: "POST", body: JSON.stringify({ code }) }),
};

export interface CheckoutResponse {
  subscriptionId: string;
  paymentId: string;
  status: "PENDING" | "APPROVED" | "FAILED";
  checkoutUrl?: string;
  pixQrCode?: string;
  amount: number;
}

export const paymentsApi = {
  checkout: (
    data: { planCode: string; period: string; couponCode?: string; method: "pix" | "cartao" },
    token: string
  ) => request<CheckoutResponse>("/checkout", { method: "POST", body: JSON.stringify(data) }, token),
};
