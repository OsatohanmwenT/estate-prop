"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "~/services/authService";
import { User } from "~/types/user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from API on mount (cookies sent automatically)
  useEffect(() => {
    const initAuth = async () => {
      // Don't try to load user on auth pages
      if (typeof window !== "undefined") {
        const pathname = window.location.pathname;
        if (pathname.includes("/sign-in") || pathname.includes("/sign-up")) {
          setIsLoading(false);
          return;
        }
      }

      try {
        const response = await authService.getProfile();
        if (response.user) {
          setUser(response.user);
        }
      } catch (error) {
        // Not authenticated or session expired
        console.log("Not authenticated:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      // Cookies set automatically by backend
      setUser(response.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ) => {
    try {
      const response = await authService.signUp({
        email,
        password,
        fullName,
        phone,
      });
      // Cookies set automatically by backend
      setUser(response.user);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Cookies cleared by backend
      setUser(null);
      if (typeof window !== "undefined") {
        window.location.href = "/sign-in";
      }
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      if (response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error("Refresh user error:", error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
