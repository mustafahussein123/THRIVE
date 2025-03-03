-- Create database (run this separately)
-- CREATE DATABASE thrive;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  income NUMERIC NOT NULL,
  savings NUMERIC NOT NULL,
  household_size INTEGER NOT NULL DEFAULT 1,
  housing_preference VARCHAR(20) NOT NULL, -- 'rent', 'buy', 'either'
  housing_budget_preference VARCHAR(20) NOT NULL, -- 'less-than-30', '30-40', '40-plus'
  requires_healthcare BOOLEAN NOT NULL DEFAULT false,
  transportation_preference VARCHAR(20) NOT NULL, -- 'car', 'public-transit', 'bike-walking'
  entertainment_importance VARCHAR(20) NOT NULL, -- 'very-important', 'somewhat-important', 'not-important'
  needs_bike_lanes BOOLEAN NOT NULL DEFAULT false,
  safety_importance VARCHAR(20) NOT NULL, -- 'very-important', 'somewhat-important', 'not-important'
  relocation_timeframe VARCHAR(20) NOT NULL, -- 'ASAP', '3-6 months', '6-12 months', '1+ year', 'Just exploring'
  remote_work BOOLEAN NOT NULL DEFAULT false,
  languages TEXT[] NOT NULL DEFAULT '{}',
  amenities JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  price_changes BOOLEAN NOT NULL DEFAULT true,
  new_locations BOOLEAN NOT NULL DEFAULT true,
  service_updates BOOLEAN NOT NULL DEFAULT true,
  weekly_digest BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  affordability_score INTEGER NOT NULL, -- 0-100
  cost_housing NUMERIC NOT NULL,
  cost_food NUMERIC NOT NULL,
  cost_transportation NUMERIC NOT NULL,
  cost_healthcare NUMERIC NOT NULL,
  cost_utilities NUMERIC NOT NULL,
  safety_score INTEGER NOT NULL, -- 0-100
  education_score INTEGER NOT NULL, -- 0-100
  healthcare_score INTEGER NOT NULL, -- 0-100
  environment_score INTEGER NOT NULL, -- 0-100
  unemployment_rate NUMERIC NOT NULL,
  median_income NUMERIC NOT NULL,
  job_growth_rate NUMERIC NOT NULL,
  walkability_score INTEGER NOT NULL, -- 0-100
  public_transit_score INTEGER NOT NULL, -- 0-100
  traffic_score INTEGER NOT NULL, -- 0-100
  bike_score INTEGER NOT NULL, -- 0-100
  review_count INTEGER NOT NULL DEFAULT 0,
  overall_rating NUMERIC NOT NULL DEFAULT 0, -- 0-5
  affordability_rating NUMERIC NOT NULL DEFAULT 0, -- 0-5
  safety_rating NUMERIC NOT NULL DEFAULT 0, -- 0-5
  transportation_rating NUMERIC NOT NULL DEFAULT 0, -- 0-5
  amenities_rating NUMERIC NOT NULL DEFAULT 0, -- 0-5
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  overall_rating INTEGER NOT NULL, -- 1-5
  affordability_rating INTEGER NOT NULL, -- 1-5
  safety_rating INTEGER NOT NULL, -- 1-5
  transportation_rating INTEGER NOT NULL, -- 1-5
  amenities_rating INTEGER NOT NULL, -- 1-5
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
);

-- Saved locations table
CREATE TABLE IF NOT EXISTS saved_locations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
  saved_at TIMESTAMP NOT NULL,
  UNIQUE(user_id, location_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);
CREATE INDEX IF NOT EXISTS idx_locations_state ON locations(state);
CREATE INDEX IF NOT EXISTS idx_locations_country ON locations(country);
CREATE INDEX IF NOT EXISTS idx_locations_affordability ON locations(affordability_score);
CREATE INDEX IF NOT EXISTS idx_reviews_location_id ON reviews(location_id);
CREATE INDEX IF NOT EXISTS idx_saved_locations_user_id ON saved_locations(user_id);