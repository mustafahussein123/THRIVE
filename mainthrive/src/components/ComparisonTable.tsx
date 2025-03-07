import React from 'react';
import { Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Location } from '../types';

interface ComparisonTableProps {
  locations: Location[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ locations }) => {
  if (!locations || locations.length === 0) {
    return <div className="text-center text-gray-500">No locations selected for comparison</div>;
  }

  // Categories for comparison
  const comparisonCategories = [
    { 
      title: 'Overall Scores',
      items: [
        { name: 'Affordability Score', key: 'affordabilityScore', suffix: '%', higher: 'better' },
      ]
    },
    { 
      title: 'Monthly Costs',
      items: [
        { name: 'Housing', key: 'costBreakdown.housing', prefix: '$', lower: 'better' },
        { name: 'Food', key: 'costBreakdown.food', prefix: '$', lower: 'better' },
        { name: 'Transportation', key: 'costBreakdown.transportation', prefix: '$', lower: 'better' },
        { name: 'Healthcare', key: 'costBreakdown.healthcare', prefix: '$', lower: 'better' },
        { name: 'Utilities', key: 'costBreakdown.utilities', prefix: '$', lower: 'better' },
      ]
    },
    {
      title: 'Quality of Life',
      items: [
        { name: 'Safety', key: 'qualityOfLife.safety', suffix: '%', higher: 'better' },
        { name: 'Education', key: 'qualityOfLife.education', suffix: '%', higher: 'better' },
        { name: 'Healthcare', key: 'qualityOfLife.healthcare', suffix: '%', higher: 'better' },
        { name: 'Environment', key: 'qualityOfLife.environment', suffix: '%', higher: 'better' },
      ]
    },
    {
      title: 'Job Market',
      items: [
        { name: 'Unemployment Rate', key: 'jobMarket.unemployment', suffix: '%', lower: 'better' },
        { name: 'Median Income', key: 'jobMarket.medianIncome', prefix: '$', higher: 'better', format: 'number' },
        { name: 'Job Growth Rate', key: 'jobMarket.growthRate', suffix: '%', higher: 'better' },
      ]
    }
  ];

  // Helper function to get nested properties from an object
  const getNestedProperty = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  };

  // Determine which value is better (lower or higher)
  const getBetterValue = (values: any[], criteria: 'lower' | 'higher') => {
    if (!values.length) return null;
    if (values.length === 1) return 0; // If only one value, it's the best
    
    // Filter out any null/undefined values
    const validValues = values.filter(v => v !== null && v !== undefined);
    if (!validValues.length) return null;
    
    // Sort based on criteria
    const sortedIndices = validValues
      .map((val, idx) => ({ val, idx }))
      .sort((a, b) => {
        if (criteria === 'lower') {
          return a.val - b.val;
        } else { // higher is better
          return b.val - a.val;
        }
      })
      .map(item => item.idx);
    
    return sortedIndices[0]; // Return index of best value
  };

  // Format value based on type
  const formatValue = (value: any, format?: string, prefix?: string, suffix?: string) => {
    if (value === null || value === undefined) return '-';
    
    let formattedValue = value;
    
    if (format === 'number') {
      formattedValue = value.toLocaleString();
    }
    
    return `${prefix || ''}${formattedValue}${suffix || ''}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-xl overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Comparison
            </th>
            {locations.map(location => (
              <th 
                key={location.id}
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {location.city}, {location.state}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {comparisonCategories.map(category => (
            <React.Fragment key={category.title}>
              <tr className="bg-gray-50">
                <td 
                  colSpan={locations.length + 1} 
                  className="px-6 py-3 text-left text-sm font-medium text-gray-700"
                >
                  {category.title}
                </td>
              </tr>
              {category.items.map(item => {
                const values = locations.map(location => getNestedProperty(location, item.key));
                const betterValueIndex = item.lower 
                  ? getBetterValue(values, 'lower') 
                  : getBetterValue(values, 'higher');

                return (
                  <tr key={item.key} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.name}
                    </td>
                    
                    {locations.map((location, index) => {
                      const value = getNestedProperty(location, item.key);
                      const isBest = index === betterValueIndex && locations.length > 1;
                      
                      return (
                        <td 
                          key={location.id} 
                          className="px-6 py-4 whitespace-nowrap text-sm text-center"
                        >
                          <div className="flex items-center justify-center">
                            {isBest && <Star className="w-4 h-4 text-yellow-400 mr-1" />}
                            <span className={isBest ? 'font-semibold text-green-600' : 'text-gray-700'}>
                              {formatValue(value, item.format, item.prefix, item.suffix)}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
          
          <tr className="bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
              Total Monthly Cost
            </td>
            {locations.map(location => {
              const totalCost = Object.values(location.costBreakdown).reduce((a, b) => a + b, 0);
              
              return (
                <td 
                  key={location.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-green-600"
                >
                  ${totalCost}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
      
      <div className="mt-4 bg-blue-50 p-4 rounded-xl">
        <p className="text-blue-800 text-sm text-center">
          <Star className="w-4 h-4 text-yellow-400 inline mr-1" />
          Items marked with a star indicate the better option when comparing costs or scores.
        </p>
      </div>
    </div>
  );
};

export default ComparisonTable;