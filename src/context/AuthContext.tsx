"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Role } from "@/types";
import { authApi } from "@/lib/api/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (data: {
    name: string;
    username: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword?: string;
  }) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await authApi.getMe();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ identifier, password });
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setIsLoading(false);
        return { success: true, user: res.data.user };
      }
      setIsLoading(false);
      return { success: false, error: res.error?.message || "Invalid username or password." };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || "Failed to login" };
    }
  };

  const register = async (data: {
    name: string;
    username: string;
    email: string;
    phone?: string;
    password: string;
    confirmPassword?: string;
  }) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(data);
      setIsLoading(false);
      if (res.success) {
        return { success: true, message: res.message || "Account created successfully. Please log in." };
      }
      return { success: false, error: res.error?.message || "Registration failed" };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || "Failed to register" };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setIsLoading(false);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
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
