import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('24ours_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    setIsLoading(true);
    // Simulate authentication API delay
    await new Promise((res) => setTimeout(res, 600));

    const role = email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
    const mockUser = {
      id: role === 'ADMIN' ? 'usr-admin-01' : 'usr-racer-01',
      name: email.toLowerCase().includes('admin') ? 'Master Admin' : email.split('@')[0] || 'Racer VIP',
      email: email.toLowerCase(),
      role: role,
      token: 'jwt_mock_token_' + Date.now(),
    };

    setUser(mockUser);
    localStorage.setItem('24ours_user', JSON.stringify(mockUser));
    setIsLoading(false);
    return { success: true, user: mockUser };
  };

  const signup = async (name, email, phone, password) => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 600));

    const role = email.toLowerCase().includes('admin') ? 'ADMIN' : 'USER';
    const mockUser = {
      id: 'usr-' + Date.now(),
      name: name || 'Racer VIP',
      email: email.toLowerCase(),
      phone: phone || '',
      role: role,
      token: 'jwt_mock_token_' + Date.now(),
    };

    setUser(mockUser);
    localStorage.setItem('24ours_user', JSON.stringify(mockUser));
    setIsLoading(false);
    return { success: true, user: mockUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('24ours_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, isAuthenticated: !!user, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
