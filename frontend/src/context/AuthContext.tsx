import React, { createContext, useState,  ReactNode } from "react";
import AuthUser from "../types/AuthUser";



interface AuthContextType {
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        return { id: payload.id, cpf: payload.cpf, role: payload.role, token: storedToken };
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (token: string) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userData: AuthUser = {
      id: payload.id,
      cpf: payload.cpf,
      role: payload.role,
      token,
    };
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear()
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
