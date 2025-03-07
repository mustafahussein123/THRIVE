export interface Location {
  id: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  affordabilityScore: number;
  costBreakdown: {
    housing: number;
    food: number;
    transportation: number;
    healthcare: number;
    utilities: number;
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

export interface ZillowRental {
  zpid: string;
  id: string;
  imgSrc: string;
  detailUrl: string;
  address: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressZipcode: string;
  units: {
    price: string;
    beds: string;
    roomForRent: boolean;
  }[];
  latLong: {
    latitude: number;
    longitude: number;
  };
  buildingName?: string;
  isBuilding?: boolean;
  carouselPhotos?: {
    url: string;
  }[];
  availabilityCount?: number;
  badgeInfo?: {
    type: string;
    text: string;
  };
}

export interface QuestionnaireResponse {
  city: string;
  state: string;
  income: number;
  savings: number;
  household_size: number;
  healthcare_required: boolean;
  housing_budget_percentage: string;
  transportation_preference: string;
  amenities: {
    parks: boolean;
    gyms: boolean;
    shopping: boolean;
    restaurants: boolean;
    schools: boolean;
  };
}

export interface RecommendationResponse {
  city: string;
  state: string;
  affordability_score: number;
  recommendations: ZillowRental[];
}