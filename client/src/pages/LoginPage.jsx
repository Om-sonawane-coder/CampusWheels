import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate(); // <-- Navigation ke liye zaroori

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.msg || 'Something went wrong');
      
      toast.success('Logged in successfully!');
      login(result.token);
      navigate('/'); // <-- Successful login ke baad redirect karo
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    // Main container theme updated
    <div className="bg-[var(--color-background)] flex items-center justify-center py-12 px-4 min-h-[calc(100vh-160px)]">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        {/* Heading color updated */}
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--color-secondary)]">Welcome Back!</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1 text-slate-700">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              // Input focus ring updated
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" 
              required 
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700">Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" 
              required 
            />
          </div>
          {/* Submit button updated */}
          <button type="submit" className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-[var(--color-secondary)] font-bold transition-colors">
            Login
          </button>
        </form>
        <p className="text-center mt-6 text-slate-600">
          Don't have an account? 
          {/* Link color updated */}
          <Link to="/signup" className="text-[var(--color-primary)] hover:underline font-semibold"> Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;