import requests
from config import CENSUS_API_KEY

def get_income_by_county(state):
    """Fetch median household income for a state."""
    url = f"https://api.census.gov/data/2022/acs/acs5?get=B19013_001E,NAME&for=county:*&in=state:{state}&key={CENSUS_API_KEY}"

    response = requests.get(url)
    return response.json() if response.status_code == 200 else {"error": response.status_code}

if __name__ == "__main__":
    print(get_income_by_county("06"))  # 06 = California
