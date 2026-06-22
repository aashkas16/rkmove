import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { API_BASE_URL } from "@/config";

interface User {
  id: number;
  email: string;
  role: string;
  full_name: string | null;
}

interface AuthContextType {
  user: User | null;
  session: { user: User } | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  login: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<{ user: User } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedSession = localStorage.getItem("rk_admin_session");
    if (savedSession) {
      try {
        const u = JSON.parse(savedSession);
        setUser(u);
        setSession({ user: u });
        setIsAdmin(u.role === "super_admin" || u.role === "staff");
      } catch (err) {
        console.error("Error parsing session:", err);
        localStorage.removeItem("rk_admin_session");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Invalid credentials");
    }

    const data = await res.json();
    if (!data.user) {
      throw new Error("Invalid response from server");
    }

    const u = data.user;
    localStorage.setItem("rk_admin_session", JSON.stringify(u));
    setUser(u);
    setSession({ user: u });
    setIsAdmin(u.role === "super_admin" || u.role === "staff");
  };

  const signOut = async () => {
    localStorage.removeItem("rk_admin_session");
    setUser(null);
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
