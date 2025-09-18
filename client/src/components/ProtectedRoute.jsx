import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    // Agar user logged-in nahi hai, toh login page par bhej do
    return <Navigate to="/login" />;
  }

  return children; // Agar logged-in hai, toh page dikhao
};

export default ProtectedRoute;