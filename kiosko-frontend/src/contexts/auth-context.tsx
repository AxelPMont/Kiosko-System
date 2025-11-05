import React from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  fullName: string;
  role: "admin" | "worker";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        nombreUsuario: username,
        clave: password
      });

      const { idUsuario, username: u, rol, token, nombreCompleto } = res.data;

      const mappedUser: User = {
        id: idUsuario,
        username: u,
        fullName: nombreCompleto,
        role: rol === "ADMINISTRADOR" ? "admin" : "worker",
      };

      localStorage.setItem("user", JSON.stringify(mappedUser));
      localStorage.setItem("token", token);

      setUser(mappedUser);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error("Login failed:", err);
      throw new Error(
        err.response?.data?.message || "Usuario o contraseña incorrectos"
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};