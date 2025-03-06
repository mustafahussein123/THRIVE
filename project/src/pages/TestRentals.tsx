import React, { useEffect, useState } from 'react';
import ApiService from '../services/ApiService';
import { ZillowRental } from '../types';

const TestRentals: React.FC = () => {
  const [rentals, setRentals] = useState<ZillowRental[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        // Adjust the city and state as needed for testing
        const data = await ApiService.getZillowRentals('Los Angeles', 'CA');
        setRentals(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchRentals();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Test Zillow Rentals</h1>
      {error && <p className="text-red-600 mb-4">Error: {error}</p>}
      {rentals.length > 0 ? (
        <ul className="space-y-2">
          {rentals.map(rental => (
            <li key={rental.id} className="p-4 bg-white rounded shadow">
              <p className="font-semibold">{rental.address}</p>
              <p className="text-sm text-gray-600">{rental.addressCity}, {rental.addressState}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rentals found.</p>
      )}
    </div>
  );
};

export default TestRentals;
