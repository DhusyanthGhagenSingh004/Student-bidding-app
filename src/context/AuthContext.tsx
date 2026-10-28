import { createContext, useContext, useState, type ReactNode } from 'react';
import { currentUser } from '../data/mockData';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, campusId: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(currentUser); // auto-logged-in for demo

  const login = (_email: string, _password: string): boolean => {
    // Demo: always succeed
    setUser(currentUser);
    return true;
  };

  const register = (name: string, email: string, campusId: string, _password: string): boolean => {
    setUser({ id: 'u-new', name, email, campusId });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
