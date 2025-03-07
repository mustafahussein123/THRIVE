import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const { Pool } = pg;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'thrive'
});

// Sample data
const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123'
  }
];

const locations = [
  {
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    latitude: 30.2672,
    longitude: -97.7431,
    affordability_score: 72,
    cost_housing: 1500,
    cost_food: 400,
    cost_transportation: 200,
    cost_healthcare: 300,
    cost_utilities: 150,
    safety_score: 80,
    education_score: 85,
    healthcare_score: 82,
    environment_score: 78,
    unemployment_rate: 3.5,
    median_income: 72000,
    job_growth_rate: 3.2,
    walkability_score: 65,
    public_transit_score: 45,
    traffic_score: 60,
    bike_score: 70
  },
  {
    city: 'Denver',
    state: 'CO',
    country: 'USA',
    latitude: 39.7392,
    longitude: -104.9903,
    affordability_score: 65,
    cost_housing: 1700,
    cost_food: 450,
    cost_transportation: 180,
    cost_healthcare: 320,
    cost_utilities: 170,
    safety_score: 75,
    education_score: 82,
    healthcare_score: 85,
    environment_score: 90,
    unemployment_rate: 3.8,
    median_income: 68000,
    job_growth_rate: 2.8,
    walkability_score: 70,
    public_transit_score: 60,
    traffic_score: 55,
    bike_score: 75
  },
  {
    city: 'Raleigh',
    state: 'NC',
    country: 'USA',
    latitude: 35.7796,
    longitude: -78.6382,
    affordability_score: 78,
    cost_housing: 1300,
    cost_food: 380,
    cost_transportation: 170,
    cost_healthcare: 290,
    cost_utilities: 140,
    safety_score: 82,
    education_score: 88,
    healthcare_score: 80,
    environment_score: 85,
    unemployment_rate: 3.2,
    median_income: 65000,
    job_growth_rate: 3.5,
    walkability_score: 55,
    public_transit_score: 40,
    traffic_score: 75,
    bike_score: 60
  },
  {
    city: 'Sacramento',
    state: 'CA',
    country: 'USA',
    latitude: 38.5816,
    longitude: -121.4944,
    affordability_score: 68,
    cost_housing: 1800,
    cost_food: 450,
    cost_transportation: 300,
    cost_healthcare: 350,
    cost_utilities: 180,
    safety_score: 72,
    education_score: 75,
    healthcare_score: 78,
    environment_score: 80,
    unemployment_rate: 3.8,
    median_income: 68000,
    job_growth_rate: 2.9,
    walkability_score: 65,
    public_transit_score: 55,
    traffic_score: 60,
    bike_score: 70
  },
  {
    city: 'Portland',
    state: 'OR',
    country: 'USA',
    latitude: 45.5152,
    longitude: -122.6784,
    affordability_score: 62,
    cost_housing: 1950,
    cost_food: 480,
    cost_transportation: 250,
    cost_healthcare: 370,
    cost_utilities: 190,
    safety_score: 75,
    education_score: 82,
    healthcare_score: 85,
    environment_score: 90,
    unemployment_rate: 4.1,
    median_income: 70000,
    job_growth_rate
  }
]