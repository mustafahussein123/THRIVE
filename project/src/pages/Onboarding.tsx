import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    monthlyIncome: '5000',
    savings: '25000',
    language: 'English',
    amenities: {
      publicTransit: false,
      healthcare: false,
      parks: false,
      shopping: false,
      restaurants: false,
      schools: false,
      entertainment: false,
    },
    relocationTimeframe: 'ASAP',
    housingPreference: 'Rent',
    householdSize: 1,
    remoteWork: false,
  });

  const updateProfile = (key: string, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const updateAmenity = (amenity: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      amenities: { ...prev.amenities, [amenity]: value }
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Navigate to the next screen with user profile data
      navigate('/onboarding-choice', { state: { userProfile: profile } });
    }
  };

  const handleSkipToDecisionTree = () => {
    navigate('/decision-tree');
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Financial Information</h2>
            <p className="text-gray-600">Let's understand your financial situation to find affordable locations.</p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="monthlyIncome" className="block text-gray-700 mb-1">Monthly Income (USD)</label>
                <input
                  id="monthlyIncome"
                  className="w-full bg-gray-100 p-4 rounded-lg text-gray-800"
                  placeholder="Enter your monthly income"
                  type="number"
                  value={profile.monthlyIncome}
                  onChange={(e) => updateProfile('monthlyIncome', e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="savings" className="block text-gray-700 mb-1">Savings (USD)</label>
                <input
                  id="savings"
                  className="w-full bg-gray-100 p-4 rounded-lg text-gray-800"
                  placeholder="Enter your total savings"
                  type="number"
                  value={profile.savings}
                  onChange={(e) => updateProfile('savings', e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="householdSize" className="block text-gray-700 mb-1">Household Size</label>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">1</span>
                  <input
                    id="householdSize"
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={profile.householdSize}
                    onChange={(e) => updateProfile('householdSize', parseInt(e.target.value))}
                    className="w-4/5 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <span className="text-gray-600">10+</span>
                </div>
                <p className="text-center text-gray-700">{profile.householdSize}</p>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Housing Preferences</h2>
            <p className="text-gray-600">Tell us about your housing and location preferences.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-3">Preferred Housing Type</label>
                <div className="flex space-x-2">
                  {['Rent', 'Buy', 'Either'].map(option => (
                    <button 
                      key={option}
                      className={`py-2 px-4 rounded-full border ${profile.housingPreference === option ? 'bg-green-500 border-green-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                      onClick={() => updateProfile('housingPreference', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="language" className="block text-gray-700 mb-1">Preferred Language</label>
                <input
                  id="language"
                  className="w-full bg-gray-100 p-4 rounded-lg text-gray-800"
                  placeholder="e.g. English, Spanish, etc."
                  value={profile.language}
                  onChange={(e) => updateProfile('language', e.target.value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label htmlFor="remoteWork" className="text-gray-700">Remote Work</label>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                  <input
                    id="remoteWork"
                    type="checkbox"
                    className="absolute w-6 h-6 opacity-0 cursor-pointer"
                    checked={profile.remoteWork}
                    onChange={(e) => updateProfile('remoteWork', e.target.checked)}
                  />
                  <span 
                    className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${profile.remoteWork ? 'bg-green-500' : 'bg-gray-300'}`}
                  ></span>
                  <span 
                    className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform ${profile.remoteWork ? 'translate-x-6' : 'translate-x-0'} shadow-md`}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Desired Amenities</h2>
            <p className="text-gray-600">Select the amenities that are important to you.</p>
            
            <div className="space-y-2">
              {Object.entries(profile.amenities).map(([key, value]) => {
                // Convert camelCase to Title Case with spaces
                const readableKey = key.replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase());
                
                return (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-gray-200">
                    <label htmlFor={key} className="text-gray-700">{readableKey}</label>
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input
                        id={key}
                        type="checkbox"
                        className="absolute w-6 h-6 opacity-0 cursor-pointer"
                        checked={value}
                        onChange={(e) => updateAmenity(key, e.target.checked)}
                      />
                      <span 
                        className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${value ? 'bg-green-500' : 'bg-gray-300'}`}
                      ></span>
                      <span 
                        className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform ${value ? 'translate-x-6' : 'translate-x-0'} shadow-md`}
                      ></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Relocation Timeline</h2>
            <p className="text-gray-600">When are you planning to relocate?</p>
            
            <div className="space-y-2">
              {['ASAP', '3-6 months', '6-12 months', '1+ year', 'Just exploring'].map(option => (
                <button 
                  key={option}
                  className={`w-full p-4 rounded-lg border text-left ${profile.relocationTimeframe === option ? 'bg-green-500 border-green-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-700'}`}
                  onClick={() => updateProfile('relocationTimeframe', option)}
                >
                  {option}
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700 text-center">
                You're all set! Click "Finish" to generate your personalized recommendations.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-green-600">Thrive</h1>
            <button 
              onClick={handleSkipToDecisionTree}
              className="text-green-600 text-sm font-medium"
            >
              Use Decision Tree
            </button>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500">Step {step} of 4</p>
            <button 
              onClick={() => navigate('/')}
              className="text-gray-500 text-sm"
            >
              Skip
            </button>
          </div>
          
          <div className="flex justify-between mb-6">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className={`h-2 flex-1 mx-1 rounded-full ${
                  i <= step ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
        
        {renderStep()}
        
        <div className="flex justify-between mt-8 pb-6">
          <button
            onClick={handleBack}
            className={`py-3 px-6 rounded-lg ${
              step === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
            disabled={step === 1}
          >
            <span className="font-semibold">Back</span>
          </button>
          
          <button
            onClick={handleNext}
            className="bg-green-500 py-3 px-6 rounded-lg text-white hover:bg-green-600"
          >
            <span className="font-semibold">
              {step < 4 ? 'Next' : 'Finish'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;