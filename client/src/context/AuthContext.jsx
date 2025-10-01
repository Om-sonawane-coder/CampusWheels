import React, { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

let socket;

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/messages/unread-count`, {
        headers: { 'x-auth-token': token },
      });
      if(!response.ok) throw new Error("Failed to fetch count");
      const data = await response.json();
      setUnreadCount(data.count);
    } catch (error) {
      console.error("Failed to fetch unread count", error);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser.user);
        localStorage.setItem('token', token);

        fetchUnreadCount();

        socket = io(import.meta.env.VITE_API_BASE_URL, { query: { userId: decodedUser.user.id } });
        
        const messageListener = (newMessage) => {
          if(newMessage.senderId !== decodedUser.user.id){
            toast.success(`New message received!`);
            setUnreadCount(prevCount => prevCount + 1);
          }
        };
        socket.on('receive_message', messageListener);

        // NAYA LISTENER: Jab messages read ho jaayein, count ko refresh karo
        const readListener = () => {
          fetchUnreadCount();
        };
        socket.on('messages_read', readListener);

      } catch (error) {
        setUser(null);
        localStorage.removeItem('token');
      }
    } else {
      setUser(null);
      setUnreadCount(0);
      localStorage.removeItem('token');
      if (socket) socket.disconnect();
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
        socket.off('messages_read'); // Cleanup
      }
    };
  }, [token, fetchUnreadCount]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };
  
  return (
    <AuthContext.Provider value={{ token, user, login, logout, unreadCount, fetchUnreadCount }}>
      {children}
    </AuthContext.Provider>
  );
};