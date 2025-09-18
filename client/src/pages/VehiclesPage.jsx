import React, { useState, useEffect, useContext } from 'react';
import VehicleCard from '../components/VehicleCard';
import { AuthContext } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';
import toast from 'react-hot-toast';
import SkeletonCard from '../components/SkeletonCard';

function VehiclesPage() {
  // Common States
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, user } = useContext(AuthContext); // 'user' ko context se lo

  // Search States
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Main data fetching effect
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/api/vehicles?search=${debouncedSearchTerm}&page=${currentPage}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setVehicles(data.vehicles);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [debouncedSearchTerm, currentPage]);

  // Effect to reset page to 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.msg || 'Failed to delete.');
      }
      setVehicles(currentVehicles => currentVehicles.filter(v => v._id !== vehicleId));
      toast.success('Listing deleted successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  // NAYA LOGIC: Logged-in user ki apni listings ko filter karke hata do
  const vehiclesToShow = user
    ? vehicles.filter(vehicle => vehicle.owner !== user.id)
    : vehicles;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl text-center font-bold text-[var(--color-secondary)] mb-4">Available Vehicles</h2>
      
      <div className="mb-6">
        <input 
          type="text"
          placeholder="Search for a vehicle by name..."
          className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center mt-10 text-red-500"><h2>Error: {error}</h2></div>
      ) : vehiclesToShow.length === 0 ? ( // 'vehicles' ki jagah 'vehiclesToShow' use karo
        <p className="text-center text-slate-600">No other vehicles available to show.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 'vehicles' ki jagah 'vehiclesToShow' use karo */}
            {vehiclesToShow.map(vehicle => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[var(--color-secondary)] transition-colors"
              >
                Previous
              </button>
              <span className="font-semibold text-[var(--color-secondary)]">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-[var(--color-secondary)] transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default VehiclesPage;