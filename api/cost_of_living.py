import requests
from config import COST_OF_LIVING_API_KEY

def get_cost_of_living(city, country):
    """Fetch cost of living data for a given city."""
    url = "https://cost-of-living-and-prices.p.rapidapi.com/prices"
    headers = {
        "X-RapidAPI-Key": COST_OF_LIVING_API_KEY,
        "X-RapidAPI-Host": "cost-of-living-and-prices.p.rapidapi.com"
    }
    params = {"city_name": city, "country_name": country}

    response = requests.get(url, headers=headers, params=params)
    return response.json() if response.status_code == 200 else {"error": response.status_code}

if __name__ == "__main__":
    print(get_cost_of_living("Los Angeles", "United States"))
