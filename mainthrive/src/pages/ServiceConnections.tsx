import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, ChevronRight } from 'lucide-react';
import ApiService from '../services/ApiService';

// Mock service data
const SERVICE_CATEGORIES = [
  {
    id: 'all',
    title: 'All Services',
    icon: 'apps',
  },
  {
    id: 'housing',
    title: 'Housing',
    icon: 'home',
    color: '#4CAF50',
    services: [
      { 
        id: 'h1',
        name: 'Apartments.com', 
        description: 'Find apartments, houses, and condos for rent',
        link: 'https://www.apartments.com',
        isPartner: true,
        iconName: 'home-city-outline'
      },
      { 
        id: 'h2',
        name: 'Zillow', 
        description: 'Find homes for sale and rent, home values and more',
        link: 'https://www.zillow.com',
        isPartner: true,
        iconName: 'home-outline'
      },
      { 
        id: 'h3',
        name: 'Redfin', 
        description: 'Search for homes and connect with local agents',
        link: 'https://www.redfin.com',
        isPartner: false,
        iconName: 'home-search-outline'
      },
      { 
        id: 'h4',
        name: 'Local Housing Authority', 
        description: 'Housing assistance programs and information',
        link: 'https://example.com',
        isPartner: false,
        iconName: 'office-building-outline'
      },
    ]
  },
  {
    id: 'utilities',
    title: 'Utilities',
    icon: 'flash',
    color: '#FF9800',
    services: [
      { 
        id: 'u1',
        name: 'Connect Utilities', 
        description: 'Set up all utilities in one place for your new home',
        link: 'https://example.com',
        isPartner: true,
        iconName: 'lightning-bolt-outline'
      },
      { 
        id: 'u2',
        name: 'Internet Service Finder', 
        description: 'Compare internet providers in your area',
        link: 'https://example.com',
        isPartner: true,
        iconName: 'wifi'
      },
      { 
        id: 'u3',
        name: 'Water Services', 
        description: 'Find local water utility providers',
        link: 'https://example.com',
        isPartner: false,
        iconName: 'water-outline'
      },
      { 
        id: 'u4',
        name: 'Garbage & Recycling', 
        description: 'Connect with local waste management services',
        link: 'https://example.com',
        isPartner: false,
        iconName: 'recycle'
      },
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    icon: 'medical-bag',
    color: '#2196F3',
    services: [
      { 
        id: 'm1',
        name: 'Healthcare.gov', 
        description: 'Find health insurance coverage options',
        link: 'https://www.healthcare.gov',
        isPartner: true,
        iconName: 'shield-plus-outline'
      },
      { 
        id: 'm2',
        name: 'Provider Finder', 
        description: 'Find doctors and healthcare providers in your area',
        link: 'https://example.com',
        isPartner: true,
        iconName: 'doctor'
      },
      { 
        id: 'm3',
        name: 'Pharmacy Locator', 
        description: 'Find pharmacies and compare prescription prices',
        link: 'https://example.com',
        isPartner: false,
        iconName: 'pharmacy'
      },
      { 
        id: 'm4',
        name: 'Mental Health Resources', 
        description: 'Find mental health support and counseling services',
        link: 'https://example.com',
        isPartner: false,
        iconName: 'brain'
      },
    ]
  },
  {
    id: 'transportation',
    title: 'Transportation',
    icon: 'car',
    color: '#673AB7',
    services: [
      { 
        id: 't1',
        name: 'Public Transit Info', 
        description: 'Find local public transportation options',
        link: 'https://example.com',
        isPartner: true,
        iconName: 'bus'
      },
      { 
        id: 't2',
        name: 'Moving Services', 
        description: 'Compare moving companies and get quotes',
        link: 'https://example.com',
        isPartner: true,
        iconName: 'truck'
      },
      { 
        id: 't3',
        name: 'Bike Share Programs', 
        description: 'Find bike sharing options in your area',
        link: 'https://example.com',
        isPartner: false,
        iconName: 'bike'
      },
    ]
  },
];

const ServiceConnections: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    city: 'Sacramento',
    state: 'CA',
    coordinates: {
      latitude: 38.5816,
      longitude: -121.4944
    }
  });
  
  // State to hold service providers from APIs
  const [healthcareProviders, setHealthcareProviders] = useState<any[]>([]);
  const [serviceCategories, setServiceCategories] = useState(SERVICE_CATEGORIES);
  
  useEffect(() => {
    // Fetch healthcare providers using the API
    const fetchHealthcareProviders = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getHealthcareFacilities(
          currentLocation.coordinates.latitude,
          currentLocation.coordinates.longitude,
          5000 // 5 km radius
        );
        
        if (response && response.results) {
          const formattedProviders = response.results.map((provider: any) => ({
            id: provider.place_id,
            name: provider.name,
            description: `${provider.vicinity} • ${provider.rating ? provider.rating + '★' : 'No rating'}`,
            link: `https://www.google.com/maps/place/?q=place_id:${provider.place_id}`,
            isPartner: Math.random() > 0.7, // Random for demo purposes
            iconName: 'hospital-building'
          }));
          
          setHealthcareProviders(formattedProviders);
          
          // Update the SERVICE_CATEGORIES with real healthcare providers
          const updatedCategories = [...serviceCategories];
          const healthcareIndex = updatedCategories.findIndex(cat => cat.id === 'healthcare');
          
          if (healthcareIndex !== -1 && formattedProviders.length > 0) {
            updatedCategories[healthcareIndex].services = formattedProviders;
            setServiceCategories(updatedCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching healthcare providers:', error);
        // Continue with mock data
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHealthcareProviders();
  }, [currentLocation]);

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  // Filter services based on search query and selected category
  const getFilteredServices = () => {
    let filteredCategories = [...serviceCategories];
    
    // Filter by category if not 'all'
    if (selectedCategory !== 'all') {
      filteredCategories = filteredCategories.filter(category => category.id === selectedCategory);
    }
    
    // If there's a search query, filter services within categories
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      // Map through categories and filter their services
      filteredCategories = filteredCategories.map(category => {
        if (!category.services) return category;
        
        const filteredServices = category.services.filter(service => 
          service.name.toLowerCase().includes(query) || 
          service.description.toLowerCase().includes(query)
        );
        
        // Return category with filtered services
        return {
          ...category,
          services: filteredServices
        };
      }).filter(category => category.services && category.services.length > 0); // Only keep categories with matching services
    }
    
    return filteredCategories.filter(cat => cat.id !== 'all');
  };

  const filteredServices = getFilteredServices();
  
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
            <h1 className="text-2xl font-bold text-gray-800">Service Connections</h1>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-white shadow-sm">
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800 text-lg">Services for</h2>
            <div className="flex items-center">
              <span className="text-green-600 mr-1">📍</span>
              <p className="text-gray-600">{currentLocation.city}, {currentLocation.state}</p>
              <button className="ml-2 text-blue-600">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg flex items-center px-3 py-2 mb-4">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            className="flex-1 ml-2 bg-transparent border-none focus:outline-none text-gray-800"
            placeholder="Search for services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery.length > 0 && (
            <button onClick={() =>
            }
          )
          }
  )
}