import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // <-- Import karo

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // <-- User details ke liye nayi state

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token); // Token ko decode karo
        setUser(decodedUser.user); // User object ko state me daalo
        localStorage.setItem('token', token);
      } catch (error) {
        // Agar token invalid hai
        setUser(null);
        localStorage.removeItem('token');
      }
    } else {
      setUser(null);
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (newToken) => setToken(newToken);
  const logout = () => setToken(null);

  // Value me 'user' ko bhi bhejo
  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};