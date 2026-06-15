import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount and sync from Supabase
  useEffect(() => {
    const restoreSession = async () => {
      const stored = localStorage.getItem('truebite_user');
      const token  = localStorage.getItem('truebite_token');
      if (stored && token) {
        try {
          setUser(JSON.parse(stored));
          // Fetch fresh user profile from backend database
          const { data } = await authAPI.getMe();
          // Merge token from stored session with data
          const parsed = JSON.parse(stored);
          const merged = { ...data, token: parsed.token };
          setUser(merged);
          localStorage.setItem('truebite_user', JSON.stringify(merged));
        } catch (err) {
          console.warn("Failed to sync user session on mount:", err.message);
          // If token expired (401), we clean it up
          if (err.response?.status === 401) {
            localStorage.removeItem('truebite_token');
            localStorage.removeItem('truebite_user');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('truebite_token', data.token);
    localStorage.setItem('truebite_user', JSON.stringify(data));
    setUser(data);
    toast.success(`Welcome back, ${data.name}! 👋`);
    return data;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('truebite_token', data.token);
    localStorage.setItem('truebite_user', JSON.stringify(data));
    setUser(data);
    toast.success(`Account created! Welcome, ${data.name} 🎉`);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('truebite_token');
    localStorage.removeItem('truebite_user');
    setUser(null);
    toast('Signed out successfully', { icon: '👋' });
  };

  const updateUserLocal = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('truebite_user', JSON.stringify(updated));
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
