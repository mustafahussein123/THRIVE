import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Slash as Flash, File as FileTree, Clock } from 'lucide-react';

const OnboardingChoice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userProfile = location.state?.userProfile || {};
  
  const handleDecisionTree = () => {
    navigate('/decision-tree');
  };
  
  const handleQuickStart = () => {
    navigate('/', { state: { userProfile } });
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 p-6 flex flex-col">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Thrive</h1>
          <h2 className="text-xl font-bold text-gray-800">
            Choose How You'd Like to Find Your Perfect Location
          </h2>
        </div>
        
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <button 
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm text-left hover:shadow-md transition-shadow"
            onClick={handleQuickStart}
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Flash className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 ml-3">Quick Start</h3>
            </div>
            
            <p className="text-gray-600 mb-3">
              Use the information you've already provided to get instant recommendations. Best for 
              those who want immediate results.
            </p>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 ml-1">Takes about 1 minute</span>
            </div>
          </button>
          
          <button 
            className="bg-white border border-green-200 rounded-xl p-6 shadow-sm text-left hover:shadow-md transition-shadow"
            onClick={handleDecisionTree}
          >
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FileTree className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 ml-3">Decision Tree</h3>
            </div>
            
            <p className="text-gray-600 mb-3">
              Answer a series of targeted questions to get highly personalized location recommendations. 
              Best for those who want tailored results.
            </p>
            
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-gray-500 ml-1">Takes about 5 minutes</span>
            </div>
          </button>
        </div>
        
        <div className="mt-6">
          <p className="text-center text-gray-500 mb-4">
            You can always change your preferences later
          </p>
          
          <button 
            className="w-full py-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
            onClick={() => navigate('/')}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingChoice;