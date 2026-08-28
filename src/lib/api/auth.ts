import { User } from "@/types";

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export const authApi = {
  async register(data: {
    name: string;
    username: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword?: string;
  }): Promise<AuthResponse & { message?: string }> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(data: { identifier?: string; email?: string; username?: string; password: string }): Promise<AuthResponse> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async logout(): Promise<void> {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
  },

  async getMe(): Promise<{ success: boolean; data?: { user: User }; error?: any }> {
    const res = await fetch("/api/auth/me", {
      method: "GET",
    });
    return res.json();
  },
};
