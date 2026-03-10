import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { AuthUser, AuthPharmacy } from "@/types";

const SESSION_TOKEN_KEY = "drugsmart_session_token";

interface AuthContextValue {
  user: AuthUser | null;
  pharmacy: AuthPharmacy | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (pharmacyId: string, email: string, password: string) => Promise<void>;
  registerPharmacy: (data: RegisterPharmacyData) => Promise<string>;
  logout: () => Promise<void>;
}

interface RegisterPharmacyData {
  pharmacyName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  town: string;
  licenseNumber?: string;
  displayName?: string;
  password: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(SESSION_TOKEN_KEY)
  );
  const [isLoading, setIsLoading] = useState(true);

  const sessionData = useQuery(
    api.auth.validateSession,
    token ? { token } : "skip"
  );

  const loginMutation = useMutation(api.auth.login);
  const registerMutation = useMutation(api.auth.registerPharmacy);
  const logoutMutation = useMutation(api.auth.logout);

  // Resolve loading state: when token is null, we're done immediately
  // When token is set, wait for the session query to return
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    if (sessionData !== undefined) {
      setIsLoading(false);
    }
  }, [token, sessionData]);

  const login = useCallback(
    async (pharmacyId: string, email: string, password: string) => {
      const result = await loginMutation({ pharmacyId, email, password });
      localStorage.setItem(SESSION_TOKEN_KEY, result.token);
      setToken(result.token);
    },
    [loginMutation]
  );

  const registerPharmacy = useCallback(
    async (data: RegisterPharmacyData): Promise<string> => {
      const result = await registerMutation(data);
      localStorage.setItem(SESSION_TOKEN_KEY, result.token);
      setToken(result.token);
      return result.pharmacyId;
    },
    [registerMutation]
  );

  const logout = useCallback(async () => {
    if (token) {
      try {
        await logoutMutation({ token });
      } catch {
        // ignore errors on logout
      }
    }
    localStorage.removeItem(SESSION_TOKEN_KEY);
    setToken(null);
  }, [token, logoutMutation]);

  const user: AuthUser | null = sessionData
    ? {
        id: sessionData.user.id as string,
        name: sessionData.user.name,
        email: sessionData.user.email,
        role: sessionData.user.role,
        pharmacyId: sessionData.user.pharmacyId,
      }
    : null;

  const pharmacy: AuthPharmacy | null = sessionData
    ? {
        name: sessionData.pharmacy.name,
        displayName: sessionData.pharmacy.displayName,
        pharmacyId: sessionData.pharmacy.pharmacyId,
        town: sessionData.pharmacy.town,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        pharmacy,
        token,
        isLoading,
        isAuthenticated: !!user,
        login,
        registerPharmacy,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
