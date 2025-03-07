import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DB_CONFIG = {
    'user': os.getenv('DB_USER', 'postgres'),
    'password': os.getenv('DB_PASSWORD', 'postgres'),
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'thrive')
}

# Model paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')
AFFORDABILITY_MODEL_PATH = os.path.join(MODEL_DIR, 'affordability_model.joblib')
RECOMMENDATION_MODEL_PATH = os.path.join(MODEL_DIR, 'recommendation_model.joblib')

# Feature weights for affordability score calculation
AFFORDABILITY_WEIGHTS = {
    'cost_housing': 0.4,
    'cost_food': 0.15,
    'cost_transportation': 0.15,
    'cost_healthcare': 0.15,
    'cost_utilities': 0.15
}

# Feature weights for recommendation score calculation
RECOMMENDATION_WEIGHTS = {
    'affordability_score': 0.35,
    'safety_score': 0.15,
    'education_score': 0.1,
    'healthcare_score': 0.1,
    'environment_score': 0.1,
    'job_growth_rate': 0.1,
    'walkability_score': 0.05,
    'public_transit_score': 0.05
}

# Thresholds for affordability classification
AFFORDABILITY_THRESHOLDS = {
    'excellent': 80,
    'good': 60,
    'moderate': 40,
    'poor': 20
}

# Data preprocessing parameters
SCALING_FEATURES = [
    'cost_housing', 'cost_food', 'cost_transportation', 
    'cost_healthcare', 'cost_utilities', 'median_income',
    'unemployment_rate', 'job_growth_rate'
]

# Categorical features for one-hot encoding
CATEGORICAL_FEATURES = ['state', 'country']