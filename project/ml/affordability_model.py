import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
import os
from config import AFFORDABILITY_WEIGHTS, AFFORDABILITY_MODEL_PATH, AFFORDABILITY_THRESHOLDS
from data_utils import fetch_locations_data, preprocess_location_data

class AffordabilityModel:
    """Model for calculating and predicting affordability scores"""
    
    def __init__(self):
        self.model = None
        self.weights = AFFORDABILITY_WEIGHTS
        self.thresholds = AFFORDABILITY_THRESHOLDS
    
    def calculate_affordability_score(self, location_data):
        """Calculate affordability score based on cost factors and weights"""
        if isinstance(location_data, dict):
            # Convert single location dict to DataFrame
            location_data = pd.DataFrame([location_data])
        
        # Normalize costs (lower is better)
        normalized_costs = {}
        for cost_factor, weight in self.weights.items():
            if cost_factor in location_data.columns:
                # Get min and max values for normalization
                min_val = location_data[cost_factor].min()
                max_val = location_data[cost_factor].max()
                
                # Avoid division by zero
                if max_val == min_val:
                    normalized_costs[cost_factor] = 1.0
                else:
                    # Invert so lower costs get higher scores (1 - normalized value)
                    normalized_costs[cost_factor] = 1 - ((location_data[cost_factor] - min_val) / (max_val - min_val))
        
        # Calculate weighted score
        affordability_scores = np.zeros(len(location_data))
        for cost_factor, weight in self.weights.items():
            if cost_factor in normalized_costs:
                affordability_scores += normalized_costs[cost_factor] * weight
        
        # Scale to 0-100
        affordability_scores = affordability_scores * 100
        
        return affordability_scores
    
    def train(self, locations_df=None):
        """Train the affordability prediction model"""
        if locations_df is None:
            # Fetch data if not provided
            locations_df = fetch_locations_data()
            
        if locations_df is None or len(locations_df) < 10:
            print("Insufficient data for training. Using rule-based scoring instead.")
            return False
        
        # Preprocess data
        processed_df = preprocess_location_data(locations_df)
        
        # Calculate target affordability scores using rule-based approach
        target_scores = self.calculate_affordability_score(locations_df)
        
        # Select features for training
        features = [col for col in processed_df.columns if col not in 
                   ['id', 'city', 'affordability_score', 'created_at', 'updated_at']]
        
        X = processed_df[features]
        y = target_scores
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)
        
        # Evaluate model
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        print(f"Model trained. R² on training data: {train_score:.4f}, R² on test data: {test_score:.4f}")
        
        # Save model
        os.makedirs(os.path.dirname(AFFORDABILITY_MODEL_PATH), exist_ok=True)
        joblib.dump(self.model, AFFORDABILITY_MODEL_PATH)
        
        return True
    
    def load(self):
        """Load trained model from disk"""
        try:
            self.model = joblib.load(AFFORDABILITY_MODEL_PATH)
            return True
        except:
            print(f"No trained model found at {AFFORDABILITY_MODEL_PATH}")
            return False
    
    def predict(self, location_data):
        """Predict affordability score for new locations"""
        # If model is trained, use it for prediction
        if self.model is not None:
            # Preprocess the data
            processed_data = preprocess_location_data(location_data)
            
            # Select features for prediction
            features = [col for col in processed_data.columns if col not in 
                       ['id', 'city', 'affordability_score', 'created_at', 'updated_at']]
            
            # Make prediction
            predictions = self.model.predict(processed_data[features])
            return predictions
        else:
            # Fall back to rule-based calculation
            return self.calculate_affordability_score(location_data)
    
    def get_affordability_category(self, score):
        """Convert numerical score to category"""
        if score >= self.thresholds['excellent']:
            return 'excellent'
        elif score >= self.thresholds['good']:
            return 'good'
        elif score >= self.thresholds['moderate']:
            return 'moderate'
        elif score >= self.thresholds['poor']:
            return 'poor'
        else:
            return 'very poor'