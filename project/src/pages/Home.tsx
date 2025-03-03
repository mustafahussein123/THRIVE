import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, TrendingUp, BarChart3, Heart, Filter, Map, Home as HomeIcon, Briefcase } from 'lucide-react';
import LocationCard from '../components/LocationCard';
import ApiService from '../services/ApiService';
import { Location } from '../types';

// Mock data for initial render
const mockLocations: Location[] = [
  {
    id: '1',
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    latitude: 30.2672,
    longitude: -97.7431,
    affordabilityScore: 72,
    costBreakdown: {
      housing: 1500,
      food: 400,
      transportation: 200,
      healthcare: 300,
      utilities: 150
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
    }
  },
  {
    id: '2',
    city: 'Denver',
    state: 'CO',
    country: 'USA',
    latitude: 39.7392,
    longitude: -104.9903,
    affordabilityScore: 65,
    costBreakdown: {
      housing: 1700,
      food: 450,
      transportation: 180,
      healthcare: 320,
      utilities: 170
    },
    qualityOfLife: {
      safety: 75,
      education: 82,
      healthcare: 85,
      environment: 90
    },
    jobMarket: {
      unemployment: 3.8,
      medianIncome: 68000,
      growthRate: 2.8
    }
  },
  {
    id: '3',
    city: 'Raleigh',
    state: 'NC',
    country: 'USA',
    latitude: 35.7796,
    longitude: -78.6382,
    affordabilityScore: 78,
    costBreakdown: {
      housing: 1300,
      food: 380,
      transportation: 170,
      healthcare: 290,
      utilities: 140
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
    }
  },
  {
    id: '4',
    city: 'Sacramento',
    state: 'CA',
    country: 'USA',
    latitude: 38.5816,
    longitude: -121.4944,
    affordabilityScore: 68,
    costBreakdown: {
      housing: 1800,
      food: 450,
      transportation: 300,
      healthcare: 350,
      utilities: 180
    },
    qualityOfLife: {
      safety: 72,
      education: 75,
      healthcare: 78,
      environment: 80
    },
    jobMarket: {
      unemployment: 3.8,
      medianIncome: 68000,
      growthRate: 2.9
    }
  },
  {
    id: '5',
    city: 'Portland',
    state: 'OR',
    country: 'USA',
    latitude: 45.5152,
    longitude: -122.6784,
    affordabilityScore: 62,
    costBreakdown: {
      housing: 1950,
      food: 480,
      transportation: 250,
      healthcare: 370,
      utilities: 190
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
      growthRate: 2.9
    }
  }
];

