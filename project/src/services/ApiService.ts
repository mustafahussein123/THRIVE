import axios from 'axios';
import { Location, ZillowRental, QuestionnaireResponse, RecommendationResponse } from '../types';

// Set the base URL from environment variable or default to localhost
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// If a token is stored, add it to headers
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['x-auth-token'] = token;
}

const ApiService = {
  /**
   * Get Zillow rentals for a specific city and state.
   * Data comes from your real zillow_rentals.json served by your backend.
   */
  getZillowRentals: async (city: string, state: string): Promise<ZillowRental[]> => {
    try {
      const response = await axios.get(`/rentals?city=${city}&state=${state}`);
      console.log("getZillowRentals data:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching Zillow rentals:', error);
      throw error;
    }
  },

  /**
   * Submit questionnaire responses and get personalized recommendations.
   */
  submitQuestionnaire: async (data: QuestionnaireResponse): Promise<RecommendationResponse> => {
    try {
      const response = await axios.post('/scoring/recommendations', data);
      return response.data;
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      throw error;
    }
  },

  /**
   * Get a location by its ID.
   */
  getLocationById: async (id: string): Promise<Location> => {
    try {
      const response = await axios.get(`/locations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching location:', error);
      throw error;
    }
  },

  /**
   * Compare locations by passing an array of location IDs.
   */
  compareLocations: async (locationIds: string[]): Promise<any> => {
    try {
      const response = await axios.post('/locations/compare', { locationIds });
      return response.data;
    } catch (error) {
      console.error('Error comparing locations:', error);
      throw error;
    }
  },

  /**
   * Save a location for the current user.
   */
  saveLocation: async (locationId: string): Promise<any> => {
    try {
      const response = await axios.post('/locations/save', { locationId });
      return response.data;
    } catch (error) {
      console.error('Error saving location:', error);
      throw error;
    }
  },

  /**
   * Get saved locations for the current user.
   */
  getSavedLocations: async (): Promise<Location[]> => {
    try {
      const response = await axios.get('/locations/saved/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching saved locations:', error);
      throw error;
    }
  },

  /**
   * Remove a saved location for the current user.
   */
  removeSavedLocation: async (locationId: string): Promise<any> => {
    try {
      const response = await axios.delete(`/locations/saved/${locationId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing saved location:', error);
      throw error;
    }
  },

  /**
   * Get the user profile.
   */
  getUserProfile: async (): Promise<any> => {
    try {
      const response = await axios.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Create or update the user profile.
   */
  updateUserProfile: async (profileData: any): Promise<any> => {
    try {
      const response = await axios.post('/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Get notification preferences for the user.
   */
  getNotificationPreferences: async (): Promise<any> => {
    try {
      const response = await axios.get('/profile/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  },

  /**
   * Update notification preferences for the user.
   */
  updateNotificationPreferences: async (preferences: any): Promise<any> => {
    try {
      const response = await axios.post('/profile/notifications', { preferences });
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  },

  /**
   * Get reviews for a specific location.
   */
  getLocationReviews: async (locationId: string, limit = 10, offset = 0): Promise<any> => {
    try {
      const response = await axios.get(`/reviews/location/${locationId}`, { params: { limit, offset } });
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  /**
   * Add a review for a location.
   */
  addReview: async (reviewData: any): Promise<any> => {
    try {
      const response = await axios.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  /**
   * Update a review for a location.
   */
  updateReview: async (reviewId: string, reviewData: any): Promise<any> => {
    try {
      const response = await axios.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  /**
   * Delete a review for a location.
   */
  deleteReview: async (reviewId: string): Promise<any> => {
    try {
      const response = await axios.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  /**
   * Get nearby healthcare facilities based on latitude and longitude.
   * This is a mock implementation—replace it with a real API call if needed.
   */
  getHealthcareFacilities: async (latitude: number, longitude: number, radius = 5000): Promise<any> => {
    try {
      // Replace with a real API call if necessary.
      return {
        results: [
          {
            place_id: 'mock-hospital-1',
            name: 'City General Hospital',
            vicinity: '123 Main St',
            rating: 4.5
          },
          {
            place_id: 'mock-clinic-1',
            name: 'Downtown Medical Clinic',
            vicinity: '456 Oak Ave',
            rating: 4.2
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching healthcare facilities:', error);
      throw error;
    }
  }
};

export default ApiService;
