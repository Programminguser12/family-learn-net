import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "teacher" | "student" | "parent";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users
const demoUsers: Record<UserRole, User> = {
  teacher: { id: "t1", name: "Prof. María García", email: "maria@escuela.com", role: "teacher" },
  student: { id: "s1", name: "Carlos Rodríguez", email: "carlos@escuela.com", role: "student" },
  parent: { id: "p1", name: "Ana Martínez", email: "ana@escuela.com", role: "parent" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, _password: string, role: UserRole): boolean => {
    // Demo login - accept any credentials
    setUser({ ...demoUsers[role], email });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
