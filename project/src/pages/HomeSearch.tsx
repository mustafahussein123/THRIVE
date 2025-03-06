// HomeSearch.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import ApiService from '../services/ApiService';

const API_KEY = "AIzaSyBZvEgs2k3KF1EObX1qZ8KFSgrPxz3kSEY";

interface Rental {
  id: string;
  address: string;
  addressCity: string;
  addressState: string;
  latLong: {
    latitude: number;
    longitude: number;
  };
  // Other fields can be added as needed.
}

async function geocodeAddress(address: string): Promise<{lat: number, lng: number}> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`
  );
  const data = await response.json();
  if (data.status === "OK" && data.results.length > 0) {
    return data.results[0].geometry.location;
  }
  throw new Error("Geocoding failed: " + data.status);
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  const distanceMiles = distanceKm * 0.621371;
  return distanceMiles;
}

const HomeSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get the geographic coordinates for the search term
      const { lat, lng } = await geocodeAddress(searchTerm);
      console.log("Coordinates:", lat, lng);

      // Fetch all rental listings from your backend (zillow_rentals.json)
      const rentals: Rental[] = await ApiService.getRentals();
      
      // Filter rentals that are within a 500-meter radius (~0.31 miles)
      const nearbyRentals = rentals.filter(rental => {
        if (!rental.latLong) return false;
        const distance = haversineDistance(
          lat, lng,
          rental.latLong.latitude,
          rental.latLong.longitude
        );
        return distance <= 1; // 0.31 miles is roughly 500 meters
      });
      
      setSearchResults(nearbyRentals);
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (rental: Rental) => {
    navigate(`/location/${rental.id}`, { state: { location: rental } });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-green-600">Thrive</h1>
      </header>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <div className="absolute pl-3">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Enter address, city, or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow pl-10 p-4 outline-none border-none"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 text-white px-4 py-2"
          >
            Search
          </button>
        </div>
        {loading && <p className="mt-4 text-center">Searching...</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
        {searchResults.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <ul className="space-y-4">
              {searchResults.map(rental => (
                <li
                  key={rental.id}
                  className="p-4 bg-white rounded-lg shadow cursor-pointer hover:bg-gray-100"
                  onClick={() => handleResultClick(rental)}
                >
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                    <div>
                      <p className="font-semibold">{rental.address}</p>
                      <p className="text-sm text-gray-600">
                        {rental.addressCity}, {rental.addressState}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeSearch;
