import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve API keys securely from environment variables (correct keys!)
ZILLOW_API_KEY = os.getenv("ZILLOW_API_KEY")
PILOTERR_API_KEY = os.getenv("PILOTERR_API_KEY")
COST_OF_LIVING_API_KEY = os.getenv("COST_OF_LIVING_API_KEY")
CENSUS_API_KEY = os.getenv("CENSUS_API_KEY")
HEALTHCARE_API_KEY = os.getenv("HEALTHCARE_API_KEY")
GOOGLE_HEALTHCARE_PROJECT_ID = os.getenv("GOOGLE_HEALTHCARE_PROJECT_ID")