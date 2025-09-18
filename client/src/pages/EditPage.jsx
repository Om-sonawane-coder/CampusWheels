import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

function EditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    vehicleName: '',
    price: '',
    year: '',
    kms: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        // URL ko theek kiya gaya hai
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles/${id}`);
        if (!response.ok) throw new Error('Could not load vehicle details.');
        const data = await response.json();
        setFormData({
          vehicleName: data.vehicleName,
          price: data.price,
          year: data.year,
          kms: data.kms,
          description: data.description,
        });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // URL ko theek kiya gaya hai
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update.');
      toast.success('Listing updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="text-center mt-10 text-[var(--color-secondary)]"><h2>Loading Editor...</h2></div>;

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full">
        {/* Heading color ko theek kiya gaya hai */}
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--color-secondary)]">Edit Your Vehicle</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="vehicleName" className="block font-semibold mb-1 text-slate-700">Vehicle Name</label>
            <input type="text" name="vehicleName" value={formData.vehicleName} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" required />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block font-semibold mb-1 text-slate-700">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" required />
            </div>
            <div>
              <label htmlFor="year" className="block font-semibold mb-1 text-slate-700">Model Year</label>
              <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" required />
            </div>
          </div>

          <div>
            <label htmlFor="kms" className="block font-semibold mb-1 text-slate-700">Kms Driven</label>
            <input type="number" name="kms" value={formData.kms} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" required />
          </div>

          <div>
            <label htmlFor="description" className="block font-semibold mb-1 text-slate-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" rows="3"></textarea>
          </div>

          {/* Submit button ko theek kiya gaya hai */}
          <button type="submit" className="w-full bg-[var(--color-accent)] text-white py-3 rounded-lg hover:opacity-90 font-bold transition-colors">
            Update Vehicle
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPage;