import requests
import subprocess
from config import GOOGLE_HEALTHCARE_PROJECT_ID

def get_google_access_token():
    """Retrieve OAuth 2.0 access token from Google Cloud CLI."""
    result = subprocess.run(
        ["gcloud", "auth", "print-access-token"],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
    )
    return result.stdout.strip()

def get_healthcare_data(region="us-central1"):
    """Fetch healthcare pricing and provider data."""
    access_token = get_google_access_token()  # Get a fresh token
    url = f"https://healthcare.googleapis.com/v1/projects/{GOOGLE_HEALTHCARE_PROJECT_ID}/locations/{region}/datasets"
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        return {"error": f"Google Healthcare API request failed: {response.status_code}"}

if __name__ == "__main__":
    print(get_healthcare_data())