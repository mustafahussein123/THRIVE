import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  BarChart3, 
  Heart, 
  Map, 
  Home as HomeIcon, 
  Briefcase 
} from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://source.unsplash.com/1600x900/?city,architecture')" }}>
      {/* Overlay */}
      <div className="min-h-screen bg-black bg-opacity-40">
        {/* Header */}
        <header className="bg-transparent sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">Thrive</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/map-view')}
                aria-label="Switch to map view"
                className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 transition"
              >
                <Map className="w-6 h-6" />
              </button>
              <button 
                onClick={() => navigate('/saved')}
                aria-label="Saved locations"
                className="p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 transition"
              >
                <Heart className="w-6 h-6" />
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold transition hover:bg-green-200"
              >
                A
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-16">
          {/* Hero Section */}
          <section className="bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Find Your Ideal Location</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-6 h-6 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search cities, states, or zip codes..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              </div>
              <button
                className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition"
              >
                Search
              </button>
            </div>
            {/* Quick Filters */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                className="flex items-center px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Most Affordable
              </button>
              <button 
                className="flex items-center px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                <HomeIcon className="w-5 h-5 mr-2" />
                Best for Families
              </button>
              <button 
                className="flex items-center px-4 py-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Top Job Markets
              </button>
            </div>
            {/* Rental Questionnaire Button */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <button
                onClick={() => navigate('/rental-questionnaire')}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Find Rental Properties with Our Questionnaire
              </button>
            </div>
          </section>

          {/* Welcome Section */}
          <section className="bg-white bg-opacity-90 rounded-lg shadow-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Thrive</h2>
            <p className="text-xl text-gray-700 mb-8">
              Your personalized relocation assistant. Discover affordable places to live based on your preferences and financial situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => navigate('/onboarding')}
                className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate('/decision-tree')}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Use Decision Tree
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
