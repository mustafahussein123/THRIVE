// src/pages/RentalRecommendations.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Users, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RentalCard from '../components/RentalCard';
import ApiService from '../services/ApiService';
import { computeDistance, LatLng } from '../utils/maps';
import { QuestionnaireResponse, ZillowRental } from '../types';

// Extend global window interface so TS knows about google
declare global {
  interface Window {
    google: any;
  }
}

const RentalRecommendations: React.FC = () => {
  const navigate = useNavigate();
  const locationState = useLocation().state as { formData: QuestionnaireResponse };
  const formData = locationState?.formData;
  
  const [isLoading, setIsLoading] = useState(true);
  const [rentals, setRentals] = useState<ZillowRental[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [targetCoordinate, setTargetCoordinate] = useState<LatLng | null>(null);

  // Dynamically geocode the user's city and state to get a target coordinate.
  useEffect(() => {
    if (!formData) {
      setError("No questionnaire data found. Please complete the questionnaire.");
      setIsLoading(false);
      return;
    }
    if (window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: `${formData.city}, ${formData.state}` }, (results: any, status: string) => {
        if (status === 'OK' && results && results.length > 0) {
          const loc = results[0].geometry.location;
          setTargetCoordinate({
            latitude: loc.lat(),
            longitude: loc.lng()
          });
        } else {
          console.error("Geocoding failed: " + status);
          setError("Failed to determine city coordinates.");
        }
      });
    } else {
      setError("Google Maps API is not loaded.");
    }
  }, [formData]);

  // Fetch rental data and compute distances once targetCoordinate is available.
  useEffect(() => {
    if (!formData || !targetCoordinate) return;
    const fetchRentals = async () => {
      try {
        setIsLoading(true);
        const rentalsData = await ApiService.getZillowRentals(formData.city, formData.state);
        
        const rentalsWithDistance = rentalsData.map(rental => ({
          ...rental,
          distance: computeDistance(targetCoordinate, rental.latLong)
        }));
        
        rentalsWithDistance.sort((a, b) => a.distance - b.distance);
        setRentals(rentalsWithDistance);
      } catch (err) {
        console.error('Error fetching rentals:', err);
        setError("Failed to fetch rentals. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRentals();
  }, [formData, targetCoordinate]);

  const getMonthlyBudget = () => {
    if (!formData) return 0;
    const monthlyIncome = formData.income / 12;
    if (formData.housing_budget_percentage === 'less-than-30') {
      return monthlyIncome * 0.3;
    } else if (formData.housing_budget_percentage === '30-40') {
      return monthlyIncome * 0.4;
    } else {
      return monthlyIncome * 0.5;
    }
  };

  const getBudgetData = () => {
    if (!rentals || rentals.length === 0) return [];
    const monthlyBudget = getMonthlyBudget();
    let totalRent = 0, count = 0;
    rentals.forEach(rental => {
      if (!rental.units || !rental.units.length) return;
      rental.units.forEach(unit => {
        const price = parseFloat(unit.price.replace(/[^0-9.]/g, ''));
        if (!isNaN(price)) {
          totalRent += price;
          count++;
        }
      });
    });
    const averageRent = count > 0 ? totalRent / count : 0;
    return [
      { name: 'Your Budget', value: monthlyBudget },
      { name: 'Average Rent', value: averageRent }
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-gray-600">Finding your perfect rentals...</p>
      </div>
    );
  }

  if (error || rentals.length === 0) {
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

  const monthlyBudget = getMonthlyBudget();

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
            <h1 className="text-2xl font-bold text-gray-800">Your Rental Recommendations</h1>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recommended Rentals</h2>
          <p className="text-gray-600">
            Sorted by proximity to the center of {formData.city}, {formData.state}.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentals.map(rental => (
            <RentalCard 
              key={rental.id} 
              rental={rental} 
              monthlyBudget={monthlyBudget} 
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/rental-questionnaire')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Adjust Your Preferences
          </button>
        </div>
      </main>
    </div>
  );
};

export default RentalRecommendations;
