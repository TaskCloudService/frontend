// Made bu ChatGPT4o
// Has a useAuth hook to access auth state
// Tries ti make a silent refresh on mount
// Has 3 types of state: loading, in, out
// Extracts user ID, email, roles, and name from the token payload
// Uses cookies to try refreshing the access token silently on page load and reload
// Upon log in sends email/password to backend and stores the token on success
// Clear the session when logout is called and redirects to /events
// Supports both standard and Microsoft-style role claims
// Prevents rendering children until loading is complete to avoid flicker

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
}

interface LoginResult {
  requiresVerification: boolean;
  userId?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

function decodeJwt(token: string): any {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT");
  return JSON.parse(atob(parts[1]));
}

type AuthState =
  | { status: "loading"; user: null; token: null }
  | { status: "in";      user: User; token: string }
  | { status: "out";     user: null; token: null };


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
    token: null,
  });

  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          const { token } = await res.json();
          if (token) {
            bootstrapFromToken(token);
            return;
          }
        }
      } catch {
        console.warn("Silent refresh failed");
      }
      setState({ status: "out", user: null, token: null });
    })();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Login failed");

    if (json.token) bootstrapFromToken(json.token);

    return {
      requiresVerification: !!json.requiresVerification,
      userId: json.userId,
    };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setState({ status: "out", user: null, token: null });
    router.push("/events");
  };

  function bootstrapFromToken(token: string) {
    const claims = decodeJwt(token);

    const rawRole =
      claims.role ??
      claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const roles = Array.isArray(rawRole) ? rawRole : rawRole ? [rawRole] : [];

    setState({
      status: "in",
      token,
      user: {
        id: claims.sub,
        email: claims.email,
        roles,
        firstName: claims.firstName || claims.given_name || "",
        lastName: claims.lastName || claims.family_name || "",
      },
    });
  }

  if (state.status === "loading") return null; 

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        accessToken: state.token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}