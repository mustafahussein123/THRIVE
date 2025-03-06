# Thrive - Affordability-Based Relocation Recommendations

Thrive is a comprehensive application that provides personalized, affordability-based relocation recommendations to help users find their ideal location based on their financial situation, preferences, and needs.

## Tech Stack

### Backend
- **Node.js & Express**: RESTful API server
- **PostgreSQL**: Relational database for structured data storage
- **JWT**: Authentication and authorization
- **Flask**: Python backend for ML scoring and data processing

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Recharts**: Charting library for data visualization

### Machine Learning & Data Analysis
- **Python**: Core AI and affordability scoring
- **Scikit-learn**: Affordability score calculations and decision trees
- **NumPy**: Data manipulation and numerical computations

## Features

- **User Authentication**: Secure registration and login
- **Personalized Recommendations**: Location suggestions based on user preferences
- **Affordability Analysis**: Detailed cost breakdowns for different locations
- **Location Comparison**: Side-by-side comparison of multiple locations
- **Decision Tree**: Guided question-based approach to refine recommendations
- **Rental Questionnaire**: Find rental properties based on your preferences
- **Zillow Integration**: Real rental data from Zillow
- **User Reviews & Ratings**: Community insights on locations
- **Saved Locations**: Ability to save and track favorite locations
- **Responsive Design**: Works on both desktop and mobile devices

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/thrive.git
cd thrive
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=thrive

# JWT Secret
JWT_SECRET=your_jwt_secret

# API Keys
COST_OF_LIVING_API_KEY=your_api_key_here
CENSUS_API_KEY=your_api_key_here
HEALTHCARE_API_KEY=your_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
```

4. Install Python dependencies
```bash
pip install -r requirements.txt
```

5. Load Zillow data
```bash
python load_zillow_data.py
```

6. Start the Flask server
```bash
flask run --port=5001
```

7. Start the development server
```bash
# In a separate terminal
npm run dev
```

8. Open your browser and navigate to `http://localhost:5173`

## Using the Rental Questionnaire

1. Click on "Find Rental Properties with Our Questionnaire" on the home page
2. Fill out the questionnaire with your preferences:
   - Location (city and state)
   - Financial information
   - Household size
   - Healthcare needs
   - Transportation preferences
   - Desired amenities
3. Click "Find Rentals" to see personalized recommendations
4. View detailed information about each rental property
5. Click "View on Zillow" to see the original listing

## Project Structure

```
thrive/
├── server/                 # Node.js backend code
│   ├── db/                 # Database scripts and migrations
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
├── src/                    # React frontend code
│   ├── components/         # Reusable React components
│   ├── context/            # React context providers
│   ├── pages/              # Page components
│   ├── services/           # API service functions
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Entry point
├── ml/                     # Machine learning code
│   ├── models/             # Trained ML models
│   └── data_utils.py       # Data processing utilities
├── app.py                  # Flask application for ML scoring
├── load_zillow_data.py     # Script to load Zillow rental data
├── zillow_rentals.json     # Zillow rental data
├── public/                 # Static assets
├── .env                    # Environment variables
└── package.json            # Project dependencies and scripts
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.