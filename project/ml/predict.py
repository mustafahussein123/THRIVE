import sys
import json
import pandas as pd
from affordability_model import AffordabilityModel
from recommendation_model import RecommendationModel
from data_utils import fetch_locations_data, fetch_user_profile, save_prediction_to_db

def predict_affordability(location_data):
    """Predict affordability score for a location"""
    model = AffordabilityModel()
    
    # Try to load trained model
    if not model.load():
        print("No trained model found. Using rule-based scoring.")
    
    # Convert to DataFrame if it's a dict
    if isinstance(location_data, dict):
        location_data = pd.DataFrame([location_data])
    
    # Make prediction
    scores = model.predict(location_data)
    
    # Get categories
    categories = [model.get_affordability_category(score) for score in scores]
    
    return scores, categories

def generate_recommendations(user_id):
    """Generate location recommendations for a user"""
    # Fetch user profile
    user_profile = fetch_user_profile(user_id)
    
    if user_profile is None:
        print(f"User profile not found for user ID: {user_id}")
        return None
    
    # Fetch location data
    locations_df = fetch_locations_data()
    
    if locations_df is None:
        print("No location data available.")
        return None
    
    # Initialize recommendation model
    model = RecommendationModel()
    
    # Try to load trained model
    if not model.load():
        print("No trained model found. Using rule-based recommendations.")
    
    # Generate recommendations
    recommendations = model.predict(user_profile, locations_df)
    
    # Save predictions to database
    for _, location in recommendations.iterrows():
        save_prediction_to_db(
            user_id, 
            location['id'], 
            location['affordability_score'], 
            location['match_score']
        )
    
    return recommendations

def main():
    """Main function to handle prediction requests"""
    if len(sys.argv) < 2:
        print("Usage: python predict.py <command> [args]")
        print("Commands:")
        print("  affordability <location_id>")
        print("  recommendations <user_id>")
        return
    
    command = sys.argv[1]
    
    if command == "affordability" and len(sys.argv) >= 3:
        location_id = sys.argv[2]
        
        # Fetch location data
        locations_df = fetch_locations_data()
        
        if locations_df is None:
            print("No location data available.")
            return
        
        # Filter for the requested location
        location_data = locations_df[locations_df['id'] == int(location_id)]
        
        if len(location_data) == 0:
            print(f"Location not found with ID: {location_id}")
            return
        
        # Predict affordability
        scores, categories = predict_affordability(location_data)
        
        # Output results
        result = {
            "location_id": int(location_id),
            "affordability_score": float(scores[0]),
            "affordability_category": categories[0]
        }
        
        print(json.dumps(result))
        
    elif command == "recommendations" and len(sys.argv) >= 3:
        user_id = sys.argv[2]
        
        # Generate recommendations
        recommendations = generate_recommendations(int(user_id))
        
        if recommendations is None:
            print(json.dumps({"error": "Failed to generate recommendations"}))
            return
        
        # Format results
        results = []
        for _, location in recommendations.head(10).iterrows():
            results.append({
                "location_id": int(location['id']),
                "city": location['city'],
                "state": location['state'],
                "match_score": float(location['match_score']),
                "affordability_score": float(location['affordability_score'])
            })
        
        print(json.dumps({"recommendations": results}))
        
    else:
        print("Invalid command or missing arguments.")
        print("Usage: python predict.py <command> [args]")
        print("Commands:")
        print("  affordability <location_id>")
        print("  recommendations <user_id>")

if __name__ == "__main__":
    main()