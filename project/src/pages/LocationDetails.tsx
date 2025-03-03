import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Home, Utensils, Car, Stethoscope, 
  Lightbulb, Shield, GraduationCap, Briefcase, BarChart3, MapPin,
  Share2, ExternalLink, ChevronDown, ChevronUp
} from 'lucide-react';
import { Location as LocationType } from '../types';
import AffordabilityScoreCard from '../components/AffordabilityScoreCard';
import CurrentCityComparison from '../components/CurrentCityComparison';
import ApiService from '../services/ApiService';

const LocationDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [locationData, setLocationData] = useState<LocationType | null>(
    location.state?.location || null
  );
  const [isLoading, setIsLoading] = useState(!location.state?.location);
  const [currentCity, setCurrentCity] = useState<LocationType | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    costs: true,
    quality: false,
    jobs: false
  });
  
  const [isSaved, setIsSaved] = useState(() => {
    const savedLocations = JSON.parse(localStorage.getItem('savedLocations') || '[]');
    return savedLocations.some((loc: LocationType) => loc.id === locationData?.id);
  });
  
  // Fetch location data if not provided in state
  useEffect(() => {
    if (!locationData && id) {
      setIsLoading(true);
      ApiService.getLocationById(id)
        .then(data => {
          setLocationData(data);
          setIsLoading(false);
          
          // Check if saved
          const savedLocations = JSON.parse(localStorage.getItem('savedLocations') || '[]');
          setIsSaved(savedLocations.some((loc: LocationType) => loc.id === data.id));
        })
        .catch(error => {
          console.error('Error fetching location:', error);
          setIsLoading(false);
        });
    }
    
    // Check if user has a current city set
    const userCurrentCity = localStorage.getItem('currentCity');
    if (userCurrentCity) {
      try {
        const parsedCity = JSON.parse(userCurrentCity);
        setCurrentCity(parsedCity);
        setShowComparison(true);
      } catch (error) {
        console.error('Error parsing current city:', error);
      }
    }
  }, [id, locationData]);
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (!locationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Location data not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  const totalCost = Object.values(locationData.costBreakdown).reduce((a, b) => a + b, 0);
  
  const handleSaveLocation = () => {
    const savedLocations = JSON.parse(localStorage.getItem('savedLocations') || '[]');
    
    if (isSaved) {
      // Remove from saved
      const updated = savedLocations.filter((loc: LocationType) => loc.id !== locationData.id);
      localStorage.setItem('savedLocations', JSON.stringify(updated));
    } else {
      // Add to saved
      savedLocations.push(locationData);
      localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
    }
    
    setIsSaved(!isSaved);
  };
  
  const handleSetAsCurrentCity = () => {
    localStorage.setItem('currentCity', JSON.stringify(locationData));
    setCurrentCity(locationData);
    setShowComparison(false); // Hide comparison if setting current city to this city
  };
  
  const handleToggleComparison = () => {
    setShowComparison(!showComparison);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Thrive - ${locationData.city}, ${locationData.state}`,
        text: `Check out ${locationData.city}, ${locationData.state} on Thrive - Affordability Score: ${locationData.affordabilityScore}%`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.error('Could not copy text: ', error));
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)}
                className="mr-4 text-gray-600 hover:text-green-600 p-2 rounded-full hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {locationData.city}, {locationData.state}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleShare}
                className="p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSaveLocation}
                className={`p-2 rounded-full ${isSaved ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'}`}
                aria-label={isSaved ? "Remove from saved" : "Save location"}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Current City Comparison */}
        {showComparison && currentCity && currentCity.id !== locationData.id && (
          <CurrentCityComparison 
            currentCity={currentCity} 
            targetCity={locationData} 
            onClose={handleToggleComparison}
          />
        )}
        
        {/* Set as Current City Banner */}
        {(!currentCity || (currentCity && currentCity.id !== locationData.id)) && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-blue-600 mr-2" />
              <p className="text-blue-800">
                {currentCity 
                  ? `Compare ${locationData.city} with your current city (${currentCity.city}, ${currentCity.state})`
                  : `Set ${locationData.city}, ${locationData.state} as your current city to enable comparisons`
                }
              </p>
            </div>
            <div className="flex space-x-2">
              {currentCity && (
                <button
                  onClick={handleToggleComparison}
                  className="px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-xl hover:bg-blue-100 text-sm"
                >
                  {showComparison ? 'Hide Comparison' : 'Show Comparison'}
                </button>
              )}
              <button
                onClick={handleSetAsCurrentCity}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm"
              >
                Set as Current City
              </button>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Location Overview</h2>
                
                {/* Affordability Score */}
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mr-4 relative">
                    <div className={`w-20 h-20 rounded-full ${
                      locationData.affordabilityScore >= 80 ? 'bg-green-500' :
                      locationData.affordabilityScore >= 70 ? 'bg-green-400' :
                      locationData.affordabilityScore >= 60 ? 'bg-yellow-400' :
                      locationData.affordabilityScore >= 50 ? 'bg-orange-400' :
                      'bg-red-400'
                    } opacity-20 absolute`}></div>
                    <span className="text-3xl font-bold text-gray-800">{locationData.affordabilityScore}</span>
                  </div>
                  <div>
                    <p className="text-gray-600">Affordability Score</p>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-5 h-5 ${star <= Math.round(locationData.affordabilityScore / 20) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Cost Breakdown Section */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-gray-700">Monthly Cost Breakdown</h3>
                    <button 
                      onClick={() => toggleSection('costs')}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      {expandedSections.costs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {expandedSections.costs && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Home className="w-5 h-5 text-blue-500 mr-2" />
                          <span className="text-gray-600">Housing</span>
                        </div>
                        <span className="font-medium">${locationData.costBreakdown.housing}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Utensils className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-gray-600">Food</span>
                        </div>
                        <span className="font-medium">${locationData.costBreakdown.food}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Car className="w-5 h-5 text-purple-500 mr-2" />
                          <span className="text-gray-600">Transportation</span>
                        </div>
                        <span className="font-medium">${locationData.costBreakdown.transportation}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Stethoscope className="w-5 h-5 text-red-500 mr-2" />
                          <span className="text-gray-600">Healthcare</span>
                        </div>
                        <span className="font-medium">${locationData.costBreakdown.healthcare}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                          <span className="text-gray-600">Utilities</span>
                        </div>
                        <span className="font-medium">${locationData.costBreakdown.utilities}</span>
                      </div>
                      
                      <div className="pt-2 mt-2 border-t border-gray-100">
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-gray-800">Total Monthly Cost</span>
                          <span className="text-green-600">${totalCost}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Quality of Life Section */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-gray-700">Quality of Life</h3>
                    <button 
                      onClick={() => toggleSection('quality')}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      {expandedSections.quality ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {expandedSections.quality && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 text-blue-500 mr-1" />
                            <span className="text-sm text-gray-600">Safety</span>
                          </div>
                          <span className="text-sm font-medium">{locationData.qualityOfLife.safety}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${locationData.qualityOfLife.safety}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <GraduationCap className="w-4 h-4 text-purple-500 mr-1" />
                            <span className="text-sm text-gray-600">Education</span>
                          </div>
                          <span className="text-sm font-medium">{locationData.qualityOfLife.education}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-500 rounded-full" 
                            style={{ width: `${locationData.qualityOfLife.education}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Stethoscope className="w-4 h-4 text-red-500 mr-1" />
                            <span className="text-sm text-gray-600">Healthcare</span>
                          </div>
                          <span className="text-sm font-medium">{locationData.qualityOfLife.healthcare}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 rounded-full" 
                            style={{ width: `${locationData.qualityOfLife.healthcare}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <Lightbulb className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-gray-600">Environment</span>
                          </div>
                          <span className="text-sm font-medium">{locationData.qualityOfLife.environment}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full" 
                            style={{ width: `${locationData.qualityOfLife.environment}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Job Market Section */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-gray-700">Job Market</h3>
                    <button 
                      onClick={() => toggleSection('jobs')}
                      className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                    >
                      {expandedSections.jobs ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                  
                  {expandedSections.jobs && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center mb-2">
                          <Briefcase className="w-5 h-5 text-blue-500 mr-2" />
                          <h3 className="text-gray-700 font-medium">Unemployment</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{locationData.jobMarket.unemployment}%</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {locationData.jobMarket.unemployment < 4 ? 'Lower than national average' : 'Near national average'}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center mb-2">
                          <BarChart3 className="w-5 h-5 text-green-500 mr-2" />
                          <h3 className="text-gray-700 font-medium">Median Income</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">${locationData.jobMarket.medianIncome.toLocaleString()}</p>
                        <p className="text-sm text-gray-500 mt-1">Annual household income</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center mb-2">
                          <BarChart3 className="w-5 h-5 text-purple-500 mr-2" />
                          <h3 className="text-gray-700 font-medium">Job Growth</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{locationData.jobMarket.growthRate}%</p>
                        <p className="text-sm text-gray-500 mt-1">Annual growth rate</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* External Resources */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">External Resources</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a 
                  href={`https://www.zillow.com/homes/${locationData.city}-${locationData.state}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Home className="w-5 h-5 text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Zillow</p>
                    <p className="text-sm text-gray-600">Find homes and apartments</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </a>
                
                <a 
                  href={`https://www.google.com/maps/place/${locationData.city},+${locationData.state}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <MapPin className="w-5 h-5 text-red-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Google Maps</p>
                    <p className="text-sm text-gray-600">Explore the area</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </a>
                
                <a 
                  href={`https://www.indeed.com/l-${locationData.city},-${locationData.state}-jobs.html`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Briefcase className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">Indeed</p>
                    <p className="text-sm text-gray-600">Find jobs in the area</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </a>
                
                <a 
                  href={`https://www.greatschools.org/search/search.page?q=${locationData.city}%2C+${locationData.state}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <GraduationCap className="w-5 h-5 text-purple-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-800">GreatSchools</p>
                    <p className="text-sm text-gray-600">Research local schools</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Affordability Score Card */}
            <AffordabilityScoreCard 
              locationId={locationData.id} 
              affordabilityScore={locationData.affordabilityScore} 
            />
            
            {/* Actions Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions</h2>
              
              <div className="space-y-3">
                <button 
                  onClick={handleSaveLocation}
                  className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center ${
                    isSaved 
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } transition-colors duration-200`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                  {isSaved ? 'Remove from Saved' : 'Save Location'}
                </button>
                
                <button 
                  onClick={() => {
                    const savedLocations = JSON.parse(localStorage.getItem('savedLocations') || '[]');
                    navigate('/compare', { state: { savedLocations: [locationData, ...savedLocations].slice(0, 3) } });
                  }}
                  className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center justify-center transition-colors duration-200"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Compare with Other Locations
                </button>
                
                {(!currentCity || (currentCity && currentCity.id !== locationData.id)) && (
                  <button 
                    onClick={handleSetAsCurrentCity}
                    className="w-full py-2.5 px-4 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Set as Current City
                  </button>
                )}
                
                <button 
                  onClick={handleShare}
                  className="w-full py-2.5 px-4 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share Location
                </button>
              </div>
            </div>
            
            {/* Weather Preview */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Weather</h2>
              
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-gray-600">Weather data would be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">Integrated with a weather API</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LocationDetails;