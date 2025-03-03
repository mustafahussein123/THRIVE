import os
import pandas as pd
import numpy as np
from affordability_model import AffordabilityModel
from recommendation_model import RecommendationModel
from data_utils import fetch_locations_data

def main():
    """Train affordability and recommendation models"""
    print("Starting model training...")
    
    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)
    
    # Fetch location data
    print("Fetching location data...")
    locations_df = fetch_locations_data()
    
    if locations_df is None or len(locations_df) < 5:
        print("Insufficient data for training. Using synthetic data...")
        # Generate synthetic data for demonstration
        locations_df = generate_synthetic_data(50)
    
    print(f"Training with {len(locations_df)} locations")
    
    # Train affordability model
    print("Training affordability model...")
    affordability_model = AffordabilityModel()
    affordability_success = affordability_model.train(locations_df)
    
    if affordability_success:
        print("Affordability model trained successfully!")
    else:
        print("Affordability model training failed. Using rule-based scoring.")
    
    # Train recommendation model
    print("Training recommendation model...")
    recommendation_model = RecommendationModel()
    recommendation_success = recommendation_model.train(locations_df)
    
    if recommendation_success:
        print("Recommendation model trained successfully!")
    else:
        print("Recommendation model training failed. Using rule-based recommendations.")
    
    print("Model training complete!")

def generate_synthetic_data(n_samples=50):
    """Generate synthetic location data for training"""
    np.random.seed(42)
    
    # Generate random cities and states
    cities = ['Springfield', 'Riverside', 'Oakwood', 'Maplewood', 'Cedar Creek', 
              'Pine Valley', 'Lakeside', 'Mountain View', 'Greenfield', 'Fairview']
    
    states = ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI']
    
    # Generate synthetic data
    data = []
    for i in range(n_samples):
        city_idx = i % len(cities)
        state_idx = i % len(states)
        
        location = {
            'id': i + 1,
            'city': cities[city_idx],
            'state': states[state_idx],
            'country': 'USA',
            'latitude': np.random.uniform(25, 48),
            'longitude': np.random.uniform(-125, -70),
            'affordability_score': np.random.randint(40, 95),
            'cost_housing': np.random.uniform(800, 3000),
            'cost_food': np.random.uniform(300, 600),
            'cost_transportation': np.random.uniform(100, 400),
            'cost_healthcare': np.random.uniform(200, 500),
            'cost_utilities': np.random.uniform(100, 300),
            'safety_score': np.random.randint(50, 95),
            'education_score': np.random.randint(50, 95),
            'healthcare_score': np.random.randint(50, 95),
            'environment_score': np.random.randint(50, 95),
            'unemployment_rate': np.random.uniform(2.5, 8.0),
            'median_income': np.random.uniform(40000, 100000),
            'job_growth_rate': np.random.uniform(1.0, 5.0),
            'walkability_score': np.random.randint(30, 95),
            'public_transit_score': np.random.randint(20, 95),
            'traffic_score': np.random.randint(30, 95),
            'bike_score': np.random.randint(30, 95),
            'created_at': '2023-01-01 00:00:00',
            'updated_at': '2023-01-01 00:00:00'
        }
        
        data.append(location)
    
    return pd.DataFrame(data)

if __name__ == "__main__":
    main()