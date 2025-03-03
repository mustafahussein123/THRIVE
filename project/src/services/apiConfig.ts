// API Keys
export const PILOTERR_API_KEY = "d9fa65be-fb2e-423f-ba18-7711e9606633";
export const COST_OF_LIVING_API_KEY = "244fd8f88emsh738b2115c7d9601p1e74e4jsnf5d0b277efbd";
export const CENSUS_API_KEY = "4f7b13763709bf5411cde6b774fd380478b7df89";
export const HEALTHCARE_API_KEY = "AIzaSyD5mBpqlcWqRj8h9_Bdz2r-5olMCu2zH5c";

// API Endpoints
export const API_ENDPOINTS = {
  // Cost of Living API
  COST_OF_LIVING: {
    BASE_URL: 'https://cost-of-living-and-prices.p.rapidapi.com',
    PRICES: '/prices',
    COMPARE: '/compare'
  },
  
  // Piloterr API
  PILOTERR: {
    BASE_URL: 'https://piloterr.com/api/v2',
    CITY_INFO: '/cityinfo',
    CITY_SEARCH: '/citysearch'
  },
  
  // Census API
  CENSUS: {
    BASE_URL: 'https://api.census.gov/data',
    ACS_HOUSING: '/2019/acs/acs5',
    QWI_EMPLOYMENT: '/timeseries/qwi/sa'
  },
  
  // Healthcare API (Google Maps Places API)
  HEALTHCARE: {
    BASE_URL: 'https://maps.googleapis.com/maps/api/place',
    NEARBY_SEARCH: '/nearbysearch/json'
  }
};

// HTTP Request Configs
export const API_CONFIGS = {
  COST_OF_LIVING: {
    headers: {
      'x-rapidapi-key': COST_OF_LIVING_API_KEY,
      'x-rapidapi-host': 'cost-of-living-and-prices.p.rapidapi.com'
    }
  },
  
  PILOTERR: {
    headers: {
      'x-api-key': PILOTERR_API_KEY
    }
  }
};

// Default API Parameters
export const DEFAULT_PARAMS = {
  HEALTHCARE_SEARCH: {
    radius: 5000,
    type: 'hospital'
  },
  
  CENSUS_HOUSING: {
    get: 'NAME,B25105_001E', // median monthly housing costs
    for: 'county:*'
  }
};

// Error Messages
export const API_ERROR_MESSAGES = {
  COST_OF_LIVING: 'Unable to fetch cost of living data. Please try again later.',
  CITY_INFO: 'Unable to fetch city information. Please try again later.',
  HOUSING_DATA: 'Unable to fetch housing data. Please try again later.',
  HEALTHCARE: 'Unable to fetch healthcare facilities. Please try again later.',
  EMPLOYMENT: 'Unable to fetch employment statistics. Please try again later.',
  CITY_COMPARISON: 'Unable to compare cities. Please try again later.',
  CITY_SEARCH: 'Unable to search for cities. Please try again later.'
};