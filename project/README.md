# Thrive - Affordability-Based Relocation Recommendations

Thrive is a comprehensive application that provides personalized, affordability-based relocation recommendations to help users find their ideal location based on their financial situation, preferences, and needs.

## Tech Stack

### Backend
- **Node.js & Express**: RESTful API server
- **PostgreSQL**: Relational database for structured data storage
- **JWT**: Authentication and authorization

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling

### Machine Learning & Data Analysis (Future Implementation)
- **Python**: Core AI and affordability scoring
- **TensorFlow/PyTorch**: Predictive modeling
- **Scikit-learn**: Affordability score calculations and clustering
- **Pandas & NumPy**: Data manipulation and numerical computations

## Features

- **User Authentication**: Secure registration and login
- **Personalized Recommendations**: Location suggestions based on user preferences
- **Affordability Analysis**: Detailed cost breakdowns for different locations
- **Location Comparison**: Side-by-side comparison of multiple locations
- **Decision Tree**: Guided question-based approach to refine recommendations
- **User Reviews & Ratings**: Community insights on locations
- **Saved Locations**: Ability to save and track favorite locations
- **Responsive Design**: Works on both desktop and mobile devices

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
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
```

4. Set up the database
```bash
# Create the database
createdb thrive

# Run the schema script
psql -d thrive -f server/db/schema.sql

# Seed the database with sample data
node server/db/seed.js
```

5. Start the development server
```bash
# Start the backend server
npm run dev:server

# In a separate terminal, start the frontend
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
thrive/
├── server/                 # Backend code
│   ├── db/                 # Database scripts and migrations
│   ├── middleware/         # Express middleware
│   ├── routes/             # API routes
│   └── index.js            # Server entry point
├── src/                    # Frontend code
│   ├── components/         # Reusable React components
│   ├── context/            # React context providers
│   ├── pages/              # Page components
│   ├── services/           # API service functions
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main App component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── .env                    # Environment variables
└── package.json            # Project dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user
- `GET /api/auth/me`: Get current user

### Locations
- `GET /api/locations`: Get all locations
- `GET /api/locations/:id`: Get location by ID
- `GET /api/locations/recommendations/profile`: Get recommended locations based on user profile
- `POST /api/locations/compare`: Compare locations
- `POST /api/locations/save`: Save location for a user
- `GET /api/locations/saved/user`: Get saved locations for a user
- `DELETE /api/locations/saved/:locationId`: Remove saved location

### User Profile
- `GET /api/profile`: Get user profile
- `POST /api/profile`: Create or update user profile
- `GET /api/profile/notifications`: Get notification preferences
- `POST /api/profile/notifications`: Update notification preferences

### Reviews
- `GET /api/reviews/location/:locationId`: Get reviews for a location
- `POST /api/reviews`: Add a review
- `PUT /api/reviews/:reviewId`: Update a review
- `DELETE /api/reviews/:reviewId`: Delete a review

## Future Enhancements

- **Machine Learning Integration**: Implement AI-based personalization and prediction
- **Real-time Housing Market Updates**: Integrate with real estate APIs
- **Mobile App**: Develop native mobile applications
- **Social Features**: Allow users to connect and share recommendations
- **Advanced Filtering**: More detailed search and filtering options
- **Internationalization**: Support for multiple languages and countries

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data sources for cost of living and housing market information
- Open-source libraries and frameworks that made this project possible