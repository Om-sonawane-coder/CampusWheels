import React from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    // Background color updated
    <div className="bg-[var(--color-background)]">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="text-center md:text-left">
            {/* Text colors updated */}
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
              The Smart Way to <span className="text-[var(--color-primary)]">Buy & Sell</span> on Campus
            </h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto md:mx-0 mb-8">
              CampusWheels is a platform built by students, for students. Find reliable used bikes, scooters, and cycles from your seniors and batchmates, or sell yours when you graduate.
            </p>
            {/* Button colors updated */}
            <Link 
              to="/vehicles"
              className="inline-block bg-[var(--color-primary)] text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-[var(--color-secondary)] transition-transform transform hover:scale-105"
            >
              Explore Listings 🏍️
            </Link>
          </div>

          {/* Right Column: Image */}
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop" 
              alt="Student on a motorcycle" 
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;