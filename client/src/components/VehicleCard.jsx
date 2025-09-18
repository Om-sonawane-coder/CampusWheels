import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function VehicleCard({ vehicle, onDelete }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl">
      <Link to={`/vehicle/${vehicle._id}`}>
        <div className="relative">
          <img
            src={vehicle.imageUrl}
            alt={vehicle.vehicleName}
            className="w-full h-56 object-cover"
          />
          <div className="absolute top-2 right-2 bg-[var(--color-primary)] text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
            ₹ {new Intl.NumberFormat('en-IN').format(vehicle.price)}
          </div>
        </div>
      </Link>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 truncate" title={vehicle.vehicleName}>
          {vehicle.vehicleName}
        </h3>
        
        <div className="flex items-center text-slate-600 text-sm mt-3 space-x-4">
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.085a2 2 0 00-1.736.92L5.5 8m7 2H5.5" />
            </svg>
            <span>{new Intl.NumberFormat('en-IN').format(vehicle.kms)} kms</span>
          </div>
        </div>
      </div>
      
      <div className="px-5 pb-5 pt-2">
        {user && user.id === vehicle.owner ? (
          <div className="flex space-x-2">
            {/* Edit button color updated */}
            <Link to={`/edit/${vehicle._id}`} className="flex-1 text-center bg-[var(--color-accent)] text-white py-2 rounded-lg hover:opacity-90 font-bold text-sm transition-opacity">
              Edit
            </Link>
            <button 
              onClick={() => onDelete(vehicle._id)} 
              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-bold text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        ) : (
          <Link 
            to={`/vehicle/${vehicle._id}`} 
            className="block text-center w-full bg-[var(--color-primary)] text-white py-2 rounded-lg hover:bg-[var(--color-secondary)] font-bold text-sm transition-colors"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}

export default VehicleCard;