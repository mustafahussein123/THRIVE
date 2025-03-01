import requests
from config import ZILLOW_API_KEY

BASE_URL = "https://zillow-com1.p.rapidapi.com"

HEADERS = {
    "X-RapidAPI-Key": ZILLOW_API_KEY,
    "X-RapidAPI-Host": "zillow-com1.p.rapidapi.com"
}

def search_properties(city, state, home_type="Houses"):
    """Fetch multiple property listings for a given city and state."""
    url = f"{BASE_URL}/propertyExtendedSearch"
    params = {"location": f"{city}, {state}", "home_type": home_type}

    try:
        response = requests.get(url, headers=HEADERS, params=params)
        response.raise_for_status()  # Raise error for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Zillow API request failed: {str(e)}"}

def get_property_details(zpid):
    """Fetch detailed info for a specific property using zpid."""
    url = f"{BASE_URL}/property"
    params = {"zpid": zpid}

    try:
        response = requests.get(url, headers=HEADERS, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Zillow API request failed: {str(e)}"}

# Quick test
if __name__ == "__main__":
    print(search_properties("Los Angeles", "CA"))
