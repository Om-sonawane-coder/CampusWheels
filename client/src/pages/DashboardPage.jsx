import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import VehicleCard from '../components/VehicleCard';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import SkeletonCard from '../components/SkeletonCard';

function DashboardPage() {
  const [myVehicles, setMyVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyVehicles = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:3000/api/vehicles/my-listings', {
          headers: { 'x-auth-token': token },
        });
        if (!response.ok) throw new Error('Failed to fetch your listings.');
        const data = await response.json();
        setMyVehicles(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMyVehicles();
  }, [token]);

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      const response = await fetch(`http://localhost:3000/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) throw new Error('Failed to delete.');
      setMyVehicles(currentVehicles => currentVehicles.filter(v => v._id !== vehicleId));
      toast.success('Listing deleted successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-[var(--color-secondary)] mb-6">My Listings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Heading color updated */}
      <h1 className="text-3xl font-bold text-[var(--color-secondary)] mb-6">My Listings</h1>
      
      {myVehicles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-slate-600">You have not listed any vehicles yet.</p>
            {/* Link color updated */}
            <Link to="/upload" className="text-[var(--color-primary)] hover:underline font-semibold mt-2 inline-block">
                Upload one now!
            </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myVehicles.map(vehicle => (
            <VehicleCard
              key={vehicle._id}
              vehicle={vehicle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;