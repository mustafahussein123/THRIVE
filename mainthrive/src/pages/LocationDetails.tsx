import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Heart,
  Home,
  Utensils,
  Car,
  Stethoscope,
  Lightbulb,
  Shield,
  GraduationCap,
  Briefcase,
  BarChart3,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Location as LocationType } from '../types';

const LocationDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const locationRoute = useLocation();
  // Use state passed via navigation or fallback to null
  const [locationData, setLocationData] = useState<LocationType | null>(
    locationRoute.state?.location || null
  );
  const [isLoading, setIsLoading] = useState(!locationRoute.state?.location);

  useEffect(() => {
    // If location data was not passed in state, fetch it from API (if implemented)
    if (!locationData && id) {
      // Example API call (adjust as needed)
      // ApiService.getLocationById(id).then(data => {
      //   setLocationData(data);
      //   setIsLoading(false);
      // }).catch(err => {
      //   console.error("Error fetching location:", err);
      //   setIsLoading(false);
      // });
      setIsLoading(false); // Remove if you add a real API call
    }
  }, [id, locationData]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Thrive - ${locationData?.city}, ${locationData?.state}`,
        text: `Check out ${locationData?.city}, ${locationData?.state} on Thrive.`,
        url: window.location.href,
      }).catch(error => console.error('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(error => console.error('Could not copy text: ', error));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!locationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Location data not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Safely determine the display name
  const displayName = 
    locationData.buildingName?.trim() ||
    locationData.addressStreet?.trim() ||
    `${locationData.city}, ${locationData.state}` ||
    "Unnamed Property";

  // Safely display affordabilityScore (if it's a number)
  const displayAffordability = 
    typeof locationData.affordabilityScore === 'number' 
      ? locationData.affordabilityScore.toFixed(1) 
      : "N/A";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {locationData.city}, {locationData.state}
            </h1>
            <button 
              onClick={handleShare}
              className="p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <MapPin className="w-5 h-5 mr-1 text-green-600" />
                {displayName}
              </h2>
              {locationData.address && (
                <p className="text-gray-500">{locationData.address}</p>
              )}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Affordability Score</p>
              <p className="text-xl font-bold text-green-600">
                {displayAffordability} / 100
              </p>
            </div>
          </div>
          {/* ...rest of your details such as cost breakdown, amenities, etc. */}
          <div className="mt-4">
            <p className="text-gray-700">
              {/* Additional details can be added here */}
              {/* For example, display cost breakdown with fallbacks */}
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            Go Back Home
          </button>
        </div>
      </main>
    </div>
  );
};

export default LocationDetails;
