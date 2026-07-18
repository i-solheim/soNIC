"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, AuthState, UserRole } from "./types";

// ============================================================
// Auth Context
// ============================================================
interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
});

// ============================================================
// Provider
// ============================================================
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const token = localStorage.getItem("sonic_token");
      const userJson = localStorage.getItem("sonic_user");
      if (token && userJson) {
        const user: User = JSON.parse(userJson);
        // Re-sync cookies in case they expired
        document.cookie = `sonic_token=${token}; path=/; max-age=86400`;
        document.cookie = `sonic_role=${user.role}; path=/; max-age=86400`;
        setState({ user, token, isAuthenticated: true, isLoading: false });
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    } catch {
      setState((s) => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "auth.error.invalid" };
      }

      localStorage.setItem("sonic_token", data.token);
      localStorage.setItem("sonic_user", JSON.stringify(data.user));
      document.cookie = `sonic_token=${data.token}; path=/; max-age=86400`;
      document.cookie = `sonic_role=${data.user.role}; path=/; max-age=86400`;

      setState({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch {
      return { success: false, error: "auth.error.network" };
    }
  };

  const register = async (data: any): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: data.email, 
          password: data.password, 
          name: data.name, 
          role: data.role, 
          orgType: data.orgType 
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        return { success: false, error: result.error || "auth.error.network" };
      }

      localStorage.setItem("sonic_token", result.token);
      localStorage.setItem("sonic_user", JSON.stringify(result.user));
      document.cookie = `sonic_token=${result.token}; path=/; max-age=86400`;
      document.cookie = `sonic_role=${result.user.role}; path=/; max-age=86400`;

      setState({ user: result.user, token: result.token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch {
      return { success: false, error: "auth.error.network" };
    }
  };

  const logout = () => {
    localStorage.removeItem("sonic_token");
    localStorage.removeItem("sonic_user");
    // Clear cookies
    document.cookie = "sonic_token=; path=/; max-age=0";
    document.cookie = "sonic_role=; path=/; max-age=0";
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// ============================================================
// Dashboard redirect helper
// ============================================================
export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "startup": return "/startup/dashboard";
    case "partner": return "/partner/dashboard";
    case "nic": return "/nic/dashboard";
    default: return "/";
  }
}
