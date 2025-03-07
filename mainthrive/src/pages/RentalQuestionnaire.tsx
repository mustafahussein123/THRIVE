import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, DollarSign, Users, Heart, Briefcase, MapPin, Check } from 'lucide-react';
import { QuestionnaireResponse } from '../types';

const RentalQuestionnaire: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireResponse>({
    city: '',
    state: '',
    income: 50000,
    savings: 10000,
    household_size: 1,
    healthcare_required: false,
    housing_budget_percentage: 'less-than-30',
    transportation_preference: 'car',
    amenities: {
      parks: false,
      gyms: false,
      shopping: false,
      restaurants: false,
      schools: false
    }
  });

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value
          }
        };
      }
      return { ...prev, [key]: value };
    });
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Submit form and navigate to results
      navigate('/rental-recommendations', { state: { formData } });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.city.trim() !== '' && formData.state.trim() !== '';
      case 2:
        return formData.income > 0;
      case 3:
        return formData.household_size > 0;
      case 4:
        return true; // All options are valid
      case 5:
        return true; // All options are valid
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Where are you looking to rent?</h2>
            <p className="text-gray-600">We'll find available rentals in your desired location.</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="city" className="block text-gray-700 mb-1">City</label>
                <input
                  id="city"
                  className="w-full bg-gray-100 p-4 rounded-lg text-gray-800"
                  placeholder="Enter city name"
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-gray-700 mb-1">State</label>
                <select
                  id="state"
                  className="w-full bg-gray-100 p-4 rounded-lg text-gray-800"
                  value={formData.state}
                  onChange={(e) => updateFormData('state', e.target.value)}
                >
                  <option value="">Select a state</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <option value="NY">New York</option>
                  <option value="FL">Florida</option>
                  <option value="IL">Illinois</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="OH">Ohio</option>
                  <option value="GA">Georgia</option>
                  <option value="NC">North Carolina</option>
                  <option value="MI">Michigan</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Financial Information</h2>
            <p className="text-gray-600">This helps us find rentals that match your budget.</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="income" className="block text-gray-700 mb-1">Annual Income (USD)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="income"
                    type="number"
                    className="w-full bg-gray-100 p-4 pl-10 rounded-lg text-gray-800"
                    placeholder="Enter your annual income"
                    value={formData.income}
                    onChange={(e) => updateFormData('income', Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="savings" className="block text-gray-700 mb-1">Savings (USD)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="savings"
                    type="number"
                    className="w-full bg-gray-100 p-4 pl-10 rounded-lg text-gray-800"
                    placeholder="Enter your total savings"
                    value={formData.savings}
                    onChange={(e) => updateFormData('savings', Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Housing Budget Percentage</label>
                <div className="space-y-2">
                  {[
                    { value: 'less-than-30', label: 'Less than 30% of income' },
                    { value: '30-40', label: '30-40% of income' },
                    { value: '40-plus', label: 'More than 40% of income' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      className={`w-full p-3 rounded-lg border text-left flex justify-between items-center cursor-pointer ${
                        formData.housing_budget_percentage === option.value
                          ? 'bg-green-100 border-green-300 text-green-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                      }`}
                      onClick={() => updateFormData('housing_budget_percentage', option.value)}
                    >
                      <span>{option.label}</span>
                      {formData.housing_budget_percentage === option.value && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Household Information</h2>
            <p className="text-gray-600">Tell us about your household size and needs.</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="household_size" className="block text-gray-700 mb-1">Household Size</label>
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="p-2 rounded-full bg-gray-200 text-gray-700"
                    onClick={() => updateFormData('household_size', Math.max(1, formData.household_size - 1))}
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-800">{formData.household_size}</span>
                  <button
                    type="button"
                    className="p-2 rounded-full bg-gray-200 text-gray-700"
                    onClick={() => updateFormData('household_size', formData.household_size + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-red-500 mr-2" />
                  <label htmlFor="healthcare_required" className="text-gray-700">
                    Healthcare Access Required
                  </label>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                  <input
                    id="healthcare_required"
                    type="checkbox"
                    className="absolute w-6 h-6 opacity-0 cursor-pointer"
                    checked={formData.healthcare_required}
                    onChange={(e) => updateFormData('healthcare_required', e.target.checked)}
                  />
                  <span 
                    className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                      formData.healthcare_required ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></span>
                  <span 
                    className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform ${
                      formData.healthcare_required ? 'translate-x-6' : 'translate-x-0'
                    } shadow-md`}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Transportation Preferences</h2>
            <p className="text-gray-600">How do you prefer to get around?</p>
            <div className="space-y-2">
              {[
                { value: 'car', label: 'Car', icon: <MapPin className="w-5 h-5" /> },
                { value: 'public-transit', label: 'Public Transit', icon: <MapPin className="w-5 h-5" /> },
                { value: 'bike-walking', label: 'Biking/Walking', icon: <MapPin className="w-5 h-5" /> }
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`w-full p-4 rounded-lg border text-left flex justify-between items-center cursor-pointer ${
                    formData.transportation_preference === option.value
                      ? 'bg-green-100 border-green-300 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                  onClick={() => updateFormData('transportation_preference', option.value)}
                >
                  <div className="flex items-center">
                    {option.icon}
                    <span className="ml-2">{option.label}</span>
                  </div>
                  {formData.transportation_preference === option.value && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Desired Amenities</h2>
            <p className="text-gray-600">Select all the amenities that are important to you.</p>
            <div className="space-y-2">
              {[
                { key: 'parks', label: 'Parks & Recreation', icon: <MapPin className="w-5 h-5" /> },
                { key: 'gyms', label: 'Gyms & Fitness Centers', icon: <MapPin className="w-5 h-5" /> },
                { key: 'shopping', label: 'Shopping Centers', icon: <MapPin className="w-5 h-5" /> },
                { key: 'restaurants', label: 'Restaurants & Cafes', icon: <MapPin className="w-5 h-5" /> },
                { key: 'schools', label: 'Schools & Education', icon: <MapPin className="w-5 h-5" /> }
              ].map(amenity => (
                <div
                  key={amenity.key}
                  className={`p-4 rounded-lg border flex justify-between items-center cursor-pointer ${
                    formData.amenities[amenity.key as keyof typeof formData.amenities]
                      ? 'bg-green-100 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() =>
                    updateFormData(
                      `amenities.${amenity.key}`,
                      !formData.amenities[amenity.key as keyof typeof formData.amenities]
                    )
                  }
                >
                  <div className="flex items-center">
                    {amenity.icon}
                    <span className="ml-2 text-gray-700">{amenity.label}</span>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <span 
                      className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                        formData.amenities[amenity.key as keyof typeof formData.amenities]
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    ></span>
                    <span 
                      className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform ${
                        formData.amenities[amenity.key as keyof typeof formData.amenities]
                          ? 'translate-x-6'
                          : 'translate-x-0'
                      } shadow-md`}
                    ></span>
                  </div>
                </div>
              ))}
            </div>
            {/* Place the message below the buttons so it does not interfere */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700 text-center">
                You're all set! Click "Find Rentals" to see personalized recommendations.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const progressPercent = (step / 5) * 100;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 hover:text-green-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Find Your Ideal Rental</h1>
          </div>
        </div>
      </header>
      
      {/* Progress bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-right text-gray-500 mt-1">
          Step {step} of 5
        </div>
      </div>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStep()}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className={`px-6 py-3 rounded-lg font-medium ${
                step === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              disabled={step === 1}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`px-6 py-3 rounded-lg font-medium ${
                isStepValid()
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isStepValid()}
            >
              {step === 5 ? 'Find Rentals' : 'Next'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default RentalQuestionnaire;
