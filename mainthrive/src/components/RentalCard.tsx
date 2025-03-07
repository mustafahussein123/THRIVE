// src/components/RentalCard.tsx
import React from 'react';
import { MapPin, DollarSign, Users, ExternalLink } from 'lucide-react';
import { ZillowRental } from '../types';

interface RentalCardProps {
  rental: ZillowRental;
  monthlyBudget: number;
}

const RentalCard: React.FC<RentalCardProps> = ({ rental, monthlyBudget }) => {
  const formatPrice = (priceString: string) => {
    const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ''));
    return isNaN(numericPrice) ? 'Price unavailable' : `$${numericPrice.toLocaleString()}`;
  };
  
  const isWithinBudget = (priceString: string) => {
    const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ''));
    if (isNaN(numericPrice)) return false;
    return numericPrice <= monthlyBudget;
  };

  const getLowestPrice = () => {
    if (!rental.units || rental.units.length === 0) return null;
    let lowestPrice = Number.MAX_VALUE;
    let lowestPriceString = '';
    rental.units.forEach(unit => {
      const price = parseFloat(unit.price.replace(/[^0-9.]/g, ''));
      if (!isNaN(price) && price < lowestPrice) {
        lowestPrice = price;
        lowestPriceString = unit.price;
      }
    });
    return lowestPriceString || null;
  };

  const lowestPrice = getLowestPrice();

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        {rental.imgSrc && (
          <img 
            src={rental.imgSrc} 
            alt={rental.buildingName || rental.address} 
            className="w-full h-48 object-cover"
          />
        )}
        {rental.badgeInfo && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
            {rental.badgeInfo.text}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <MapPin className="w-5 h-5 mr-1 text-green-600" />
              {rental.buildingName || rental.addressStreet}
            </h3>
            <p className="text-gray-500 text-sm">{rental.address}</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-4 relative">
            <div className={`w-16 h-16 rounded-full ${lowestPrice && isWithinBudget(lowestPrice) ? 'bg-green-500' : 'bg-yellow-400'} opacity-20 absolute`}></div>
            <DollarSign className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Starting at</p>
            <p className={`text-xl font-bold ${lowestPrice && isWithinBudget(lowestPrice) ? 'text-green-600' : 'text-gray-800'}`}>
              {lowestPrice ? formatPrice(lowestPrice) : 'Contact for pricing'}
            </p>
          </div>
        </div>

        {/* Display Coordinates */}
        <div className="mt-4 text-xs text-gray-500">
          <p>Latitude: {rental.latLong.latitude}</p>
          <p>Longitude: {rental.latLong.longitude}</p>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-blue-500 mr-2" />
              <div>
                <p className="text-xs text-gray-600">Unit Types</p>
                <p className="font-semibold text-gray-800">
                  {rental.units && rental.units.length > 0 
                    ? rental.units.map(u => u.beds).join(', ') + ' Bed'
                    : 'Various'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-purple-500 mr-2" />
              <div>
                <p className="text-xs text-gray-600">Location</p>
                <p className="font-semibold text-gray-800">
                  {rental.addressCity}, {rental.addressState}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <a
            href={rental.detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
          >
            View on Zillow
          </a>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
