import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Check, BarChart3 } from 'lucide-react';
import ComparisonTable from '../components/ComparisonTable';
import CurrentCityComparison from '../components/CurrentCityComparison';
import ApiService from '../services/ApiService';
import { Location } from '../types';

const CompareLocations: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialLocations = location.state?.savedLocations || [];
  
  const [selectedLocations, setSelectedLocations] = useState<Location[]>(
    // Default to selecting the first two locations if available
    initialLocations.length >= 2 
      ? [initialLocations[0], initialLocations[1]] 
      : initialLocations.slice(0, 1)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [allSavedLocations, setAllSavedLocations] = useState<Location[]>(initialLocations);
  const [currentCity, setCurrentCity] = useState<Location | null>(null);
  const [showCurrentCityComparison, setShowCurrentCityComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<Location | null>(null);

  // Load all saved locations from localStorage on component mount
  useEffect(() => {
    if (initialLocations.length === 0) {
      const saved = localStorage.getItem('savedLocations');
      if (saved) {
        const parsedLocations = JSON.parse(saved);
        setAllSavedLocations(parsedLocations);
        
        // Select first two by default if available
        setSelectedLocations(
          parsedLocations.length >= 2 
            ? [parsedLocations[0], parsedLocations[1]] 
            : parsedLocations.slice(0, 1)
        );
      }
    }
    
    // Check if user has a current city set
    const userCurrentCity = localStorage.getItem('currentCity');
    if (userCurrentCity) {
      try {
        const parsedCity = JSON.parse(userCurrentCity);
        setCurrentCity(parsedCity);
      } catch (error) {
        console.error('Error parsing current city:', error);
      }
    }
  }, [initialLocations]);

  const toggleLocationSelection = (location: Location) => {
    if (selectedLocations.some(loc => loc.id === location.id)) {
      // If already selected, remove it
      setSelectedLocations(selectedLocations.filter(loc => loc.id !== location.id));
    } else {
      // If not selected and we have less than 3 locations selected, add it
      if (selectedLocations.length < 3) {
        setSelectedLocations([...selectedLocations, location]);
      }
    }
  };
  
  const handleCompareWithCurrentCity = (location: Location) => {
    setSelectedForComparison(location);
    setShowCurrentCityComparison(true);
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
            <h1 className="text-2xl font-bold text-gray-800">Compare Locations</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {allSavedLocations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 mb-4">You don't have any saved locations to compare.</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Explore Locations
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Select up to 3 locations to compare</h2>
              
              <div className="flex flex-wrap gap-3">
                {allSavedLocations.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => toggleLocationSelection(loc)}
                    className={`flex items-center px-4 py-2 rounded-full border ${
                      selectedLocations.some(selected => selected.id === loc.id)
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-green-600'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {loc.name}
                    {selectedLocations.some(selected => selected.id === loc.id) && (
                      <Check className="w-4 h-4 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedLocations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <ComparisonTable locations={selectedLocations} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CompareLocations;