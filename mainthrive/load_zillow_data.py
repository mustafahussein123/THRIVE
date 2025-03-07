import json
import os

def load_zillow_data():
    """
    Load Zillow rental data from JSON file and save it to a format
    that can be used by the Flask application.
    """
    try:
        # Check if the file exists
        if not os.path.exists('zillow_rentals.json'):
            print("Error: zillow_rentals.json file not found")
            return False
        
        # Load the data
        with open('zillow_rentals.json', 'r') as f:
            data = json.load(f)
        
        print(f"Successfully loaded {len(data)} rental listings")
        
        # Basic validation
        if not isinstance(data, list):
            print("Error: Data is not in the expected format (should be a list)")
            return False
        
        # Check a sample entry
        if len(data) > 0:
            sample = data[0]
            required_fields = ['zpid', 'id', 'address', 'addressCity', 'addressState', 'units']
            missing_fields = [field for field in required_fields if field not in sample]
            
            if missing_fields:
                print(f"Warning: Sample entry is missing required fields: {', '.join(missing_fields)}")
        
        # Save the data back (this step is optional but ensures the file is properly formatted)
        with open('zillow_rentals.json', 'w') as f:
            json.dump(data, f)
        
        print("Data processing complete")
        return True
        
    except Exception as e:
        print(f"Error processing Zillow data: {str(e)}")
        return False

if __name__ == "__main__":
    load_zillow_data()