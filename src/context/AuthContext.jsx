import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../config/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('dt_admin_token');
    const savedAdmin = localStorage.getItem('dt_admin_user');
    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  // Step 1: Send OTP to email
  const sendOtp = async (email) => {
    return await apiFetch('/api/auth/otp-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  };

  // Step 2: Verify OTP and login
  const verifyOtp = async (email, code) => {
    const data = await apiFetch('/api/auth/otp-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    if (data.user?.role !== 'admin') throw new Error('Access denied. Admin accounts only.');
    localStorage.setItem('dt_admin_token', data.token);
    localStorage.setItem('dt_admin_user', JSON.stringify(data.user));
    setToken(data.token);
    setAdmin(data.user);
    return data;
  };

  // Password-only login for local development
  const loginAdmin = async (password) => {
    const data = await apiFetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    localStorage.setItem('dt_admin_token', data.token);
    localStorage.setItem('dt_admin_user', JSON.stringify(data.user));
    setToken(data.token);
    setAdmin(data.user);
    return data;
  };

  // Google Firebase Login
  const loginWithGoogle = async (idToken) => {
    const data = await apiFetch('/api/auth/admin-google-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    localStorage.setItem('dt_admin_token', data.token);
    localStorage.setItem('dt_admin_user', JSON.stringify(data.user));
    setToken(data.token);
    setAdmin(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('dt_admin_token');
    localStorage.removeItem('dt_admin_user');
    setToken(null);
    setAdmin(null);
  };

  const isViewer = admin?.adminRole === 'viewer';
  const isSuperAdmin = admin?.role === 'admin' && admin?.adminRole !== 'viewer';

  return (
    <AuthContext.Provider value={{ admin, token, loading, sendOtp, verifyOtp, loginAdmin, loginWithGoogle, logout, isViewer, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
