import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const parseJSON = async (res) => {
  try {
    return await res.json();
  } catch {
    throw new Error('Server returned an unexpected response. Is the backend running?');
  }
};

const TOKEN_KEY = 'qc_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setLoading(false);
      });
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseJSON(res);
    if (!res.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email, avatarType: data.avatarType, avatarUrl: data.avatarUrl });
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await parseJSON(res);
    if (!res.ok) throw new Error(data.message || 'Registration failed');

    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email, avatarType: data.avatarType, avatarUrl: data.avatarUrl });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