// Recent searches mock data
const recentSearches = [
  { id: '1', city: 'Austin', state: 'TX' },
  { id: '2', city: 'Denver', state: 'CO' },
  { id: '3', city: 'Portland', state: 'OR' }
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>(mockLocations);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Load saved locations from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedLocations');
    if (saved) {
      setSavedLocations(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever savedLocations changes
  useEffect(() => {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
  }, [savedLocations]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      // In a real app, we would call the API
      // const results = await ApiService.searchCities({ query: searchQuery });
      // setLocations(results);
      
      // For demo purposes, we'll just filter the mock data
      const filtered = mockLocations.filter(
        location => location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   location.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setLocations(filtered.length ? filtered : mockLocations);
    } catch (error) {
      console.error('Search error:', error);
      // Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (location: Location) => {
    navigate(`/location/${location.id}`, { state: { location } });
  };

  const handleSaveLocation = (location: Location) => {
    if (savedLocations.some(loc => loc.id === location.id)) {
      // If already saved, remove it
      setSavedLocations(savedLocations.filter(loc => loc.id !== location.id));
    } else {
      // Otherwise add it
      setSavedLocations([...savedLocations, location]);
    }
  };

  const handleCompareLocations = () => {
    if (savedLocations.length < 1) {
      alert('Please save at least one location to compare');
      return;
    }
    navigate('/compare', { state: { savedLocations } });
  };

  const applyFilter = (filter: string) => {
    setIsLoading(true);
    
    // Toggle filter if already active
    if (activeFilter === filter) {
      setActiveFilter(null);
      setLocations(mockLocations);
      setIsLoading(false);
      return;
    }
    
    setActiveFilter(filter);
    
    // Apply the selected filter
    let filteredLocations = [...mockLocations];
    
    switch (filter) {
      case 'affordable':
        filteredLocations.sort((a, b) => b.affordabilityScore - a.affordabilityScore);
        break;
      case 'families':
        filteredLocations = filteredLocations.filter(loc => 
          loc.qualityOfLife.education >= 80 && loc.qualityOfLife.safety >= 75
        );
        break;
      case 'jobs':
        filteredLocations.sort((a, b) => b.jobMarket.growthRate - a.jobMarket.growthRate);
        break;
      default:
        break;
    }
    
    setLocations(filteredLocations);
    setIsLoading(false);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'cards' ? 'map' : 'cards');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-600">Thrive</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleViewMode}
                className="flex items-center text-gray-600 hover:text-green-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                aria-label={viewMode === 'cards' ? 'Switch to map view' : 'Switch to card view'}
              >
                {viewMode === 'cards' ? <Map className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => navigate('/saved')}
                className="flex items-center text-gray-600 hover:text-green-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                aria-label="Saved locations"
              >
                <Heart className="w-5 h-5" />
                {savedLocations.length > 0 && (
                  <span className="ml-1 text-xs bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {savedLocations.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold"
              >
                A
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Section */}
        <section className="mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Your Ideal Location</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search cities, states, or zip codes..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </div>
            
            {/* Quick Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button 
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
                  activeFilter === 'affordable' 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-transparent'
                } transition-colors duration-200`}
                onClick={() => applyFilter('affordable')}
              >
                <BarChart3 className="w-4 h-4 mr-1" />
                Most Affordable
              </button>
              <button 
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
                  activeFilter === 'families' 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-transparent'
                } transition-colors duration-200`}
                onClick={() => applyFilter('families')}
              >
                <HomeIcon className="w-4 h-4 mr-1" />
                Best for Families
              </button>
              <button 
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
                  activeFilter === 'jobs' 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-transparent'
                } transition-colors duration-200`}
                onClick={() => applyFilter('jobs')}
              >
                <Briefcase className="w-4 h-4 mr-1" />
                Top Job Markets
              </button>
            </div>
          </div>
        </section>

        {/* Recent Searches */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Searches</h2>
          <div className="flex overflow-x-auto pb-2 space-x-3 hide-scrollbar">
            {recentSearches.map(search => (
              <button
                key={search.id}
                className="flex-shrink-0 bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow duration-200"
                onClick={() => {
                  setSearchQuery(`${search.city}, ${search.state}`);
                  handleSearch();
                }}
              >
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-gray-800">{search.city}, {search.state}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Compare Button (if locations are saved) */}
        {savedLocations.length > 0 && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={handleCompareLocations}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
            >
              Compare {savedLocations.length} Saved Location{savedLocations.length !== 1 ? 's' : ''}
            </button>
          </div>
        )}

        {/* Locations Display */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recommended Locations</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{locations.length} locations</span>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : viewMode === 'map' ? (
            // Map View
            <div 
              ref={mapRef} 
              className="bg-white rounded-2xl shadow-md overflow-hidden h-[500px] mb-6"
            >
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Interactive map would be displayed here</p>
                {/* In a real implementation, this would be a Google Maps or Mapbox component */}
              </div>
              
              {/* Location pins would be rendered on the map */}
              <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 max-w-xs">
                <h3 className="font-medium text-gray-800 mb-2">Selected Location</h3>
                <p className="text-gray-600 text-sm mb-2">Click on a pin to see location details</p>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg text-sm">
                  View Details
                </button>
              </div>
            </div>
          ) : locations.length > 0 ? (
            // Card View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map(location => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onViewDetails={handleViewDetails}
                  onSaveLocation={handleSaveLocation}
                  isSaved={savedLocations.some(loc => loc.id === location.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center">
              <p className="text-gray-500">No locations found. Try adjusting your search criteria.</p>
            </div>
          )}
        </section>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 md:hidden">
        <div className="flex justify-around">
          <button className="flex flex-col items-center text-green-600">
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button 
            className="flex flex-col items-center text-gray-500"
            onClick={() => navigate('/saved')}
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs mt-1">Saved</span>
          </button>
          <button 
            className="flex flex-col items-center text-gray-500"
            onClick={() => navigate('/decision-tree')}
          >
            <Filter className="w-6 h-6" />
            <span className="text-xs mt-1">Find</span>
          </button>
          <button 
            className="flex flex-col items-center text-gray-500"
            onClick={() => navigate('/profile')}
          >
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
              A
            </div>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Home;