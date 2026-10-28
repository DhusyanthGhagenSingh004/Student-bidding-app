import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, ApiError, type AuthUser } from '../lib/api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (name: string, email: string, campusId: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ── Restore session on mount ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    authApi
      .me()
      .then((data) => {
        if (!cancelled) setUser(data.user);
      })
      .catch(() => {
        // 401 = not logged in — that's fine
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // ── Login ────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Network error';
      return { ok: false, error: msg };
    }
  }, []);

  // ── Register ─────────────────────────────────────────────────────────
  const register = useCallback(async (name: string, email: string, campusId: string, password: string) => {
    try {
      const data = await authApi.register({
        name,
        email,
        password,
        campus_id: campusId,
      });
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Network error';
      return { ok: false, error: msg };
    }
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // best-effort
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
