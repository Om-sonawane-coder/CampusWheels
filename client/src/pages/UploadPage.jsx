import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function UploadPage() {
  const [formData, setFormData] = useState({
    vehicleName: '',
    price: '',
    year: '',
    kms: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File is too large! Maximum size is 5MB.');
      e.target.value = null;
      setImageFile(null);
      return;
    }
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      toast.error('Please select an image to upload.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to upload a vehicle.');
      navigate('/login');
      return;
    }
    const uploadData = new FormData();
    for (const key in formData) {
      uploadData.append(key, formData[key]);
    }
    uploadData.append('image', imageFile);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles/upload`, {
        method: 'POST',
        headers: { 'x-auth-token': token },
        body: uploadData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Something went wrong');
      toast.success('Vehicle listed successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full">
        {/* Heading color updated */}
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--color-secondary)]">List Your Vehicle</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label htmlFor="vehicleName" className="block font-semibold mb-1 text-slate-700">Vehicle Name</label>
            <input type="text" name="vehicleName" value={formData.vehicleName} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder="e.g., Honda Activa 5G" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block font-semibold mb-1 text-slate-700">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder="e.g., 45000" required />
            </div>
            <div>
              <label htmlFor="year" className="block font-semibold mb-1 text-slate-700">Model Year</label>
              <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder="e.g., 2018" required />
            </div>
          </div>

          <div>
            <label htmlFor="kms" className="block font-semibold mb-1 text-slate-700">Kms Driven</label>
            <input type="number" name="kms" value={formData.kms} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" placeholder="e.g., 12000" required />
          </div>
          
          <div>
            <label className="block font-semibold mb-1 text-slate-700">Vehicle Image</label>
            <div className="flex items-center space-x-4">
              <label htmlFor="image-upload" className="cursor-pointer bg-[var(--color-secondary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--color-primary)] transition-colors">
                Select Image
              </label>
              <span className="text-gray-600">{imageFile ? imageFile.name : 'No file selected'}</span>
            </div>
            <input type="file" name="image" id="image-upload" onChange={handleFileChange} className="hidden" required />
          </div>

          <div>
            <label htmlFor="description" className="block font-semibold mb-1 text-slate-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]" rows="3" placeholder="Add any extra details..."></textarea>
          </div>

          {/* Submit button updated with CSS Variable */}
          <button type="submit" className="w-full bg-[var(--color-primary)] text-white py-3 rounded-lg hover:bg-[var(--color-secondary)] font-bold transition-colors">
            Submit Listing
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadPage;