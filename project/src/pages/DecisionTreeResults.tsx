// src/pages/DecisionTreeResults.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Check, Star } from 'lucide-react';
import ApiService from '../services/ApiService';
import Pagination from '../components/Pagination';
import { ZillowRental } from '../types';

interface UserProfile {
  movingPurpose: string;
  monthlySalary: number;
  housingBudget: number;
  savings: number;
  transportationPreference: string;
  requiresHealthcare: boolean;
  amenities: string[];
}

interface RecommendedLocation extends ZillowRental {
  matchScore: number;
  keyFeatures: string[];
  costBreakdown?: {
    housing: number;
    food: number;
    transportation: number;
    healthcare: number;
    utilities: number;
  };
}

const DecisionTreeResults: React.FC = () => {
  const navigate = useNavigate();
  const locationRoute = useLocation();
  const userAnswers = locationRoute.state?.userAnswers || {};

  const [isLoading, setIsLoading] = useState(true);
  const [recommendedLocations, setRecommendedLocations] = useState<RecommendedLocation[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;

  useEffect(() => {
    const generateRecommendations = async () => {
      setIsLoading(true);
      try {
        // Process user answers into a profile
        const processedProfile = processUserAnswers(userAnswers);
        setUserProfile(processedProfile);
        const monthlyBudget = getMonthlyBudget();
        console.log("Calculated monthly housing budget:", monthlyBudget);

        // Fetch rentals from your local zillow_rentals.json (placed in public folder)
        const response = await fetch('/zillow_rentals.json');
        const allRentals: ZillowRental[] = await response.json();

        // Filter rentals to only include CA and TX
        const filteredByState = allRentals.filter(rental =>
          rental.addressState === 'CA' || rental.addressState === 'TX'
        );
        console.log("Total rentals after state filter:", filteredByState.length);

        // Filter rentals based on monthly budget
        const filteredRentals = filteredByState.filter(rental => {
          if (!rental.units || rental.units.length === 0) return false;
          let lowestPrice = Infinity;
          rental.units.forEach(unit => {
            const price = parseFloat(unit.price.replace(/[^0-9.]/g, ''));
            if (!isNaN(price) && price < lowestPrice) {
              lowestPrice = price;
            }
          });
          console.log(`Rental ${rental.id} - lowest price: ${lowestPrice}`);
          return lowestPrice <= monthlyBudget;
        });
        console.log("Rentals after filtering by monthly budget:", filteredRentals.length);

        if (filteredRentals.length === 0) {
          setRecommendedLocations([]);
        } else {
          // Calculate match score for each rental
          const recommendations: RecommendedLocation[] = filteredRentals.map(rental => {
            let lowestPrice = Infinity;
            rental.units.forEach(unit => {
              const price = parseFloat(unit.price.replace(/[^0-9.]/g, ''));
              if (!isNaN(price) && price < lowestPrice) {
                lowestPrice = price;
              }
            });
            const scoreDiff = Math.abs((monthlyBudget * 0.9) - lowestPrice);
            const matchScore = Math.max(0, 100 - scoreDiff / 10);
            return {
              ...rental,
              matchScore: Math.floor(matchScore),
              keyFeatures: rental.carouselPhotos ? ['Great photos'] : [],
              costBreakdown: rental.costBreakdown || {
                housing: lowestPrice,
                food: 0,
                transportation: 0,
                healthcare: 0,
                utilities: 0
              }
            };
          });
          const sortedRecommendations = recommendations.sort((a, b) => b.matchScore - a.matchScore);
          setRecommendedLocations(sortedRecommendations);
        }
      } catch (error) {
        console.error('Error generating recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateRecommendations();
  }, [userAnswers]);

  const processUserAnswers = (answers: any): UserProfile => {
    const housingBudgetFactor =
      answers.housingBudgetPercentage === 'less-than-30' ? 0.25 :
      answers.housingBudgetPercentage === '30-40' ? 0.35 : 0.45;

    return {
      movingPurpose: answers.movingPurpose === 'rent' ? 'Renting' : 'Buying',
      monthlySalary: Math.round(answers.incomeLevel / 12),
      housingBudget: Math.round((answers.incomeLevel * housingBudgetFactor) / 12),
      savings: answers.savingsAmount,
      transportationPreference:
        answers.transportationMethod === 'car' ? 'Car' :
        answers.transportationMethod === 'public-transit' ? 'Public Transit' : 'Walking/Biking',
      requiresHealthcare: answers.requiresHealthcare,
      amenities: processAmenities(answers)
    };
  };

  const processAmenities = (answers: any): string[] => {
    const amenities: string[] = [];
    if (answers.needsBikeLanes) amenities.push('Bike Lanes/Trails');
    if (answers.safetyImportance === 'very-important') amenities.push('Safe Neighborhoods');
    if (answers.entertainmentImportance === 'very-important') amenities.push('Entertainment Options');
    if (Array.isArray(answers.localAmenities)) {
      answers.localAmenities.forEach((amenity: string) => {
        switch (amenity) {
          case 'parks': amenities.push('Parks & Recreation'); break;
          case 'libraries': amenities.push('Libraries'); break;
          case 'gyms': amenities.push('Fitness Centers'); break;
          case 'shopping': amenities.push('Shopping Centers'); break;
          case 'restaurants': amenities.push('Dining Options'); break;
          case 'schools': amenities.push('Quality Schools'); break;
          case 'cultural': amenities.push('Cultural Venues'); break;
          default: break;
        }
      });
    }
    return amenities;
  };

  const getMonthlyBudget = () => {
    const monthlyIncome = Number(userAnswers.incomeLevel) / 12;
    if (userAnswers.housingBudgetPercentage === 'less-than-30') return monthlyIncome * 0.3;
    else if (userAnswers.housingBudgetPercentage === '30-40') return monthlyIncome * 0.4;
    else return monthlyIncome * 0.5;
  };

  const handleLocationPress = (location: RecommendedLocation) => {
    navigate(`/location/${location.id}`, { state: { location } });
  };

  const handleSaveProfile = () => {
    // Save the processed user profile for later use
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
    navigate('/');
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString();
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-600">Finding your perfect locations...</p>
        <p className="text-gray-500 mt-2">Our AI is analyzing your preferences</p>
      </div>
    );
  }

  if (!recommendedLocations.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">No recommendations found. Please try again.</p>
          <button
            onClick={() => navigate('/decision-tree')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(recommendedLocations.length / resultsPerPage);
  const currentResults = recommendedLocations.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4 text-gray-600 hover:text-green-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Your Perfect Matches</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <span key={index} className="bg-green-100 rounded-full px-3 py-1 m-1 text-green-700">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentResults.map(rental => (
            <div key={rental.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <MapPin className="w-5 h-5 mr-1 text-green-600" />
                      {rental.buildingName || rental.addressStreet || `${rental.city}, ${rental.state}`}
                    </h3>
                    {rental.address && <p className="text-gray-500">{rental.address}</p>}
                    {rental.latLong && (
                      <p className="text-xs text-gray-500">
                        Lat: {rental.latLong.latitude}, Lng: {rental.latLong.longitude}
                      </p>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Match Score</p>
                    <p className={`text-xl font-bold ${getScoreColor(rental.matchScore)}`}>
                      {rental.matchScore}%
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap mb-4">
                  {rental.keyFeatures.map((feature, index) => (
                    <span key={index} className="bg-gray-100 rounded-full px-2 py-1 mr-2 mb-1 text-xs text-gray-700">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 mt-2">
                  <p className="text-gray-700 font-semibold mb-2">Monthly Cost Breakdown:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <p className="text-gray-600">🏠 Housing: ${rental.costBreakdown?.housing ?? 'N/A'}</p>
                    <p className="text-gray-600">🍽️ Food: ${rental.costBreakdown?.food ?? 'N/A'}</p>
                    <p className="text-gray-600">🚗 Transport: ${rental.costBreakdown?.transportation ?? 'N/A'}</p>
                    <p className="text-gray-600">⚕️ Healthcare: ${rental.costBreakdown?.healthcare ?? 'N/A'}</p>
                  </div>
                </div>

                <button
                  className="mt-4 py-2 w-full bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  onClick={() => handleLocationPress(rental)}
                >
                  View Full Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </main>
    </div>
  );
};

export default DecisionTreeResults;
