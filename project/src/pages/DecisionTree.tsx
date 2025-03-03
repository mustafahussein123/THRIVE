import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  type: 'single-select' | 'multi-select' | 'slider';
  options?: { value: string | boolean; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  displayPrefix?: string;
}

const DecisionTree: React.FC = () => {
  const navigate = useNavigate();
  
  // State to track current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // State to store all user answers
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({
    movingPurpose: null,
    incomeLevel: 50000, // Default middle of slider
    savingsAmount: 25000, // Default middle of slider
    languages: [],
    housingBudgetPercentage: null,
    requiresHealthcare: null,
    transportationMethod: null,
    entertainmentImportance: null,
    needsBikeLanes: null,
    safetyImportance: null,
    localAmenities: []
  });
  
  // State to track progress
  const [progress, setProgress] = useState(0);
  
  // Calculate progress percentage based on current question
  useEffect(() => {
    const totalQuestions = decisionTree.length;
    const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;
    setProgress(progressPercentage);
  }, [currentQuestionIndex]);
  
  // Define the decision tree questions
  const decisionTree: Question[] = [
    {
      id: 'movingPurpose',
      question: 'What is your primary purpose for moving?',
      type: 'single-select',
      options: [
        { value: 'rent', label: 'Rent' },
        { value: 'buy', label: 'Buy' }
      ]
    },
    {
      id: 'incomeLevel',
      question: 'What is your current income level?',
      type: 'slider',
      min: 0,
      max: 200000,
      step: 5000,
      displayPrefix: '$'
    },
    {
      id: 'savingsAmount',
      question: 'What is your savings amount?',
      type: 'slider',
      min: 0,
      max: 999000,
      step: 5000,
      displayPrefix: '$'
    },
    {
      id: 'languages',
      question: 'What language(s) do you speak or prefer?',
      type: 'multi-select',
      options: [
        { value: 'english', label: 'English' },
        { value: 'spanish', label: 'Spanish' },
        { value: 'french', label: 'French' },
        { value: 'chinese', label: 'Chinese' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      id: 'housingBudgetPercentage',
      question: 'How much of your income would you prefer to spend on housing?',
      type: 'single-select',
      options: [
        { value: 'less-than-30', label: 'Less than 30%' },
        { value: '30-40', label: '30-40%' },
        { value: '40-plus', label: '40% or more' }
      ]
    },
    {
      id: 'requiresHealthcare',
      question: 'Do you require healthcare services or affordable healthcare?',
      type: 'single-select',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ]
    },
    {
      id: 'transportationMethod',
      question: 'What is your preferred transportation method?',
      type: 'single-select',
      options: [
        { value: 'car', label: 'Car' },
        { value: 'public-transit', label: 'Public Transit' },
        { value: 'bike-walking', label: 'Bike/Walking' }
      ]
    },
    {
      id: 'entertainmentImportance',
      question: 'How important are entertainment and social activities in your lifestyle?',
      type: 'single-select',
      options: [
        { value: 'very-important', label: 'Very important' },
        { value: 'somewhat-important', label: 'Somewhat important' },
        { value: 'not-important', label: 'Not important' }
      ]
    },
    {
      id: 'needsBikeLanes',
      question: 'Do you need access to bike lanes, walking or running trails?',
      type: 'single-select',
      options: [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
      ]
    },
    {
      id: 'safetyImportance',
      question: 'How important is public safety (crime rate) in your decision-making?',
      type: 'single-select',
      options: [
        { value: 'very-important', label: 'Very important' },
        { value: 'somewhat-important', label: 'Somewhat important' },
        { value: 'not-important', label: 'Not important' }
      ]
    },
    {
      id: 'localAmenities',
      question: 'What local amenities would you look for?',
      type: 'multi-select',
      options: [
        { value: 'parks', label: 'Parks' },
        { value: 'libraries', label: 'Libraries' },
        { value: 'gyms', label: 'Gyms/Fitness Centers' },
        { value: 'shopping', label: 'Shopping Centers' },
        { value: 'restaurants', label: 'Restaurants & Cafes' },
        { value: 'schools', label: 'Schools' },
        { value: 'cultural', label: 'Cultural Venues' }
      ]
    }
  ];
  
  // Get current question
  const currentQuestion = decisionTree[currentQuestionIndex];
  
  // Handle answer selection
  const handleAnswer = (questionId: string, answer: any) => {
    // Update userAnswers state
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  // Handle multi-select answers
  const handleMultiSelectAnswer = (questionId: string, value: string) => {
    setUserAnswers(prev => {
      const currentSelections = prev[questionId] || [];
      
      // If already selected, remove it; otherwise, add it
      if (currentSelections.includes(value)) {
        return {
          ...prev,
          [questionId]: currentSelections.filter((item: string) => item !== value)
        };
      } else {
        return {
          ...prev,
          [questionId]: [...currentSelections, value]
        };
      }
    });
  };
  
  // Handle next question
  const handleNextQuestion = () => {
    // Advance to next question if there is one
    if (currentQuestionIndex < decisionTree.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Process final answers and navigate to recommendations
      handleFinalSubmit();
    }
  };
  
  // Handle previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Handle final submission of all answers
  const handleFinalSubmit = () => {
    // Navigate to results page with user answers
    navigate('/decision-tree-results', { state: { userAnswers } });
  };
  
  // Check if current question has an answer
  const hasCurrentAnswer = () => {
    if (!currentQuestion) return false;
    
    const answer = userAnswers[currentQuestion.id];
    
    switch (currentQuestion.type) {
      case 'single-select':
        return answer !== null && answer !== undefined;
        
      case 'multi-select':
        return Array.isArray(answer) && answer.length > 0;
        
      case 'slider':
        return true; // Sliders always have a value
        
      default:
        return false;
    }
  };
  
  // Render question based on type
  const renderQuestion = () => {
    if (!currentQuestion) return null;
    
    switch (currentQuestion.type) {
      case 'single-select':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => (
              <button
                key={index}
                className={`w-full p-4 rounded-lg border text-left ${
                  userAnswers[currentQuestion.id] === option.value
                    ? 'bg-green-100 border-green-500'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleAnswer(currentQuestion.id, option.value)}
              >
                <span 
                  className={`font-medium ${
                    userAnswers[currentQuestion.id] === option.value
                      ? 'text-green-700'
                      : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        );
        
      case 'multi-select':
        return (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => {
              const isSelected = (userAnswers[currentQuestion.id] || []).includes(option.value);
              
              return (
                <button
                  key={index}
                  className={`w-full p-4 rounded-lg border flex justify-between items-center ${
                    isSelected
                      ? 'bg-green-100 border-green-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleMultiSelectAnswer(currentQuestion.id, option.value as string)}
                >
                  <span 
                    className={`font-medium ${
                      isSelected
                        ? 'text-green-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.label}
                  </span>
                  
                  {isSelected && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </button>
              );
            })}
          </div>
        );
        
      case 'slider':
        // Set default value if not already set
        const currentValue = userAnswers[currentQuestion.id] !== undefined
          ? userAnswers[currentQuestion.id]
          : (currentQuestion.min && currentQuestion.max) 
            ? (currentQuestion.min + currentQuestion.max) / 2
            : 0;
          
        // Format value with commas for thousands
        const formattedValue = currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        return (
          <div className="space-y-6">
            <div className="flex justify-center">
              <span className="text-2xl font-bold text-green-600">
                {currentQuestion.displayPrefix || ''}{formattedValue}
              </span>
            </div>
            
            <input
              type="range"
              min={currentQuestion.min}
              max={currentQuestion.max}
              step={currentQuestion.step}
              value={currentValue}
              onChange={(e) => handleAnswer(currentQuestion.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            
            <div className="flex justify-between">
              <span className="text-gray-500">
                {currentQuestion.displayPrefix || ''}{currentQuestion.min?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
              <span className="text-gray-500">
                {currentQuestion.displayPrefix || ''}{currentQuestion.max?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </span>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
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
            <h1 className="text-2xl font-bold text-gray-800">Find Your Ideal Location</h1>
          </div>
        </div>
      </header>
      
      {/* Progress bar */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-right text-gray-500 mt-1">
          Question {currentQuestionIndex + 1} of {decisionTree.length}
        </div>
      </div>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">{currentQuestion?.question}</h2>
          
          {renderQuestion()}
          
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevQuestion}
              className={`py-3 px-6 rounded-lg ${
                currentQuestionIndex === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
              disabled={currentQuestionIndex === 0}
            >
              <span className="font-semibold">Back</span>
            </button>
            
            <button
              onClick={handleNextQuestion}
              className={`py-3 px-6 rounded-lg ${
                hasCurrentAnswer() ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!hasCurrentAnswer()}
            >
              <span className="font-semibold">
                {currentQuestionIndex < decisionTree.length - 1 ? 'Next' : 'Find Locations'}
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DecisionTree;