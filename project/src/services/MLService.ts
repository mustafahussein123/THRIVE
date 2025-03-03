import axios from 'axios';

/**
 * ML Service for Thrive app
 */
const MLService = {
  /**
   * Initialize ML environment
   * @returns {Promise<boolean>} Success status
   */
  initializeML: async () => {
    try {
      const response = await axios.get('/api/ml/initialize');
      return response.data.success;
    } catch (error) {
      console.error('Error initializing ML:', error);
      return false;
    }
  },
  
  /**
   * Train ML models
   * @returns {Promise<object>} Training results
   */
  trainModels: async () => {
    try {
      const response = await axios.post('/api/ml/train');
      return response.data;
    } catch (error) {
      console.error('Error training models:', error);
      throw error;
    }
  },
  
  /**
   * Get affordability prediction for a location
   * @param {number} locationId - Location ID
   * @returns {Promise<object>} Prediction results
   */
  getAffordabilityPrediction: async (locationId: number) => {
    try {
      const response = await axios.get(`/api/ml/affordability/${locationId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting affordability prediction:', error);
      throw error;
    }
  },
  
  /**
   * Get location recommendations for current user
   * @returns {Promise<object>} Recommendation results
   */
  getRecommendations: async () => {
    try {
      const response = await axios.get('/api/ml/recommendations');
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  },
  
  /**
   * Get location recommendations for a specific user (admin only)
   * @param {number} userId - User ID
   * @returns {Promise<object>} Recommendation results
   */
  getRecommendationsForUser: async (userId: number) => {
    try {
      const response = await axios.get(`/api/ml/recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations for user:', error);
      throw error;
    }
  }
};

export default MLService;