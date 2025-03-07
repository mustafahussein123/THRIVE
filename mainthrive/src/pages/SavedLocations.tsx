import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, BarChart3 } from 'lucide-react';
import LocationCard from '../components/LocationCard';
import { Location } from '../types';

const SavedLocations: React.FC = () => {
  const navigate = useNavigate();
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  
  // Load saved locations from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedLocations');
    if (saved) {
      setSavedLocations(JSON.parse(saved));
    }
  }, []);
  
  // Save to localStorage whenever savedLocations changes
  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
  }, [savedLocations]);
  
  const handleViewDetails = (location: Location) => {
    navigate(`/location/${location.id}`, { state: { location } });
  };
  
  const handleRemoveLocation = (location: Location) => {
    setSavedLocations(savedLocations.filter(loc => loc.id !== location.id));
  };
  
  const handleCompareLocations = () => {
    if (savedLocations.length < 1) {
      alert('Please save at least one location to compare');
      return;
    }
    navigate('/compare', { state: { savedLocations } });
  };
  
  const handleClearAll = () => {
    if (confirm('Are you sure you want to remove all saved locations?')) {
      setSavedLocations([]);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 hover:text-green-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Saved Locations</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {savedLocations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't saved any locations yet.</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Explore Locations
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Saved Locations ({savedLocations.length})
              </h2>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCompareLocations}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Compare
                </button>
                
                <button
                  onClick={handleClearAll}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedLocations.map(location => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onViewDetails={handleViewDetails}
                  onSaveLocation={handleRemoveLocation}
                  isSaved={true}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SavedLocations;