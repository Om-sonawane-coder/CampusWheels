// client/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import router from './router.jsx'; // <-- Nayi file se router ko import karo
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* <-- Step 1: AuthProvider se wrap karo */}
      <RouterProvider router={router} /> {/* <-- Step 2: RouterProvider ko andar rakho */}
    </AuthProvider>
  </React.StrictMode>,
);