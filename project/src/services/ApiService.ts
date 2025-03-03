import axios from 'axios';
import { Location } from '../types';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add token to requests if available
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['x-auth-token'] = token;
}

/**
 * API Service for Thrive app
 */
const ApiService = {
  /**
   * Get all locations with optional search
   * @param {string} search - Optional search query
   * @param {number} limit - Results per page
   * @param {number} offset - Pagination offset
   * @returns {Promise} - Locations data
   */
  getLocations: async (search?: string, limit = 10, offset = 0) => {
    try {
      const params: any = { limit, offset };
      if (search) params.search = search;
      
      const response = await axios.get('/locations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },

  /**
   * Get location by ID
   * @param {string} id - Location ID
   * @returns {Promise} - Location data
   */
  getLocationById: async (id: string) => {
    try {
      const response = await axios.get(`/locations/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching location:', error);
      throw error;
    }
  },

  /**
   * Get recommended locations based on user profile
   * @returns {Promise} - Recommended locations
   */
  getRecommendedLocations: async () => {
    try {
      const response = await axios.get('/locations/recommendations/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  /**
   * Compare locations
   * @param {string[]} locationIds - Array of location IDs to compare
   * @returns {Promise} - Comparison data
   */
  compareLocations: async (locationIds: string[]) => {
    try {
      const response = await axios.post('/locations/compare', { locationIds });
      return response.data;
    } catch (error) {
      console.error('Error comparing locations:', error);
      throw error;
    }
  },

  /**
   * Save location for current user
   * @param {string} locationId - Location ID to save
   * @returns {Promise} - Success message
   */
  saveLocation: async (locationId: string) => {
    try {
      const response = await axios.post('/locations/save', { locationId });
      return response.data;
    } catch (error) {
      console.error('Error saving location:', error);
      throw error;
    }
  },

  /**
   * Get saved locations for current user
   * @returns {Promise} - Saved locations
   */
  getSavedLocations: async () => {
    try {
      const response = await axios.get('/locations/saved/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching saved locations:', error);
      throw error;
    }
  },

  /**
   * Remove saved location
   * @param {string} locationId - Location ID to remove
   * @returns {Promise} - Success message
   */
  removeSavedLocation: async (locationId: string) => {
    try {
      const response = await axios.delete(`/locations/saved/${locationId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing saved location:', error);
      throw error;
    }
  },

  /**
   * Get user profile
   * @returns {Promise} - User profile data
   */
  getUserProfile: async () => {
    try {
      const response = await axios.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Create or update user profile
   * @param {Object} profileData - Profile data
   * @returns {Promise} - Updated profile
   */
  updateUserProfile: async (profileData: any) => {
    try {
      const response = await axios.post('/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  /**
   * Get notification preferences
   * @returns {Promise} - Notification preferences
   */
  getNotificationPreferences: async () => {
    try {
      const response = await axios.get('/profile/notifications');
      return response.data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      throw error;
    }
  },

  /**
   * Update notification preferences
   * @param {Object} preferences - Notification preferences
   * @returns {Promise} - Updated preferences
   */
  updateNotificationPreferences: async (preferences: any) => {
    try {
      const response = await axios.post('/profile/notifications', { preferences });
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  },

  /**
   * Get reviews for a location
   * @param {string} locationId - Location ID
   * @param {number} limit - Results per page
   * @param {number} offset - Pagination offset
   * @returns {Promise} - Reviews data
   */
  getLocationReviews: async (locationId: string, limit = 10, offset = 0) => {
    try {
      const response = await axios.get(`/reviews/location/${locationId}`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  /**
   * Add a review for a location
   * @param {Object} reviewData - Review data
   * @returns {Promise} - Created review
   */
  addReview: async (reviewData: any) => {
    try {
      const response = await axios.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  /**
   * Update a review
   * @param {string} reviewId - Review ID
   * @param {Object} reviewData - Updated review data
   * @returns {Promise} - Updated review
   */
  updateReview: async (reviewId: string, reviewData: any) => {
    try {
      const response = await axios.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review ID
   * @returns {Promise} - Success message
   */
  deleteReview: async (reviewId: string) => {
    try {
      const response = await axios.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  /**
   * Get nearby healthcare facilities
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @param {number} radius - Search radius in meters
   * @returns {Promise} - Healthcare facilities data
   */
  getHealthcareFacilities: async (latitude: number, longitude: number, radius = 5000) => {
    try {
      // This is a mock implementation for now
      // In a real app, this would call the backend API
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