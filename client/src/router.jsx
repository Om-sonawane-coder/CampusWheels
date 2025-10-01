import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Saare pages import karo
import AboutPage from './pages/AboutPage.jsx';
import ContactAdminPage from './pages/ContactAdminPage.jsx';
import VehiclesPage from './pages/VehiclesPage.jsx'; // Yeh hamari puraani HomePage hai
import VehicleDetailPage from './pages/VehicleDetailPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import EditPage from './pages/EditPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ChatPage from './pages/ChatPage.jsx';
import ConversationsPage from './pages/ConversationsPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/', // Root URL ab AboutPage dikhayega
        element: <AboutPage />,
      },
      {
        path: '/vehicles', // Gaadiyon ki list is URL par dikhegi
        element: <VehiclesPage />,
      },
      {
        path: '/contact', // Contact page ka naya route
        element: <ContactAdminPage />,
      },
      {
        path: '/vehicle/:id', // Single vehicle details
        element: <VehicleDetailPage />,
      },
      {
        path: '/dashboard', // User ka personal dashboard
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/upload', // Nayi vehicle upload karna
        element: (
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/edit/:id', // Vehicle ko edit karna
        element: (
          <ProtectedRoute>
            <EditPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/chat/:receiverId', // <-- ':receiverId' add karo
        element: (
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/chats',
        element: <ProtectedRoute><ConversationsPage /></ProtectedRoute>
      },
      { 
        path: '/signup',
        element: <SignupPage /> 
      },
      {
        path: '/login',
        element: <LoginPage />
      },
    ],
  },
]);

export default router;