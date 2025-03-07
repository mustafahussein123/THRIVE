import axios from 'axios';
import { ZillowRental, RecommendationResponse, QuestionnaireResponse } from '../types';

/**
 * Service for Zillow rental data
 */
const ZillowService = {
  /**
   * Get Zillow rentals for a specific city and state
   * @param {string} city - City name
   * @param {string} state - State code (e.g., CA, TX)
   * @returns {Promise<ZillowRental[]>} - Zillow rental listings
   */
  getRentals: async (city: string, state: string): Promise<ZillowRental[]> => {
    try {
      const response = await axios.get(`http://localhost:5001/api/rentals?city=${city}&state=${state}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Zillow rentals:', error);
      throw error;
    }
  },

  /**
   * Submit questionnaire responses and get personalized recommendations
   * @param {QuestionnaireResponse} data - Questionnaire responses
   * @returns {Promise<RecommendationResponse>} - Personalized recommendations
   */
  getRecommendations: async (data: QuestionnaireResponse): Promise<RecommendationResponse> => {
    try {
      // Create a plain object with only primitive values and simple objects
      // to avoid serialization issues with Symbols or complex objects
      const requestData = {
        city: String(data.city),
        state: String(data.state),
        income: Number(data.income),
        savings: Number(data.savings),
        household_size: Number(data.household_size),
        healthcare_required: Boolean(data.healthcare_required),
        housing_budget_percentage: String(data.housing_budget_percentage),
        transportation_preference: String(data.transportation_preference),
        amenities: {
          parks: Boolean(data.amenities.parks),
          gyms: Boolean(data.amenities.gyms),
          shopping: Boolean(data.amenities.shopping),
          restaurants: Boolean(data.amenities.restaurants),
          schools: Boolean(data.amenities.schools)
        }
      };
      
      const response = await axios.post('http://localhost:5001/api/scoring/recommendations', requestData);
      return response.data;
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      throw new Error('Failed to fetch recommendations. Please try again.');
    }
  }
};

export default ZillowService;