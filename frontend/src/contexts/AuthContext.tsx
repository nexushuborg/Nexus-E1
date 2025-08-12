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

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      // Check if user was previously "logged in" (stored in localStorage)
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
        }
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const signInWithGitHub = () => {
    // Simulate GitHub OAuth flow
    console.log("Simulating GitHub sign-in...");

    const mockUser: User = {
      _id: "mock-123",
      name: "Jayashree",
      username: "Jayashree-25",
      githubId: "jayashree-github-id",
      avatarUrl: "https://github.com/Jayashree-25.png"
    };

    // Save to localStorage to persist across page refreshes
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setUser(mockUser);

    // Simulate redirect back to app
    window.location.href = "/dashboard";
  };

  const signOut = async () => {
    console.log("Signing out...");

    // Remove from localStorage
    localStorage.removeItem('mockUser');
    setUser(null);

    // Redirect to home
    window.location.href = "/";
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