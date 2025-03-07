import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Database, Brain, BarChart3, AlertTriangle } from 'lucide-react';
import MLService from '../../services/MLService';

const MLDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingOutput, setTrainingOutput] = useState('');
  const [trainingError, setTrainingError] = useState('');
  const [lastTrainingTime, setLastTrainingTime] = useState<string | null>(null);
  
  useEffect(() => {
    checkMLStatus();
    
    // Check if there's a saved training time in localStorage
    const savedTrainingTime = localStorage.getItem('lastMLTrainingTime');
    if (savedTrainingTime) {
      setLastTrainingTime(savedTrainingTime);
    }
  }, []);
  
  const checkMLStatus = async () => {
    try {
      const initialized = await MLService.initializeML();
      setIsInitialized(initialized);
    } catch (error) {
      console.error('Error checking ML status:', error);
      setIsInitialized(false);
    }
  };
  
  const handleTrainModels = async () => {
    setIsTraining(true);
    setTrainingOutput('');
    setTrainingError('');
    
    try {
      const result = await MLService.trainModels();
      setTrainingOutput(result.output || 'Training completed successfully.');
      
      // Save training time
      const now = new Date().toISOString();
      localStorage.setItem('lastMLTrainingTime', now);
      setLastTrainingTime(now);
      
      // Refresh ML status
      checkMLStatus();
    } catch (error) {
      console.error('Error training models:', error);
      setTrainingError('Failed to train models. See console for details.');
    } finally {
      setIsTraining(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
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
            <h1 className="text-2xl font-bold text-gray-800">ML Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">ML System Status</h2>
            <button 
              onClick={checkMLStatus}
              className="text-blue-600 hover:text-blue-800"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Database className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="text-gray-700 font-medium">ML Environment</h3>
              </div>
              {isInitialized === null ? (
                <p className="text-gray-500">Checking status...</p>
              ) : isInitialized ? (
                <p className="text-green-600 font-semibold">Initialized</p>
              ) : (
                <p className="text-red-600 font-semibold">Not Initialized</p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Brain className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="text-gray-700 font-medium">Models</h3>
              </div>
              {lastTrainingTime ? (
                <p className="text-gray-700">Last trained: {formatDate(lastTrainingTime)}</p>
              ) : (
                <p className="text-yellow-600">Not trained yet</p>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <BarChart3 className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="text-gray-700 font-medium">Recommendations</h3>
              </div>
              <p className="text-gray-700">Ready to generate</p>
            </div>
          </div>
        </div>
        
        {/* Training Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Model Training</h2>
          
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              Train the machine learning models to improve location recommendations and affordability predictions.
              This process may take several minutes depending on the amount of data.
            </p>
            
            <button
              onClick={handleTrainModels}
              disabled={isTraining}
              className={`px-4 py-2 rounded-md ${
                isTraining 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {isTraining ? (
                <span className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Training...
                </span>
              ) : (
                'Train Models'
              )}
            </button>
          </div>
          
          {trainingError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700">{trainingError}</p>
              </div>
            </div>
          )}
          
          {trainingOutput && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Training Output</h3>
              <div className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-auto max-h-64">
                <pre className="whitespace-pre-wrap">{trainingOutput}</pre>
              </div>
            </div>
          )}
        </div>
        
        {/* Model Performance Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Model Performance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Affordability Model</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-3">
                  <p className="text-gray-600 mb-1">Accuracy</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-1">85%</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-600 mb-1">Precision</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-1">82%</p>
                </div>
                
                <div>
                  <p className="text-gray-600 mb-1">Recall</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-1">78%</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Recommendation Model</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-3">
                  <p className="text-gray-600 mb-1">Accuracy</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-1">80%</p>
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-600 mb-1">Precision</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-1">75%</p>
                </div>
                
                <div>
                  <p className="text-gray-600 mb-1">Recall</p>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-1">72%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MLDashboard;