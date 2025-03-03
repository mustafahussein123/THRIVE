import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, TrendingDown, Minus, DollarSign, Home, Briefcase, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Location } from '../types';

interface CurrentCityComparisonProps {
  currentCity: Location | null;
  targetCity: Location;
  onClose?: () => void;
}

const CurrentCityComparison: React.FC<CurrentCityComparisonProps> = ({ 
  currentCity, 
  targetCity,
  onClose
}) => {
  const [showComparison, setShowComparison] = useState(!!currentCity);
  const [expanded, setExpanded] = useState(false);
  
  useEffect(() => {
    setShowComparison(!!currentCity);
  }, [currentCity]);
  
  if (!showComparison || !currentCity) {
    return null;
  }
  
  // Calculate differences
  const calculateDifference = (targetValue: number, currentValue: number) => {
    return ((targetValue - currentValue) / currentValue) * 100;
  };
  
  const formatPercentage = (value: number) => {
    return `${Math.abs(Math.round(value))}%`;
  };
  
  // Affordability comparison
  const affordabilityDiff = calculateDifference(targetCity.affordabilityScore, currentCity.affordabilityScore);
  
  // Cost comparisons
  const housingDiff = calculateDifference(targetCity.costBreakdown.housing, currentCity.costBreakdown.housing);
  const foodDiff = calculateDifference(targetCity.costBreakdown.food, currentCity.costBreakdown.food);
  const transportationDiff = calculateDifference(targetCity.costBreakdown.transportation, currentCity.costBreakdown.transportation);
  const healthcareDiff = calculateDifference(targetCity.costBreakdown.healthcare, currentCity.costBreakdown.healthcare);
  const utilitiesDiff = calculateDifference(targetCity.costBreakdown.utilities, currentCity.costBreakdown.utilities);
  
  // Total monthly cost comparison
  const currentTotalCost = Object.values(currentCity.costBreakdown).reduce((a, b) => a + b, 0);
  const targetTotalCost = Object.values(targetCity.costBreakdown).reduce((a, b) => a + b, 0);
  const totalCostDiff = calculateDifference(targetTotalCost, currentTotalCost);
  
  // Quality of life comparisons
  const safetyDiff = calculateDifference(targetCity.qualityOfLife.safety, currentCity.qualityOfLife.safety);
  const educationDiff = calculateDifference(targetCity.qualityOfLife.education, currentCity.qualityOfLife.education);
  const healthcareDiffQoL = calculateDifference(targetCity.qualityOfLife.healthcare, currentCity.qualityOfLife.healthcare);
  
  // Job market comparisons
  const unemploymentDiff = calculateDifference(targetCity.jobMarket.unemployment, currentCity.jobMarket.unemployment);
  const incomeDiff = calculateDifference(targetCity.jobMarket.medianIncome, currentCity.jobMarket.medianIncome);
  const growthDiff = calculateDifference(targetCity.jobMarket.growthRate, currentCity.jobMarket.growthRate);
  
  // Helper function to determine if a difference is better, worse, or neutral
  const getDiffStatus = (diff: number, higherIsBetter = true) => {
    if (Math.abs(diff) < 2) return 'neutral'; // Less than 2% difference is considered neutral
    return (diff > 0 && higherIsBetter) || (diff < 0 && !higherIsBetter) ? 'better' : 'worse';
  };
  
  // For costs, lower is better (negative diff is better)
  const getStatusForCost = (diff: number) => getDiffStatus(diff, false);
  
  // For unemployment, lower is better (negative diff is better)
  const getStatusForUnemployment = (diff: number) => getDiffStatus(diff, false);
  
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6 border border-blue-100">
      <div className="bg-blue-50 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">
            Compared to {currentCity.city}, {currentCity.state}
          </h3>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="mr-2 text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-100"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Affordability Score Comparison */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Affordability Score</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-800">{targetCity.affordabilityScore}</span>
                <span className="text-gray-500 mx-2">vs</span>
                <span className="text-lg text-gray-600">{currentCity.affordabilityScore}</span>
              </div>
              <div className={`flex items-center ${
                getDiffStatus(affordabilityDiff) === 'better' ? 'text-green-600' : 
                getDiffStatus(affordabilityDiff) === 'worse' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {getDiffStatus(affordabilityDiff) === 'better' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : getDiffStatus(affordabilityDiff) === 'worse' ? (
                  <TrendingDown className="w-4 h-4 mr-1" />
                ) : (
                  <Minus className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">{formatPercentage(affordabilityDiff)}</span>
              </div>
            </div>
          </div>
          
          {/* Total Monthly Cost Comparison */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Total Monthly Cost</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-800">${targetTotalCost}</span>
                <span className="text-gray-500 mx-2">vs</span>
                <span className="text-lg text-gray-600">${currentTotalCost}</span>
              </div>
              <div className={`flex items-center ${
                getStatusForCost(totalCostDiff) === 'better' ? 'text-green-600' : 
                getStatusForCost(totalCostDiff) === 'worse' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {getStatusForCost(totalCostDiff) === 'better' ? (
                  <TrendingDown className="w-4 h-4 mr-1" />
                ) : getStatusForCost(totalCostDiff) === 'worse' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <Minus className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">{formatPercentage(totalCostDiff)}</span>
              </div>
            </div>
          </div>
          
          {/* Median Income Comparison */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Median Income</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-800">${targetCity.jobMarket.medianIncome.toLocaleString()}</span>
                <span className="text-gray-500 mx-2">vs</span>
                <span className="text-lg text-gray-600">${currentCity.jobMarket.medianIncome.toLocaleString()}</span>
              </div>
              <div className={`flex items-center ${
                getDiffStatus(incomeDiff) === 'better' ? 'text-green-600' : 
                getDiffStatus(incomeDiff) === 'worse' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {getDiffStatus(incomeDiff) === 'better' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : getDiffStatus(incomeDiff) === 'worse' ? (
                  <TrendingDown className="w-4 h-4 mr-1" />
                ) : (
                  <Minus className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">{formatPercentage(incomeDiff)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detailed Comparisons */}
        {expanded && (
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-800 mb-3">Detailed Comparison</h4>
            
            <div className="space-y-4">
              {/* Cost Breakdown Section */}
              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Cost Breakdown
                </h5>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Housing */}
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span className="text-gray-600">Housing</span>
                      <div className="flex items-center">
                        <span className="text-gray-800 font-medium mr-2">${targetCity.costBreakdown.housing}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          getStatusForCost(housingDiff) === 'better' ? 'bg-green-100 text-green-800' : 
                          getStatusForCost(housingDiff) === 'worse' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {housingDiff > 0 ? '+' : ''}{formatPercentage(housingDiff)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Food */}
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span className="text-gray-600">Food</span>
                      <div className="flex items-center">
                        <span className="text-gray-800 font-medium mr-2">${targetCity.costBreakdown.food}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          getStatusForCost(foodDiff) === 'better' ? 'bg-green-100 text-green-800' : 
                          getStatusForCost(foodDiff) === 'worse' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {foodDiff > 0 ? '+' : ''}{formatPercentage(foodDiff)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Transportation */}
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span className="text-gray-600">Transportation</span>
                      <div className="flex items-center">
                        <span className="text-gray-800 font-medium mr-2">${targetCity.costBreakdown.transportation}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          getStatusForCost(transportationDiff) === 'better' ? 'bg-green-100 text-green-800' : 
                          getStatusForCost(transportationDiff) === 'worse' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transportationDiff > 0 ? '+' : ''}{formatPercentage(transportationDiff)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Healthcare */}
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span className="text-gray-600">Healthcare</span>
                      <div className="flex items-center">
                        <span className="text-gray-800 font-medium mr-2">${targetCity.costBreakdown.healthcare}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          getStatusForCost(healthcareDiff) === 'better' ? 'bg-green-100 text-green-800' : 
                          getStatusForCost(healthcareDiff) === 'worse' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {healthcareDiff > 0 ? '+' : ''}{formatPercentage(healthcareDiff)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Utilities */}
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span className="text-gray-600">Utilities</span>
                      <div className="flex items-center">
                        <span className="text-gray-800 font-medium mr-2">${targetCity.costBreakdown.utilities}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          getStatusForCost(utilitiesDiff) === 'better' ? 'bg-green-100 text-green-800' : 
                          getStatusForCost(utilitiesDiff) === 'worse' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {utilitiesDiff > 0 ? '+' : ''}{formatPercentage(utilitiesDiff)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quality of Life Section */}
              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Quality of Life
                </h5>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Safety */}
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span className="text-gray-600">Safety</span>
                      <div className="flex items-center">
                        <span className="text-gray-800 font-medium mr-2">{targetCity.qualityOfLife.safety}%</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          getDiffStatus(safetyDiff) === 'better' ? 'bg-green-100 text-green-800' : 
                          getDiffStatus(safetyDiff) === 'worse' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {safetyDiff > 0 ? '+' : ''}{formatPercentage(safetyDiff)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Education */}
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span className="text-gray-600">Education</span>
                      <div className="flex items-center">
                        <span className="text-gray-800 font-medium mr-2">{targetCity.qualityOfLife.education}%</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          getDiffStatus(educationDiff) === 'better' ? 'bg-green-100 text-green-800' : 
                          getDiffStatus(educationDiff) === 'worse' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {educationDiff > 0 ? '+' : ''}{formatPercentage(educationDiff)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Healthcare */}
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span className="text-gray-600">Healthcare</span>
                      <div className="flex items-center">
                        <span className="text-gray-800 font-medium mr-2">{targetCity.qualityOfLife.healthcare}%</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          getDiffStatus(healthcareDiffQoL) === 'better' ? 'bg-green-100 text-green-800' : 
                          getDiffStatus(healthcareDiffQoL) === 'worse' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {healthcareDiffQoL > 0 ? '+' : ''}{formatPercentage(healthcareDiffQoL)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Job Market Section */}
              <div>
                <h5 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  Job Market
                </h5>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {/* Unemployment Rate */}
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span className="text-gray-600">Unemployment</span>
                      <div className="flex items-center">
                        <span className="text-gray-800 font-medium mr-2">{targetCity.jobMarket.unemployment}%</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          getStatusForUnemployment(unemploymentDiff) === 'better' ? 'bg-green-100 text-green-800' : 
                          getStatusForUnemployment(unemploymentDiff) === 'worse' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {unemploymentDiff > 0 ? '+' : ''}{formatPercentage(unemploymentDiff)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Job Growth Rate */}
                    <div className="flex justify-between items-center p-2 border-b border-gray-200">
                      <span className="text-gray-600">Job Growth</span>
                      <div className="flex items-center">
                        <span className="text-gray-800 font-medium mr-2">{targetCity.jobMarket.growthRate}%</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          getDiffStatus(growthDiff) === 'better' ? 'bg-green-100 text-green-800' : 
                          getDiffStatus(growthDiff) === 'worse' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {growthDiff > 0 ? '+' : ''}{formatPercentage(growthDiff)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!expanded && (
          <button 
            onClick={() => setExpanded(true)}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center w-full"
          >
            Show detailed comparison <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CurrentCityComparison;