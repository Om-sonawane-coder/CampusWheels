import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const navLinkClasses = "font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors duration-200";
  const mobileNavLinkClasses = "block px-3 py-2 rounded-md font-medium text-[var(--color-secondary)] hover:bg-[var(--color-background)]";

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-[var(--color-secondary)]">
            Campus<span className="text-[var(--color-primary)]">Wheels</span>
          </Link>

          {/* == DESKTOP MENU == */}
          <ul className="hidden md:flex space-x-8 items-center">
            <li><Link to="/vehicles" className={navLinkClasses}>Vehicles</Link></li>
            <li><Link to="/contact" className={navLinkClasses}>Contact</Link></li>
            
            {token ? (
              <>
                <li><Link to="/dashboard" className={navLinkClasses}>My Listings</Link></li>
                <li><Link to="/upload" className="bg-[var(--color-primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--color-secondary)] transition-all duration-200">Upload</Link></li>
                <li>
                  <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className={navLinkClasses}>Login</Link></li>
                <li><Link to="/signup" className="bg-[var(--color-primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--color-secondary)] transition-all duration-200">Signup</Link></li>
              </>
            )}
          </ul>

          {/* == MOBILE MENU BUTTON == */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
          </button>
        </div>
      </div>

      {/* == MOBILE MENU DROPDOWN == */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/vehicles" className={mobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>Vehicles</Link>
          <Link to="/contact" className={mobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>Contact</Link>
          {token ? (
            <>
              <Link to="/dashboard" className={mobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>My Listings</Link>
              <Link to="/upload" className={mobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>Upload</Link>
              <button onClick={handleLogout} className="w-full text-left bg-red-500 text-white font-bold py-2 px-3 rounded-md mt-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={mobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" className={mobileNavLinkClasses} onClick={() => setIsMenuOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;