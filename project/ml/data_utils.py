import os
import pandas as pd
import numpy as np
import psycopg2
from psycopg2.extras import RealDictCursor
from sklearn.preprocessing import StandardScaler, OneHotEncoder
import joblib
from config import DB_CONFIG, SCALING_FEATURES, CATEGORICAL_FEATURES, MODEL_DIR

# Ensure model directory exists
os.makedirs(MODEL_DIR, exist_ok=True)

def connect_to_db():
    """Establish connection to PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            database=DB_CONFIG['database']
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def fetch_locations_data():
    """Fetch location data from database"""
    conn = connect_to_db()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT * FROM locations
        """
        cursor.execute(query)
        locations = cursor.fetchall()
        return pd.DataFrame(locations)
    except Exception as e:
        print(f"Error fetching location data: {e}")
        return None
    finally:
        if conn:
            cursor.close()
            conn.close()

def fetch_user_profile(user_id):
    """Fetch user profile data from database"""
    conn = connect_to_db()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        query = """
        SELECT * FROM user_profiles WHERE user_id = %s
        """
        cursor.execute(query, (user_id,))
        profile = cursor.fetchone()
        return profile
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        return None
    finally:
        if conn:
            cursor.close()
            conn.close()

def preprocess_location_data(df):
    """Preprocess location data for model training"""
    if df is None or df.empty:
        return None
    
    # Handle missing values
    df = df.fillna({
        'cost_housing': df['cost_housing'].median(),
        'cost_food': df['cost_food'].median(),
        'cost_transportation': df['cost_transportation'].median(),
        'cost_healthcare': df['cost_healthcare'].median(),
        'cost_utilities': df['cost_utilities'].median(),
        'median_income': df['median_income'].median(),
        'unemployment_rate': df['unemployment_rate'].median(),
        'job_growth_rate': df['job_growth_rate'].median()
    })
    
    # Create a copy to avoid modifying the original dataframe
    processed_df = df.copy()
    
    # Scale numerical features
    scaler = StandardScaler()
    if all(feature in processed_df.columns for feature in SCALING_FEATURES):
        processed_df[SCALING_FEATURES] = scaler.fit_transform(processed_df[SCALING_FEATURES])
        # Save the scaler for future use
        joblib.dump(scaler, os.path.join(MODEL_DIR, 'scaler.joblib'))
    
    # One-hot encode categorical features
    for feature in CATEGORICAL_FEATURES:
        if feature in processed_df.columns:
            encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
            encoded_features = encoder.fit_transform(processed_df[[feature]])
            feature_names = [f"{feature}_{val}" for val in encoder.categories_[0]]
            encoded_df = pd.DataFrame(encoded_features, columns=feature_names)
            processed_df = pd.concat([processed_df, encoded_df], axis=1)
            processed_df = processed_df.drop(feature, axis=1)
            # Save the encoder for future use
            joblib.dump(encoder, os.path.join(MODEL_DIR, f'{feature}_encoder.joblib'))
    
    return processed_df

def calculate_monthly_budget(income, housing_budget_preference):
    """Calculate monthly housing budget based on income and preference"""
    monthly_income = income / 12
    
    if housing_budget_preference == 'less-than-30':
        budget_percentage = 0.25
    elif housing_budget_preference == '30-40':
        budget_percentage = 0.35
    else:  # '40-plus'
        budget_percentage = 0.45
    
    return monthly_income * budget_percentage

def save_prediction_to_db(user_id, location_id, affordability_score, match_score):
    """Save prediction results to database"""
    conn = connect_to_db()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        query = """
        INSERT INTO user_recommendations 
        (user_id, location_id, affordability_score, match_score, created_at)
        VALUES (%s, %s, %s, %s, NOW())
        ON CONFLICT (user_id, location_id) 
        DO UPDATE SET 
            affordability_score = EXCLUDED.affordability_score,
            match_score = EXCLUDED.match_score,
            created_at = NOW()
        """
        cursor.execute(query, (user_id, location_id, affordability_score, match_score))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error saving prediction to database: {e}")
        conn.rollback()
        return False
    finally:
        if conn:
            cursor.close()
            conn.close()