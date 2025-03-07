import React from 'react';
import { MapPin, DollarSign, Briefcase, Heart, Star, Shield, GraduationCap } from 'lucide-react';
import { Location } from '../types';

interface LocationCardProps {
  location: Location;
  onViewDetails: (location: Location) => void;
  onSaveLocation?: (location: Location) => void;
  isSaved?: boolean;
}

const LocationCard: React.FC<LocationCardProps> = ({ 
  location, 
  onViewDetails, 
  onSaveLocation,
  isSaved = false
}) => {
  const totalCost = Object.values(location.costBreakdown).reduce((a, b) => a + b, 0);
  
  // Get color based on affordability score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-green-400';
    if (score >= 60) return 'bg-yellow-400';
    if (score >= 50) return 'bg-orange-400';
    return 'bg-red-400';
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <MapPin className="w-5 h-5 mr-1 text-green-600" />
              {location.city}, {location.state}
            </h3>
            <p className="text-gray-500 text-sm">{location.country}</p>
          </div>
          
          {onSaveLocation && (
            <button 
              onClick={() => onSaveLocation(location)}
              className={`text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full ${isSaved ? 'bg-red-50' : 'hover:bg-gray-100'}`}
              aria-label={isSaved ? "Remove from saved" : "Save location"}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          )}
        </div>
        
        <div className="mt-4 flex items-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-4 relative">
            <div className={`w-16 h-16 rounded-full ${getScoreColor(location.affordabilityScore)} opacity-20 absolute`}></div>
            <span className="text-xl font-bold text-gray-800">{location.affordabilityScore}</span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Affordability Score</p>
            <div className="flex mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= Math.round(location.affordabilityScore / 20) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-blue-500 mr-2" />
              <div>
                <p className="text-xs text-gray-600">Monthly Cost</p>
                <p className="font-semibold text-gray-800">${totalCost}/mo</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 text-purple-500 mr-2" />
              <div>
                <p className="text-xs text-gray-600">Job Growth</p>
                <p className="font-semibold text-gray-800">
                  {location.jobMarket.growthRate}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {location.qualityOfLife.safety >= 80 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
              <Shield className="w-3 h-3 mr-1" /> Safe
            </span>
          )}
          {location.qualityOfLife.education >= 80 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-50 text-purple-700">
              <GraduationCap className="w-3 h-3 mr-1" /> Great Schools
            </span>
          )}
          {location.jobMarket.medianIncome >= 70000 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">
              <DollarSign className="w-3 h-3 mr-1" /> High Income
            </span>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(location)}
            className="w-full py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;