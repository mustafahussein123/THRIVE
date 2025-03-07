# app.py
import json
import os
import numpy as np

# Create a sample zillow_rentals.json file if it doesn't exist
def create_sample_data():
    if not os.path.exists('zillow_rentals.json'):
        print("Creating sample zillow_rentals.json file")
        sample_data = [
            {
                "zpid": "1001",
                "id": "1001",
                "imgSrc": "https://photos.zillowstatic.com/fp/4a6a5752a93c3c5a1133d281bcd9c1b9-p_e.jpg",
                "detailUrl": "https://www.zillow.com/homedetails/123-Main-St-San-Francisco-CA-94101/1001_zpid/",
                "address": "123 Main St, San Francisco, CA 94101",
                "addressCity": "San Francisco",
                "addressState": "CA",
                "addressZipcode": "94101",
                "units": [
                    {
                        "price": "$2,750",
                        "beds": "2",
                        "roomForRent": False
                    }
                ],
                "latLong": {
                    "latitude": 37.7749,
                    "longitude": -122.4194
                },
                "buildingName": "Main Street Apartments",
                "isBuilding": True
            }
        ]
        
        with open('zillow_rentals.json', 'w') as f:
            json.dump(sample_data, f)
        return sample_data
    else:
        try:
            with open('zillow_rentals.json', 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading zillow_rentals.json: {e}")
            return []

# Load Zillow rentals data
rentals_data = create_sample_data()

# Sample training data for affordability scoring (example)
X_train = np.array([
    [30000, 5000, 1],
    [60000, 20000, 2],
    [120000, 50000, 4]
])
y_train = np.array([4.5, 7.0, 9.5])  # Affordability scores

class SimpleModel:
    def fit(self, X, y):
        self.X = X
        self.y = y
        
    def predict(self, X):
        predictions = []
        for x in X:
            distances = np.sum((self.X - x) ** 2, axis=1)
            closest_idx = np.argmin(distances)
            predictions.append(self.y[closest_idx])
        return np.array(predictions)

model = SimpleModel()
model.fit(X_train, y_train)

def handle_rentals_request(city=None, state=None):
    filtered_rentals = [
        rental for rental in rentals_data 
        if (not city or city.lower() in rental.get('addressCity', '').lower()) and 
           (not state or state.upper() == rental.get('addressState', ''))
    ]
    return filtered_rentals

def handle_recommendations_request(data):
    """
    Generate personalized housing recommendations.
    Expects data with keys: city, state, income, savings, household_size,
    healthcare_required, housing_budget_percentage, transportation_preference, amenities.
    """
    if not data:
        return {"error": "No input data provided"}, 400

    city = data.get("city")
    state = data.get("state")
    if not city or not state:
        return {"error": "City and State are required"}, 400

    income = float(data.get("income", 50000))
    savings = float(data.get("savings", 10000))
    household_size = int(data.get("household_size", 1))
    healthcare_required = bool(data.get("healthcare_required", False))
    housing_budget_percentage = data.get("housing_budget_percentage", "less-than-30")
    transportation_preference = data.get("transportation_preference", "car")
    amenities = data.get("amenities", {})

    # Calculate monthly income and housing budget.
    monthly_income = income / 12.0
    # Define budget factor based on housing_budget_percentage
    budget_factors = {"less-than-30": 0.3, "30-40": 0.4, "40-plus": 0.5}
    factor = budget_factors.get(housing_budget_percentage, 0.3)
    monthly_budget = monthly_income * factor

    # Use the simple model to get an affordability score (this can be enhanced)
    features = np.array([[income, savings, household_size]])
    affordability_score = float(model.predict(features)[0])

    # Get rentals for the specified city and state
    filtered_rentals = handle_rentals_request(city, state)
    
    # Filter rentals by checking if at least one unit's price is within the monthly budget.
    affordable_rentals = []
    for rental in filtered_rentals:
        if "units" in rental and rental["units"]:
            for unit in rental["units"]:
                price_str = unit.get("price", "")
                try:
                    # Extract numeric part from price string, e.g. "$2,750" -> 2750
                    price = float(price_str.replace("$", "").replace(",", "").strip())
                    if price <= monthly_budget:
                        affordable_rentals.append(rental)
                        break  # At least one unit is affordable; include rental once.
                except Exception as e:
                    print(f"Error parsing price: {e}")
    
    # For demonstration, we attach the affordability score to the response.
    return {
        "city": city,
        "state": state,
        "affordability_score": round(affordability_score, 2),
        "monthly_budget": monthly_budget,
        "recommendations": affordable_rentals[:20]  # Limit to 20 results
    }

# Simple HTTP server using BaseHTTPRequestHandler
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json

class RentalAPIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        if parsed_path.path == '/api/rentals':
            params = parse_qs(parsed_path.query)
            city = params.get('city', [None])[0]
            state = params.get('state', [None])[0]
            results = handle_rentals_request(city, state)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(results).encode())
            return
        self.send_response(404)
        self.end_headers()
    
    def do_POST(self):
        if self.path == '/api/scoring/recommendations':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode())
            result = handle_recommendations_request(data)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())
            return
        self.send_response(404)
        self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server(port=5001):
    server_address = ('', port)
    httpd = HTTPServer(server_address, RentalAPIHandler)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
