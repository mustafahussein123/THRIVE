import { PythonShell } from 'python-shell';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ML_DIR = path.join(__dirname, '..', 'ml');

/**
 * ML Integration Service for Thrive app
 */
const MLService = {
  /**
   * Initialize ML environment
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      // Check if ML directory exists
      if (!fs.existsSync(ML_DIR)) {
        console.error('ML directory not found');
        return false;
      }
      
      // Check if models directory exists, create if not
      const modelsDir = path.join(ML_DIR, 'models');
      if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir, { recursive: true });
      }
      
      console.log('ML environment initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing ML environment:', error);
      return false;
    }
  },
  
  /**
   * Train ML models
   * @returns {Promise<object>} Training results
   */
  async trainModels() {
    return new Promise((resolve, reject) => {
      const options = {
        mode: 'text',
        pythonPath: 'python', // or 'python3' depending on your environment
        pythonOptions: ['-u'], // unbuffered output
        scriptPath: ML_DIR,
      };
      
      PythonShell.run('train_models.py', options)
        .then(results => {
          console.log('Model training completed');
          resolve({ success: true, output: results.join('\n') });
        })
        .catch(err => {
          console.error('Error training models:', err);
          reject({ success: false, error: err.message });
        });
    });
  },
  
  /**
   * Predict affordability score for a location
   * @param {number} locationId - Location ID
   * @returns {Promise<object>} Prediction results
   */
  async predictAffordability(locationId) {
    return new Promise((resolve, reject) => {
      const options = {
        mode: 'json',
        pythonPath: 'python', // or 'python3' depending on your environment
        pythonOptions: ['-u'], // unbuffered output
        scriptPath: ML_DIR,
        args: ['affordability', locationId.toString()]
      };
      
      PythonShell.run('predict.py', options)
        .then(results => {
          if (results && results.length > 0) {
            resolve(results[0]);
          } else {
            reject({ error: 'No prediction results returned' });
          }
        })
        .catch(err => {
          console.error('Error predicting affordability:', err);
          reject({ error: err.message });
        });
    });
  },
  
  /**
   * Generate location recommendations for a user
   * @param {number} userId - User ID
   * @returns {Promise<object>} Recommendation results
   */
  async generateRecommendations(userId) {
    return new Promise((resolve, reject) => {
      const options = {
        mode: 'json',
        pythonPath: 'python', // or 'python3' depending on your environment
        pythonOptions: ['-u'], // unbuffered output
        scriptPath: ML_DIR,
        args: ['recommendations', userId.toString()]
      };
      
      PythonShell.run('predict.py', options)
        .then(results => {
          if (results && results.length > 0) {
            resolve(results[0]);
          } else {
            reject({ error: 'No recommendation results returned' });
          }
        })
        .catch(err => {
          console.error('Error generating recommendations:', err);
          reject({ error: err.message });
        });
    });
  }
};

export default MLService;