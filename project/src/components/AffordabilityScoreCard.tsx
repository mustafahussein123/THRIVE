import React, { useState, useEffect } from 'react';
import { Info, TrendingUp } from 'lucide-react';
import MLService from '../services/MLService';

interface AffordabilityScoreCardProps {
  locationId: string | number;
  affordabilityScore: number;
}

const AffordabilityScoreCard: React.FC<AffordabilityScoreCardProps> = ({ 
  locationId, 
  affordabilityScore: initialScore 
}) => {
  const [affordabilityScore, setAffordabilityScore] = useState(initialScore);
  const [affordabilityCategory, setAffordabilityCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  
  useEffect(() => {
    // If we have ML capabilities, get a more accurate prediction
    const getPrediction = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const result = await MLService.getAffordabilityPrediction(Number(locationId));
        
        if (result && result.affordability_score) {
          setAffordabilityScore(result.affordability_score);
          setAffordabilityCategory(result.affordability_category);
        }
      } catch (err) {
        console.error('Error getting affordability prediction:', err);
        setError('Could not get ML prediction. Using default score.');
        // Keep using the initial score
      } finally {
        setIsLoading(false);
      }
    };
    
    getPrediction();
  }, [locationId, initialScore]);
  
  const getScoreDescription = () => {
    if (affordabilityCategory) {
      switch (affordabilityCategory) {
        case 'excellent':
          return 'Excellent affordability compared to similar cities';
        case 'good':
          return 'Good affordability for most income levels';
        case 'moderate':
          return 'Moderate affordability, may be challenging for some';
        case 'poor':
          return 'Lower affordability, higher cost of living area';
        case 'very poor':
          return 'Very low affordability, high cost of living area';
        default:
          return '';
      }
    } else {
      // Fallback based on score
      if (affordabilityScore >= 80) {
        return 'Excellent affordability compared to similar cities';
      } else if (affordabilityScore >= 60) {
        return 'Good affordability for most income levels';
      } else if (affordabilityScore >= 40) {
        return 'Moderate affordability, may be challenging for some';
      } else {
        return 'Lower affordability, higher cost of living area';
      }
    }
  };
  
  // Get color based on score
  const getScoreColor = () => {
    if (affordabilityScore >= 80) return 'text-green-600';
    if (affordabilityScore >= 70) return 'text-green-500';
    if (affordabilityScore >= 60) return 'text-yellow-500';
    if (affordabilityScore >= 50) return 'text-orange-500';
    return 'text-red-500';
  };
  
  // Get background color for the circular progress
  const getScoreBackgroundColor = () => {
    if (affordabilityScore >= 80) return 'bg-green-600';
    if (affordabilityScore >= 70) return 'bg-green-500';
    if (affordabilityScore >= 60) return 'bg-yellow-500';
    if (affordabilityScore >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Affordability Score</h2>
        <div className="relative">
          <button 
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Info className="w-5 h-5" />
          </button>
          
          {showTooltip && (
            <div className="absolute right-0 w-64 p-3 mt-2 text-sm bg-gray-800 text-white rounded-xl shadow-lg z-10">
              This score is calculated using our AI model that analyzes cost of living factors and compares them to national averages.
              {isLoading && <p className="mt-1 text-gray-300">Updating with ML prediction...</p>}
              {error && <p className="mt-1 text-red-300">{error}</p>}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          {/* Background circle */}
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
              strokeDasharray="100, 100"
              className="drop-shadow"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={getScoreBackgroundColor()}
              strokeWidth="3"
              strokeDasharray={`${affordabilityScore}, 100`}
              className="drop-shadow"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            {isLoading ? (
              <div className="animate-pulse">
                <span className="text-3xl font-bold text-gray-400">...</span>
              </div>
            ) : (
              <>
                <span className={`text-4xl font-bold ${getScoreColor()}`}>{Math.round(affordabilityScore)}</span>
                <span className="text-sm text-gray-500">out of 100</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 mb-3">
          {getScoreDescription()}
        </p>
        
        {affordabilityCategory && (
          <div className="mt-2">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
              affordabilityCategory === 'excellent' ? 'bg-green-100 text-green-800' :
              affordabilityCategory === 'good' ? 'bg-blue-100 text-blue-800' :
              affordabilityCategory === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
              affordabilityCategory === 'poor' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {affordabilityCategory.charAt(0).toUpperCase() + affordabilityCategory.slice(1)}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-gray-600">Trending</span>
          </div>
          <span className="text-sm font-medium text-green-600">+2.4% this month</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Affordability is improving in this area compared to national averages
        </div>
      </div>
    </div>
  );
};

export default AffordabilityScoreCard;