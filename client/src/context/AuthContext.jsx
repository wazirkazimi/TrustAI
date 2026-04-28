import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('foodtrust_user');
    const token  = localStorage.getItem('foodtrust_token');
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('foodtrust_token', data.token);
    localStorage.setItem('foodtrust_user', JSON.stringify(data));
    setUser(data);
    toast.success(`Welcome back, ${data.name}! 👋`);
    return data;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('foodtrust_token', data.token);
    localStorage.setItem('foodtrust_user', JSON.stringify(data));
    setUser(data);
    toast.success(`Account created! Welcome, ${data.name} 🎉`);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('foodtrust_token');
    localStorage.removeItem('foodtrust_user');
    setUser(null);
    toast('Signed out successfully', { icon: '👋' });
  };

  const updateUserLocal = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('foodtrust_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserLocal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
