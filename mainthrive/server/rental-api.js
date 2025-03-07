import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Create or load sample data
async function createSampleData() {
  const filePath = path.join(__dirname, '../zillow_rentals.json');
  
  try {
    // Check if file exists
    await fs.access(filePath);
    
    // Load existing data
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or can't be read, create sample data
    console.log("Creating sample zillow_rentals.json file");
    
    const sampleData = [
      {
        "zpid": "1001",
        "id": "1001",
        "imgSrc": "https://photos.zillowstatic.com/fp/4a6a5752a93c3c5a1133d281bcd9c1b9-p_e.jpg",
        "detailUrl": "https://www.zillow.com/homedetails/123-Main-St-San-Francisco-CA-94101/1001_zpid/",
        "address": "123 Main St, San Francisco, CA 94101",
        "addressStreet": "123 Main St",
        "addressCity": "San Francisco",
        "addressState": "CA",
        "addressZipcode": "94101",
        "units": [
          {
            "price": "$2,750",
            "beds": "2",
            "roomForRent": false
          }
        ],
        "latLong": {
          "latitude": 37.7749,
          "longitude": -122.4194
        },
        "buildingName": "Main Street Apartments",
        "isBuilding": true
      }
    ];
    
    // Save sample data to file
    await fs.writeFile(filePath, JSON.stringify(sampleData, null, 2));
    return sampleData;
  }
}

// Initialize data and model
let rentalsData = [];

// Load data on startup
createSampleData().then(data => {
  rentalsData = data;
  console.log(`Loaded ${rentalsData.length} rental listings`);
});

// API Routes
// Get rentals by city and state
app.get('/api/rentals', (req, res) => {
  const { city, state } = req.query;
  
  // Filter rentals by city and state
  const filteredRentals = rentalsData.filter(rental => 
    (!city || rental.addressCity.toLowerCase().includes(city.toLowerCase())) &&
    (!state || rental.addressState === state.toUpperCase())
  );
  
  res.json(filteredRentals.slice(0, 40)); // Limit to 20 results
});

// Generate personalized recommendations
app.post('/api/scoring/recommendations', (req, res) => {
  const {
    city,
    state,
    income = 50000,
    savings = 10000,
    household_size = 1,
    healthcare_required = false,
    housing_budget_percentage = "less-than-30",
    transportation_preference = "car",
    amenities = {}
  } = req.body;
  
  if (!city || !state) {
    return res.status(400).json({ error: "City and State are required" });
  }
  
  // Filter rentals by city and state
  const filteredRentals = rentalsData.filter(rental => 
    (!city || rental.addressCity.toLowerCase().includes(city.toLowerCase())) &&
    (!state || rental.addressState === state.toUpperCase())
  );
  
  // Calculate affordability score (simple example)
  const affordabilityScore = Math.min(10, Math.max(1, (income / 50000) * 5));
  
  res.json({
    city,
    state,
    affordability_score: Number(affordabilityScore.toFixed(2)),
    recommendations: filteredRentals
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Rental API server running on port ${PORT}`);
});