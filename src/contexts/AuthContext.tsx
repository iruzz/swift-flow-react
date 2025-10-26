import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: "siswa" | "admin" | "perusahaan" | "guru";
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:8000";

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get("/api/me");
          setUser(response.data.data);
        } catch (error) {
          console.error("Auth check failed:", error);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      await axios.get("/sanctum/csrf-cookie"); // Laravel Sanctum
      const res = await axios.post("/api/login", { email, password });
      const { user: userData, token: authToken } = res.data.data;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem("token", authToken);

      return { success: true, user: userData };
    } catch (error: any) {
      const message = error.response?.data?.message || "Login gagal";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
