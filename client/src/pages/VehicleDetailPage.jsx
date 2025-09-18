import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function VehicleDetailPage() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vehicles/${id}`);
        if (!response.ok) throw new Error('Vehicle not found');
        const data = await response.json();
        setVehicle(data);
      } catch (error) {
        console.error("Failed to fetch vehicle details", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  if (loading) return <h2 className="text-center mt-10 text-[var(--color-secondary)]">Loading Details...</h2>;
  if (!vehicle) return <h2 className="text-center mt-10 text-red-500">Vehicle Not Found</h2>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden md:flex">
        <div className="md:w-1/2">
            <img src={vehicle.imageUrl} alt={vehicle.vehicleName} className="w-full h-64 md:h-full object-cover" />
        </div>
        <div className="p-6 md:p-8 md:w-1/2 flex flex-col">
          {/* Heading color updated */}
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{vehicle.vehicleName}</h1>
          
          {/* Price color updated */}
          <p className="text-4xl font-bold text-[var(--color-primary)] mb-4">
            ₹ {new Intl.NumberFormat('en-IN').format(vehicle.price)}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-6 text-slate-600 border-t border-b border-slate-200 py-4">
            <div>
                <strong className="block text-sm text-slate-500">Model Year</strong>
                <span className="text-lg font-semibold text-slate-800">{vehicle.year}</span>
            </div>
            <div>
                <strong className="block text-sm text-slate-500">Kms Driven</strong>
                <span className="text-lg font-semibold text-slate-800">{new Intl.NumberFormat('en-IN').format(vehicle.kms)}</span>
            </div>
          </div>
          
          {/* Text colors updated */}
          <h2 className="text-xl font-semibold text-slate-800 mt-4 mb-2">Description</h2>
          <p className="text-slate-600 whitespace-pre-wrap flex-grow">{vehicle.description}</p>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetailPage;