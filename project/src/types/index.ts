export interface Location {
  id: number;
  name: string;
  country: string;
  region: string;
  population: number;
  costOfLiving: {
    housing: number;
    utilities: number;
    transportation: number;
    groceries: number;
    entertainment: number;
  };
  qualityOfLife: {
    safety: number;
    education: number;
    healthcare: number;
    environment: number;
  };
  jobMarket: {
    unemployment: number;
    medianIncome: number;
    growthRate: number;
  };
}

export interface ComparisonData {
  source: Location;
  targets: Location[];
  comparisons: any;
}

export interface UserPreferences {
  priorityFactors: string[];
  budgetRange: {
    min: number;
    max: number;
  };
  desiredAmenities: string[];
  climatePreference: string;
}

export interface UserProfile {
  id: number;
  userId: number;
  income: number;
  savings: number;
  householdSize: number;
  housingPreference: string;
  housingBudgetPreference: string;
  requiresHealthcare: boolean;
  transportationPreference: string;
  entertainmentImportance: string;
  needsBikeLanes: boolean;
  safetyImportance: string;
  relocationTimeframe: string;
  remoteWork: boolean;
  languages: string[];
  amenities: {
    parks?: boolean;
    libraries?: boolean;
    gyms?: boolean;
    shopping?: boolean;
    restaurants?: boolean;
    schools?: boolean;
    cultural?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  userId: number;
  locationId: number;
  content: string;
  overallRating: number;
  affordabilityRating: number;
  safetyRating: number;
  transportationRating: number;
  amenitiesRating: number;
  createdAt: string;
  updatedAt: string;
  userName: string;
}

export interface NotificationPreferences {
  id: number;
  userId: number;
  priceChanges: boolean;
  newLocations: boolean;
  serviceUpdates: boolean;
  weeklyDigest: boolean;
  createdAt: string;
  updatedAt: string;
}