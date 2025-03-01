import requests
from config import PILOTERR_API_KEY

def get_apartments(city, state, max_price):
    """Fetch available apartments based on location and budget."""
    url = "https://api.piloterr.com/apartments-search"
    headers = {"Authorization": f"Bearer {PILOTERR_API_KEY}"}
    params = {"city": city, "state": state, "max_price": max_price}

    response = requests.get(url, headers=headers, params=params)
    return response.json() if response.status_code == 200 else {"error": response.status_code}

if __name__ == "__main__":
    print(get_apartments("San Francisco", "CA", 2500))
