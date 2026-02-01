"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { mockSignIn, mockSignOut, mockGetSession } from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionData = mockGetSession();
    setSession(sessionData);
    setLoading(false);
  }, []);

  const signIn = async () => {
    const result = await mockSignIn();
    if (result?.ok) {
      setSession(mockGetSession());
    }
    return result;
  };

  const signOut = () => {
    mockSignOut();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
