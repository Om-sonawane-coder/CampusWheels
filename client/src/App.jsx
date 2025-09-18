import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';
import Footer from './components/Footer';

function App() {
  return (
    // Sirf is line me 'bg-slate-50' ko badla gaya hai
    <div className="flex flex-col min-h-screen bg-[var(--color-background)]">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
        }}
      />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;