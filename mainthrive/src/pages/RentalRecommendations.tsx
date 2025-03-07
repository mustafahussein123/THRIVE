// src/pages/RentalRecommendations.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Users, ExternalLink, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RentalCard from '../components/RentalCard';
import ApiService from '../services/ApiService';
import Pagination from '../components/Pagination';
import { ZillowRental } from '../types';

interface RecommendationResponse {
  recommendations: ZillowRental[];
  affordability_score: number;
}

const RentalRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state as { formData: any };
  const formData = locationState?.formData;

  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<ZillowRental[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    if (!formData) {
      setError("No questionnaire data found. Please complete the questionnaire.");
      setIsLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const response: RecommendationResponse = await ApiService.submitQuestionnaire(formData);
        setRecommendations(response.recommendations);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError("Failed to fetch recommendations. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [formData]);

  // Example: Calculate monthly budget (adjust logic as needed)
  const getMonthlyBudget = () => {
    const monthlyIncome = formData.income / 12;
    if (formData.housing_budget_percentage === 'less-than-30') return monthlyIncome * 0.3;
    else if (formData.housing_budget_percentage === '30-40') return monthlyIncome * 0.4;
    else return monthlyIncome * 0.5;
  };

  const monthlyBudget = getMonthlyBudget();

  // Pagination calculations
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);
  const currentRecommendations = recommendations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleLocationPress = (rental: ZillowRental) => {
    navigate(`/location/${rental.id}`, { state: { location: rental } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-600">Finding your perfect rentals...</p>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || "No rental properties found matching your criteria."}</p>
          <button
            onClick={() => navigate('/rental-questionnaire')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Adjust Your Preferences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4 text-gray-600 hover:text-green-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Your Rental Recommendations</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recommended Rentals</h2>
          <p className="text-gray-600">Based on your preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRecommendations.map(rental => (
            <RentalCard
              key={rental.id}
              rental={rental}
              monthlyBudget={monthlyBudget}
              onPress={() => handleLocationPress(rental)}
            />
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

export default RentalRecommendations;
