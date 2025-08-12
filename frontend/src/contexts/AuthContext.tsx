import { createContext, useContext, useEffect, useState } from "react";

export interface MockUser {
  id: string;
  email?: string;
  user_metadata?: { avatar_url?: string; user_name?: string; name?: string };
}

// We add our new signInWithEmail function to the context type
interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>; 
  signOut: () => Promise<void>;
}

const STORAGE_KEY = "dsa-tracker-user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  const signInWithGitHub = async () => {
    const mock: MockUser = {
      id: crypto.randomUUID(),
      email: "octocat@example.com",
      user_metadata: {
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
        user_name: "octocat",
        name: "The Octocat",
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
    setUser(mock);
    window.location.href = "/dashboard";
  };

  // This function simulates logging in with an email and password.
  // For now, it ignores the password and creates a user based on the email.
  const signInWithEmail = async (email: string) => {
    const mock: MockUser = {
        id: crypto.randomUUID(),
        email: email,
        user_metadata: {
            avatar_url: `https://ui-avatars.com/api/?name=${email.charAt(0)}&background=random`,
            user_name: email.split('@')[0],
            name: email.split('@')[0],
        }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
    setUser(mock);
    window.location.href = "/dashboard";
  };


  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGitHub, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
