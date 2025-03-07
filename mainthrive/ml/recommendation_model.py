import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
import joblib
import os
from config import RECOMMENDATION_WEIGHTS, RECOMMENDATION_MODEL_PATH
from data_utils import fetch_locations_data, fetch_user_profile, preprocess_location_data

class RecommendationModel:
    """Model for generating personalized location recommendations"""
    
    def __init__(self):
        self.model = None
        self.kmeans = None
        self.weights = RECOMMENDATION_WEIGHTS
    
    def calculate_match_score(self, location, user_profile):
        """Calculate match score based on user preferences and location attributes"""
        match_score = 0
        
        # Housing budget match
        monthly_income = user_profile['income'] / 12
        if user_profile['housing_budget_preference'] == 'less-than-30':
            budget_percentage = 0.25
        elif user_profile['housing_budget_preference'] == '30-40':
            budget_percentage = 0.35
        else:  # '40-plus'
            budget_percentage = 0.45
        
        housing_budget = monthly_income * budget_percentage
        
        # Score based on how well location's housing cost matches budget
        if location['cost_housing'] <= housing_budget:
            match_score += 30
        elif location['cost_housing'] <= housing_budget * 1.2:
            match_score += 20
        elif location['cost_housing'] <= housing_budget * 1.5:
            match_score += 10
        
        # Healthcare importance
        if user_profile['requires_healthcare'] and location['healthcare_score'] >= 75:
            match_score += 15
        elif user_profile['requires_healthcare'] and location['healthcare_score'] >= 60:
            match_score += 10
        elif user_profile['requires_healthcare']:
            match_score += 5
        
        # Transportation preference
        if user_profile['transportation_preference'] == 'public-transit' and location['public_transit_score'] >= 70:
            match_score += 15
        elif user_profile['transportation_preference'] == 'bike-walking' and location['walkability_score'] >= 70:
            match_score += 15
        elif user_profile['transportation_preference'] == 'car' and location['traffic_score'] >= 70:
            match_score += 15
        
        # Safety importance
        if user_profile['safety_importance'] == 'very-important' and location['safety_score'] >= 80:
            match_score += 20
        elif user_profile['safety_importance'] == 'somewhat-important' and location['safety_score'] >= 70:
            match_score += 10
        
        # Normalize to 0-100 scale
        match_score = min(100, match_score)
        
        return match_score
    
    def train(self, locations_df=None, user_profiles_df=None):
        """Train the recommendation model using location data and user profiles"""
        if locations_df is None:
            # Fetch data if not provided
            locations_df = fetch_locations_data()
            
        if locations_df is None or len(locations_df) < 10:
            print("Insufficient location data for training.")
            return False
        
        # Preprocess location data
        processed_df = preprocess_location_data(locations_df)
        
        # If we don't have enough user profiles, use clustering to create user segments
        if user_profiles_df is None or len(user_profiles_df) < 10:
            print("Insufficient user profile data. Using clustering to create user segments.")
            
            # Select features for clustering
            cluster_features = [
                'affordability_score', 'safety_score', 'education_score', 
                'healthcare_score', 'walkability_score', 'public_transit_score'
            ]
            
            # Ensure all features exist
            valid_features = [f for f in cluster_features if f in locations_df.columns]
            
            if len(valid_features) < 3:
                print("Insufficient features for clustering.")
                return False
            
            # Perform K-means clustering
            self.kmeans = KMeans(n_clusters=5, random_state=42)
            locations_df['cluster'] = self.kmeans.fit_predict(locations_df[valid_features])
            
            # Save the clustering model
            joblib.dump(self.kmeans, os.path.join(os.path.dirname(RECOMMENDATION_MODEL_PATH), 'kmeans_model.joblib'))
            
            # Train a classifier to predict which cluster a user would prefer
            # For now, we'll use a simple random forest classifier
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
            
            # Create synthetic user preferences based on clusters
            synthetic_users = []
            for cluster in range(5):
                # Get locations in this cluster
                cluster_locations = locations_df[locations_df['cluster'] == cluster]
                
                # Create synthetic user preferences based on cluster averages
                for _ in range(10):  # Create 10 synthetic users per cluster
                    user = {
                        'income': np.random.uniform(40000, 120000),
                        'housing_budget_preference': np.random.choice(['less-than-30', '30-40', '40-plus']),
                        'requires_healthcare': np.random.choice([True, False]),
                        'transportation_preference': np.random.choice(['car', 'public-transit', 'bike-walking']),
                        'safety_importance': np.random.choice(['very-important', 'somewhat-important', 'not-important']),
                        'preferred_cluster': cluster
                    }
                    synthetic_users.append(user)
            
            synthetic_users_df = pd.DataFrame(synthetic_users)
            
            # Train the model to predict preferred cluster
            X = synthetic_users_df.drop('preferred_cluster', axis=1)
            y = synthetic_users_df['preferred_cluster']
            
            # One-hot encode categorical features
            X_encoded = pd.get_dummies(X)
            
            self.model.fit(X_encoded, y)
            
            # Save the model
            os.makedirs(os.path.dirname(RECOMMENDATION_MODEL_PATH), exist_ok=True)
            joblib.dump(self.model, RECOMMENDATION_MODEL_PATH)
            
            return True
        else:
            # If we have enough user profiles, train a more sophisticated model
            # This would be implemented in a real-world scenario
            print("Training with real user profiles not implemented yet.")
            return False
    
    def load(self):
        """Load trained models from disk"""
        try:
            self.model = joblib.load(RECOMMENDATION_MODEL_PATH)
            kmeans_path = os.path.join(os.path.dirname(RECOMMENDATION_MODEL_PATH), 'kmeans_model.joblib')
            if os.path.exists(kmeans_path):
                self.kmeans = joblib.load(kmeans_path)
            return True
        except:
            print(f"No trained models found at {RECOMMENDATION_MODEL_PATH}")
            return False
    
    def predict(self, user_profile, locations_df=None):
        """Generate location recommendations for a user"""
        if locations_df is None:
            # Fetch data if not provided
            locations_df = fetch_locations_data()
            
        if locations_df is None:
            print("No location data available.")
            return []
        
        # If we have a trained model, use it
        if self.model is not None and self.kmeans is not None:
            # Prepare user profile for prediction
            user_features = {
                'income': user_profile['income'],
                'housing_budget_preference': user_profile['housing_budget_preference'],
                'requires_healthcare': user_profile['requires_healthcare'],
                'transportation_preference': user_profile['transportation_preference'],
                'safety_importance': user_profile['safety_importance']
            }
            
            # Convert to DataFrame and one-hot encode
            user_df = pd.DataFrame([user_features])
            user_encoded = pd.get_dummies(user_df)
            
            # Ensure all columns from training are present
            expected_columns = self.model.feature_names_in_
            for col in expected_columns:
                if col not in user_encoded.columns:
                    user_encoded[col] = 0
            
            # Reorder columns to match training data
            user_encoded = user_encoded[expected_columns]
            
            # Predict preferred cluster
            preferred_cluster = self.model.predict(user_encoded)[0]
            
            # Get locations in preferred cluster
            cluster_features = [
                'affordability_score', 'safety_score', 'education_score', 
                'healthcare_score', 'walkability_score', 'public_transit_score'
            ]
            
            # Ensure all features exist
            valid_features = [f for f in cluster_features if f in locations_df.columns]
            
            # Predict clusters for all locations
            locations_df['cluster'] = self.kmeans.predict(locations_df[valid_features])
            
            # Filter locations by preferred cluster
            recommended_locations = locations_df[locations_df['cluster'] == preferred_cluster]
            
            # Calculate match scores for recommended locations
            match_scores = []
            for _, location in recommended_locations.iterrows():
                match_score = self.calculate_match_score(location, user_profile)
                match_scores.append(match_score)
            
            recommended_locations['match_score'] = match_scores
            
            # Sort by match score
            recommended_locations = recommended_locations.sort_values('match_score', ascending=False)
            
            return recommended_locations
        else:
            # Fall back to rule-based recommendations
            match_scores = []
            for _, location in locations_df.iterrows():
                match_score = self.calculate_match_score(location, user_profile)
                match_scores.append(match_score)
            
            locations_df['match_score'] = match_scores
            
            # Sort by match score
            recommended_locations = locations_df.sort_values('match_score', ascending=False)
            
            return recommended_locations