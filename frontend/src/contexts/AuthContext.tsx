import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  _id: string;
  name: string;
  username: string;
  githubId: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGitHub: () => void;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // This effect runs once when the app loads to check for a logged-in user
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // fetching from the backend's profile endpoint. The proxy will handle the redirect
        const res = await fetch("/api/auth/profile");
        if (res.ok) {
          const data = await res.json();
          // backend should return the user object if they are logged in
          setUser(data.user);
        }
      } catch (error) {
        console.error("User not authenticated:", error);
      } finally {
        setLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  // this function now simply redirects to the backend to start the GitHub login
  const signInWithGitHub = () => {
    window.location.href = "/api/auth/github";
  };

  // this function now calls the backend's logout endpoint
  const signOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    signInWithGitHub,
    signOut,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}