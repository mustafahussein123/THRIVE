// src/components/NearbyPlacesSearch.tsx
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface LatLng {
  latitude: number;
  longitude: number;
}

interface PlaceResult {
  displayName: string;
  location: any; // could be a LatLng object or literal
  businessStatus?: string;
}

// Helper functions to extract latitude and longitude from the location object
const getLatitude = (location: any): number | string => {
  if (!location) return "";
  return typeof location.lat === "function" ? location.lat() : location.lat;
};

const getLongitude = (location: any): number | string => {
  if (!location) return "";
  return typeof location.lng === "function" ? location.lng() : location.lng;
};

const API_KEY = "AIzaSyBZvEgs2k3KF1EObX1qZ8KFSgrPxz3kSEY";

const NearbyPlacesSearch: React.FC = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedType, setSelectedType] = useState("restaurant");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      if (isNaN(lat) || isNaN(lng)) {
        setError("Please enter valid latitude and longitude values.");
        setLoading(false);
        return;
      }

      // Create a LatLng object using the Google Maps API
      const center = new google.maps.LatLng(lat, lng);
      // Import the places library using the new importLibrary approach
      const { Place, SearchNearbyRankPreference } = await google.maps.importLibrary("places");

      // Create a request with a 1-mile (1609 meters) radius
      const request = {
        fields: ["displayName", "location", "businessStatus"],
        locationRestriction: {
          center: center,
          radius: 1609,
        },
        includedPrimaryTypes: [selectedType],
        maxResultCount: 10,
        rankPreference: SearchNearbyRankPreference.POPULARITY,
        language: "en-US",
        region: "us",
      };

      //@ts-ignore
      const { places } = await Place.searchNearby(request);
      setResults(places);
    } catch (err: any) {
      console.error("Error fetching nearby places:", err);
      setError("Error fetching nearby places.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Nearby Places Search</h1>
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Latitude</label>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="Enter latitude"
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Longitude</label>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="Enter longitude"
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Select Place Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="restaurant">Restaurants</option>
            <option value="gym">Gyms</option>
            <option value="park">Parks</option>
            <option value="library">Libraries</option>
            <option value="school">Schools</option>
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
        >
          Search Nearby
        </button>
        {loading && <p className="mt-4 text-center">Searching...</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        {results.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <ul className="space-y-4">
              {results.map((place, index) => (
                <li key={index} className="p-3 bg-white rounded-lg shadow">
                  <p className="font-semibold">{place.displayName}</p>
                  <p className="text-sm text-gray-600">
                    Lat: {getLatitude(place.location)}, Lng: {getLongitude(place.location)}
                  </p>
                  {place.businessStatus && (
                    <p className="text-sm text-gray-500">{place.businessStatus}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyPlacesSearch;
