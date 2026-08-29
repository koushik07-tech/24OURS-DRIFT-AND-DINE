"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Role } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (identifierOrEmail: string, password?: string) => Promise<{ success: boolean; user: User }>;
  register: (data: { name: string; username: string; email: string; phone?: string; password: string }) => Promise<{ success: boolean; user: User }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
      });
      const json = await res.json();
      if (res.ok && json.success && json.data?.user) {
        setUser(json.data.user);
        try {
          localStorage.setItem("24ours_next_user", JSON.stringify(json.data.user));
        } catch {}
        return json.data.user;
      } else {
        setUser(null);
        try {
          localStorage.removeItem("24ours_next_user");
        } catch {}
        return null;
      }
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Optimistically load from localStorage first for instant UI response
    try {
      const savedUser = localStorage.getItem("24ours_next_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {}

    // Verify session against real backend /api/auth/me
    refreshUser();
  }, [refreshUser]);

  const login = async (identifierOrEmail: string, password?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          identifier: identifierOrEmail,
          password: password || "AdminPassword123!",
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Invalid credentials. Please try again.");
      }

      const loggedInUser = json.data.user;
      setUser(loggedInUser);
      try {
        localStorage.setItem("24ours_next_user", JSON.stringify(loggedInUser));
      } catch {}

      return { success: true, user: loggedInUser };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; username: string; email: string; phone?: string; password: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Registration failed.");
      }

      // Automatically log the user in after registration
      return await login(data.email, data.password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
    } catch {}
    setUser(null);
    try {
      localStorage.removeItem("24ours_next_user");
    } catch {}
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
