"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, AuthState, UserRole } from "./types";
import { MOCK_USERS, MOCK_CREDENTIALS } from "./mock-data";

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
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 900));

    let user: User | undefined;
    let valid = false;

    // First check custom registered users
    const customUsersJson = localStorage.getItem("sonic_registered_users");
    const customCredsJson = localStorage.getItem("sonic_registered_creds");
    if (customUsersJson && customCredsJson) {
      const users: User[] = JSON.parse(customUsersJson);
      const creds = JSON.parse(customCredsJson);
      if (creds[email.toLowerCase()] && creds[email.toLowerCase()].password === password) {
        valid = true;
        user = users.find(u => u.id === creds[email.toLowerCase()].userId);
      }
    }

    // Fallback to MOCK_CREDENTIALS
    if (!valid) {
      const cred = MOCK_CREDENTIALS[email.toLowerCase()];
      if (cred && cred.password === password) {
        valid = true;
        user = MOCK_USERS.find((u) => u.id === cred.userId);
      }
    }

    if (!valid || !user) {
      return { success: false, error: "auth.error.invalid" };
    }

    const token = `token_${user.id}_${Date.now()}`;
    localStorage.setItem("sonic_token", token);
    localStorage.setItem("sonic_user", JSON.stringify(user));
    document.cookie = `sonic_token=${token}; path=/; max-age=86400`;
    document.cookie = `sonic_role=${user.role}; path=/; max-age=86400`;

    setState({ user, token, isAuthenticated: true, isLoading: false });
    return { success: true };
  };

  const register = async (data: any): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 900));

    const email = data.email.toLowerCase();
    
    // Check if exists in mock
    if (MOCK_CREDENTIALS[email]) {
      return { success: false, error: 'Email already registered' };
    }

    const customUsersJson = localStorage.getItem("sonic_registered_users");
    const customCredsJson = localStorage.getItem("sonic_registered_creds");
    const customUsers: User[] = customUsersJson ? JSON.parse(customUsersJson) : [];
    const customCreds = customCredsJson ? JSON.parse(customCredsJson) : {};

    if (customCreds[email]) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser: User = {
      id: `reg_${Date.now()}`,
      email,
      name: data.name,
      role: data.role,
      orgType: data.orgType,
      createdAt: new Date().toISOString()
    };

    customUsers.push(newUser);
    customCreds[email] = { password: data.password, userId: newUser.id };

    localStorage.setItem("sonic_registered_users", JSON.stringify(customUsers));
    localStorage.setItem("sonic_registered_creds", JSON.stringify(customCreds));

    const token = `token_${newUser.id}_${Date.now()}`;
    localStorage.setItem("sonic_token", token);
    localStorage.setItem("sonic_user", JSON.stringify(newUser));
    document.cookie = `sonic_token=${token}; path=/; max-age=86400`;
    document.cookie = `sonic_role=${newUser.role}; path=/; max-age=86400`;

    setState({ user: newUser, token, isAuthenticated: true, isLoading: false });
    return { success: true };
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
