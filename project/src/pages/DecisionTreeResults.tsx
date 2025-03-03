import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Check, Star } from 'lucide-react';
import ApiService from '../services/ApiService';
import { Location } from '../types';

interface UserProfile {
  movingPurpose: string;
  monthlySalary: number;
  housingBudget: number;
  savings: number;
  transportationPreference: string;
  requiresHealthcare: boolean;
  amenities: string[];
}

interface RecommendedLocation extends Location {
  matchScore: number;
  keyFeatures: string[];
}

const DecisionTreeResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userAnswers = location.state?.userAnswers || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedLocations, setRecommendedLocations] = useState<RecommendedLocation[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Mock data for recommended locations
  const MOCK_LOCATIONS: RecommendedLocation[] = [
    {
      id: '1',
      city: 'Sacramento',
      state: 'CA',
      country: 'USA',
      latitude: 38.5816,
      longitude: -121.4944,
      matchScore: 92, // Calculated based on decision tree answers
      affordabilityScore: 78,
      costBreakdown: {
        housing: 1800,
        food: 450,
        transportation: 300,
        healthcare: 350,
        utilities: 180,
      },
      qualityOfLife: {
        safety: 82,
        education: 85,
        healthcare: 78,
        environment: 80
      },
      jobMarket: {
        unemployment: 3.8,
        medianIncome: 68000,
        growthRate: 2.9
      },
      keyFeatures: ['Bike-friendly', 'Good healthcare', 'Parks nearby']
    },
    {
      id: '2',
      city: 'Portland',
      state: 'OR',
      country: 'USA',
      latitude: 45.5152,
      longitude: -122.6784,
      matchScore: 88,
      affordabilityScore: 71,
      costBreakdown: {
        housing: 1950,
        food: 480,
        transportation: 250,
        healthcare: 370,
        utilities: 190,
      },
      qualityOfLife: {
        safety: 75,
        education: 82,
        healthcare: 85,
        environment: 90
      },
      jobMarket: {
        unemployment: 4.1,
        medianIncome: 70000,
        growthRate: 3.1
      },
      keyFeatures: ['Great public transit', 'Cultural venues', 'Parks']
    },
    {
      id: '3',
      city: 'Raleigh',
      state: 'NC',
      country: 'USA',
      latitude: 35.7796,
      longitude: -78.6382,
      matchScore: 87,
      affordabilityScore: 83,
      costBreakdown: {
        housing: 1600,
        food: 420,
        transportation: 280,
        healthcare: 330,
        utilities: 170,
      },
      qualityOfLife: {
        safety: 82,
        education: 88,
        healthcare: 80,
        environment: 85
      },
      jobMarket: {
        unemployment: 3.2,
        medianIncome: 65000,
        growthRate: 3.5
      },
      keyFeatures: ['Good schools', 'Job opportunities', 'Low crime rate']
    },
    {
      id: '4',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      latitude: 30.2672,
      longitude: -97.7431,
      matchScore: 85,
      affordabilityScore: 76,
      costBreakdown: {
        housing: 1750,
        food: 430,
        transportation: 290,
        healthcare: 340,
        utilities: 160,
      },
      qualityOfLife: {
        safety: 80,
        education: 85,
        healthcare: 82,
        environment: 78
      },
      jobMarket: {
        unemployment: 3.5,
        medianIncome: 72000,
        growthRate: 3.2
      },
      keyFeatures: ['Entertainment options', 'Job market', 'Cultural scene']
    },
  ];
  
  useEffect(() => {
    // In a real app, this would use the decision tree answers to calculate recommendations
    const generateRecommendations = async () => {
      setIsLoading(true);
      
      try {
        // Process user's decision tree answers
        const processedProfile = processUserAnswers(userAnswers);
        setUserProfile(processedProfile);
        
        // Search for cities based on user criteria using the API
        const searchCriteria = {
          // Convert user answers into search parameters
          // These parameters would be adjusted based on the actual API requirements
          housing_budget: processedProfile.housingBudget,
          transportation: processedProfile.transportationPreference === 'Public Transit' ? 'public_transit' : 
                          processedProfile.transportationPreference === 'Walking/Biking' ? 'walkable' : 'car',
          healthcare: processedProfile.requiresHealthcare ? 'true' : 'false',
          safety: userAnswers.safetyImportance === 'very-important' ? 'high' : 
                 userAnswers.safetyImportance === 'somewhat-important' ? 'medium' : 'low'
        };
        
        try {
          // Call the API to get city recommendations
          // const apiResults = await ApiService.searchCities(searchCriteria);
          
          // Process API results and generate location recommendations
          // For now, we'll use the mock data but in a real implementation
          // we would map the API results to our location format
          const filteredLocations = MOCK_LOCATIONS.sort((a, b) => b.matchScore - a.matchScore);
          setRecommendedLocations(filteredLocations);
        } catch (apiError) {
          console.error('API Error:', apiError);
          // Fallback to mock data if API fails
          const filteredLocations = MOCK_LOCATIONS.sort((a, b) => b.matchScore - a.matchScore);
          setRecommendedLocations(filteredLocations);
        }
      } catch (error) {
        console.error('Error generating recommendations:', error);
        // Fallback to mock data
        const processedProfile = processUserAnswers(userAnswers);
        setUserProfile(processedProfile);
        const filteredLocations = MOCK_LOCATIONS.sort((a, b) => b.matchScore - a.matchScore);
        setRecommendedLocations(filteredLocations);
      } finally {
        setIsLoading(false);
      }
    };
    
    generateRecommendations();
  }, [userAnswers]);
  
  // Process user answers into a profile summary
  const processUserAnswers = (answers: any): UserProfile => {
    // In a real app, this would be more sophisticated
    const housingBudget = answers.incomeLevel * (
      answers.housingBudgetPercentage === 'less-than-30' ? 0.25 :
      answers.housingBudgetPercentage === '30-40' ? 0.35 :
      0.45 // 40% or more
    );
    
    return {
      movingPurpose: answers.movingPurpose === 'rent' ? 'Renting' : 'Buying',
      monthlySalary: Math.round(answers.incomeLevel / 12),
      housingBudget: Math.round(housingBudget / 12),
      savings: answers.savingsAmount,
      transportationPreference: 
        answers.transportationMethod === 'car' ? 'Car' :
        answers.transportationMethod === 'public-transit' ? 'Public Transit' :
        'Walking/Biking',
      requiresHealthcare: answers.requiresHealthcare,
      amenities: processAmenities(answers)
    };
  };
  
  // Process amenities into human-readable format
  const processAmenities = (answers: any): string[] => {
    const amenities: string[] = [];
    
    if (answers.needsBikeLanes) {
      amenities.push('Bike Lanes/Trails');
    }
    
    if (answers.safetyImportance === 'very-important') {
      amenities.push('Safe Neighborhoods');
    }
    
    if (answers.entertainmentImportance === 'very-important') {
      amenities.push('Entertainment Options');
    }
    
    // Add selected local amenities
    if (Array.isArray(answers.localAmenities)) {
      answers.localAmenities.forEach((amenity: string) => {
        switch(amenity) {
          case 'parks':
            amenities.push('Parks & Recreation');
            break;
          case 'libraries':
            amenities.push('Libraries');
            break;
          case 'gyms':
            amenities.push('Fitness Centers');
            break;
          case 'shopping':
            amenities.push('Shopping Centers');
            break;
          case 'restaurants':
            amenities.push('Dining Options');
            break;
          case 'schools':
            amenities.push('Quality Schools');
            break;
          case 'cultural':
            amenities.push('Cultural Venues');
            break;
        }
      });
    }
    
    return amenities;
  };
  
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };
  
  const formatCurrency = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  const handleLocationPress = (location: RecommendedLocation) => {
    navigate(`/location/${location.id}`, { state: { location } });
  };
  
  const handleSaveProfile = () => {
    // Save user profile to localStorage
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 hover:text-green-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Your Perfect Matches</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-600">Finding your perfect locations...</p>
            <p className="mt-2 text-gray-500">Our AI is analyzing your preferences</p>
          </div>
        ) : (
          <>
            {userProfile && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Your Preference Profile</h2>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <p className="text-gray-600">Looking to</p>
                    <p className="font-semibold">{userProfile.movingPurpose}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Monthly Income</p>
                    <p className="font-semibold">${formatCurrency(userProfile.monthlySalary)}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Housing Budget</p>
                    <p className="font-semibold">${formatCurrency(userProfile.housingBudget)}/mo</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Transportation</p>
                    <p className="font-semibold">{userProfile.transportationPreference}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-gray-600">Healthcare Important</p>
                    <p className="font-semibold">{userProfile.requiresHealthcare ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Your Must-Have Amenities</h3>
                <div className="flex flex-wrap">
                  {userProfile.amenities.map((amenity, index) => (
                    <span 
                      key={index} 
                      className="bg-green-100 rounded-full px-3 py-1 m-1 text-green-700"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                
                <button
                  className="mt-4 py-3 w-full bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  onClick={handleSaveProfile}
                >
                  Save This Profile
                </button>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recommended Locations</h2>
              <p className="text-gray-600">Based on your preferences</p>
            </div>
            
            <div className="space-y-6">
              {recommendedLocations.map(location => (
                <div
                  key={location.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                          <MapPin className="w-5 h-5 mr-1 text-green-600" />
                          {location.city}, {location.state}
                        </h3>
                        <p className="text-gray-500">{location.country}</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Match Score</p>
                        <p className={`text-xl font-bold ${getScoreColor(location.matchScore)}`}>
                          {location.matchScore}%
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap mb-4">
                      {location.keyFeatures.map((feature, index) => (
                        <span key={index} className="bg-gray-100 rounded-full px-2 py-1 mr-2 mb-1 text-xs text-gray-700">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mt-2">
                      <p className="text-gray-700 font-semibold mb-2">Monthly Cost Breakdown:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-gray-600">🏠 Housing: ${location.costBreakdown.housing}</p>
                        <p className="text-gray-600">🍽️ Food: ${location.costBreakdown.food}</p>
                        <p className="text-gray-600">🚗 Transport: ${location.costBreakdown.transportation}</p>
                        <p className="text-gray-600">⚕️ Healthcare: ${location.costBreakdown.healthcare}</p>
                      </div>
                    </div>
                    
                    <button 
                      className="mt-4 py-2 w-full bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      onClick={() => handleLocationPress(location)}
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DecisionTreeResults;