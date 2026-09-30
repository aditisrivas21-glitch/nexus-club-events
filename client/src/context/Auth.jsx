import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api, TOKEN_KEY } from '../api.js';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const logout = () => { localStorage.removeItem(TOKEN_KEY); setToken(null); };
  const login = async (email, password) => {
    const { token: t } = await api('/auth/login', { method: 'POST', body: { email, password } });
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  };
  useEffect(() => { window.addEventListener('nexus-logout', logout); return () => window.removeEventListener('nexus-logout', logout); }, []);
  return <Ctx.Provider value={{ token, login, logout }}>{children}</Ctx.Provider>;
}

export function RequireAdmin({ children }) {
  const { token } = useAuth();
  const loc = useLocation();
  return token ? children : <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
}
