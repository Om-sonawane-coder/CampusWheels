import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.msg || 'Something went wrong');
      
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    }
  };

  return (
    // Main container theme updated
    <div className="bg-[var(--color-background)] flex items-center justify-center py-12 px-4 min-h-[calc(100vh-160px)]">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        {/* Heading color updated */}
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--color-secondary)]">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1 text-slate-700">Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              // Input focus ring updated
              className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" 
              required 
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-slate-700">Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
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
            Signup
          </button>
        </form>
        <p className="text-center mt-6 text-slate-600">
          Already have an account? 
          {/* Link color updated */}
          <Link to="/login" className="text-[var(--color-primary)] hover:underline font-semibold"> Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;