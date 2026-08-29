"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Role } from "@/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, role?: Role) => Promise<{ success: boolean; user: User }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("24ours_next_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, roleOverride?: Role) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const role: Role = roleOverride || (email.toLowerCase().includes("admin") ? "ADMIN" : "USER");
    const mockUser: User = {
      id: role === "ADMIN" ? "usr-admin-01" : "usr-racer-01",
      name: role === "ADMIN" ? "Master Admin" : email.split("@")[0] || "Racer VIP",
      email: email.toLowerCase(),
      role: role,
      token: "jwt_token_" + Date.now(),
    };

    setUser(mockUser);
    localStorage.setItem("24ours_next_user", JSON.stringify(mockUser));
    setIsLoading(false);
    return { success: true, user: mockUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("24ours_next_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        isLoading,
        login,
        logout,
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
