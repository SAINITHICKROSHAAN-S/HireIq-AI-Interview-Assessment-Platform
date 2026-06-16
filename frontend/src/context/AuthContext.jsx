import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore auth state from localStorage on mount
    const savedToken = localStorage.getItem('hireiq_token');
    const savedEmail = localStorage.getItem('hireiq_email');
    const savedRole = localStorage.getItem('hireiq_role');

    if (savedToken && savedEmail && savedRole) {
      setToken(savedToken);
      setUser({
        email: savedEmail,
        role: savedRole, // e.g. 'ADMIN', 'RECRUITER', 'CANDIDATE'
      });
    }
    setIsLoading(false);
  }, []);

  const login = (authToken, email, role) => {
    setToken(authToken);
    setUser({ email, role });
    localStorage.setItem('hireiq_token', authToken);
    localStorage.setItem('hireiq_email', email);
    localStorage.setItem('hireiq_role', role);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hireiq_token');
    localStorage.removeItem('hireiq_email');
    localStorage.removeItem('hireiq_role');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
