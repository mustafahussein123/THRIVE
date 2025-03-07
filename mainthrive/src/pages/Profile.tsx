import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Check, ChevronRight, LogOut, Trash2 } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  
  // Get user profile from localStorage or use default values
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    monthlyIncome: '4800',
    savings: '35000',
    housingPreference: 'Rent',
    householdSize: 2,
    language: 'English',
    remoteWork: true,
    amenities: {
      publicTransit: true,
      healthcare: true,
      parks: true,
      shopping: false,
      restaurants: true,
      schools: false,
      entertainment: true,
    },
    relocationTimeframe: '3-6 months',
    notificationPreferences: {
      priceChanges: true,
      newLocations: true,
      serviceUpdates: true,
      weeklyDigest: false,
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...profile});
  
  const updateAmenity = (amenity: string, value: boolean) => {
    setEditedProfile(prev => ({
      ...prev,
      amenities: { ...prev.amenities, [amenity]: value }
    }));
  };
  
  const updateNotificationPreference = (preference: string, value: boolean) => {
    setEditedProfile(prev => ({
      ...prev,
      notificationPreferences: { ...prev.notificationPreferences, [preference]: value }
    }));
  };
  
  const handleSave = () => {
    // Validate input data
    if (!editedProfile.monthlyIncome || isNaN(Number(editedProfile.monthlyIncome))) {
      alert('Please enter a valid monthly income.');
      return;
    }
    
    if (!editedProfile.savings || isNaN(Number(editedProfile.savings))) {
      alert('Please enter a valid savings amount.');
      return;
    }
    
    // Save changes
    setProfile(editedProfile);
    setIsEditing(false);
    
    // In a real app, this would make an API call to update the user profile
    alert('Your profile has been updated successfully.');
  };
  
  const handleCancel = () => {
    // Reset edited profile and exit edit mode
    setEditedProfile({...profile});
    setIsEditing(false);
  };
  
  const savedLocations = [
    { id: '1', city: 'Sacramento', state: 'CA', affordabilityScore: 72 },
    { id: '2', city: 'Portland', state: 'OR', affordabilityScore: 68 },
    { id: '3', city: 'Boise', state: 'ID', affordabilityScore: 78 },
  ];
  
  const renderProfileInfo = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>
          <button 
            onClick={() => setIsEditing(true)}
            className="text-green-600 hover:text-green-700"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <p className="text-gray-600">Name</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-800 font-semibold">{profile.name}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <p className="text-gray-600">Email</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-800 font-semibold">{profile.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <p className="text-gray-600">Monthly Income</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-800 font-semibold">${profile.monthlyIncome}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <p className="text-gray-600">Savings</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-800 font-semibold">${profile.savings}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <p className="text-gray-600">Household Size</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-800 font-semibold">{profile.householdSize} {profile.householdSize === 1 ? 'person' : 'people'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <p className="text-gray-600">Housing Preference</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-800 font-semibold">{profile.housingPreference}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <p className="text-gray-600">Remote Work</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-800 font-semibold">{profile.remoteWork ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3">
            <div className="col-span-1">
              <p className="text-gray-600">Timeframe</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-800 font-semibold">{profile.relocationTimeframe}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Desired Amenities</h2>
        
        <div className="space-y-2">
          {Object.entries(profile.amenities).map(([key, value]) => {
            // Convert camelCase to Title Case with spaces
            const readableKey = key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            
            return (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                <p className="text-gray-700">{readableKey}</p>
                <div 
                  className={`px-2 py-1 rounded-full ${
                    value ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                >
                  <p
                    className={value ? 'text-green-700' : 'text-gray-700'}
                  >
                    {value ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Notification Preferences</h2>
        
        <div className="space-y-2">
          {Object.entries(profile.notificationPreferences).map(([key, value]) => {
            // Convert camelCase to readable format
            const readableKey = key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            
            return (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                <p className="text-gray-700">{readableKey}</p>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                  <input
                    type="checkbox"
                    className="absolute w-6 h-6 opacity-0 cursor-pointer"
                    checked={value}
                    onChange={(e) => updateNotificationPreference(key, e.target.checked)}
                    disabled={!isEditing}
                  />
                  <span 
                    className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${value ? 'bg-green-500' : 'bg-gray-300'}`}
                  ></span>
                  <span 
                    className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform ${value ? 'translate-x-6' : 'translate-x-0'} shadow-md`}
                  ></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800">Saved Locations</h2>
          
          <button 
            onClick={() => navigate('/saved')}
            className="text-green-600 hover:text-green-700"
          >
            View All
          </button>
        </div>
        
        {savedLocations.map((location, index) => (
          <button 
            key={location.id}
            className={`w-full flex justify-between items-center py-3 text-left ${
              index < savedLocations.length - 1 ? 'border-b border-gray-100' : ''
            }`}
            onClick={() => navigate(`/location/${location.id}`, { state: { location } })}
          >
            <p className="text-gray-800 font-medium">{location.city}, {location.state}</p>
            <div className="flex items-center">
              <p 
                className={`font-semibold mr-1 ${
                  location.affordabilityScore >= 75 
                    ? 'text-green-600' 
                    : location.affordabilityScore >= 60 
                      ? 'text-yellow-600' 
                      : 'text-red-600'
                }`}
              >
                {location.affordabilityScore}%
              </p>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        ))}
      </div>
      
      <div className="space-y-2 my-4">
        <button 
          className="w-full bg-red-50 p-4 rounded-lg flex items-center justify-center hover:bg-red-100"
          onClick={() => {
            if (confirm('Are you sure you want to sign out?')) {
              // Sign out logic here
              navigate('/');
            }
          }}
        >
          <LogOut className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-600 font-semibold">Sign Out</span>
        </button>
        
        <button className="w-full p-4 flex items-center justify-center text-gray-500 hover:text-gray-700">
          Delete Account
        </button>
      </div>
    </div>
  );
  
  const renderEditProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Personal Information</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
            <input
              id="name"
              className="w-full bg-gray-100 p-3 rounded-lg text-gray-800"
              value={editedProfile.name}
              onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
            <input
              id="email"
              className="w-full bg-gray-100 p-3 rounded-lg text-gray-800"
              value={editedProfile.email}
              onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
              type="email"
            />
          </div>
          
          <div>
            <label htmlFor="monthlyIncome" className="block text-gray-700 mb-1">Monthly Income (USD)</label>
            <input
              id="monthlyIncome"
              className="w-full bg-gray-100 p-3 rounded-lg text-gray-800"
              value={editedProfile.monthlyIncome}
              onChange={(e) => setEditedProfile({...editedProfile, monthlyIncome: e.target.value})}
              type="number"
            />
          </div>
          
          <div>
            <label htmlFor="savings" className="block text-gray-700 mb-1">Savings (USD)</label>
            <input
              id="savings"
              className="w-full bg-gray-100 p-3 rounded-lg text-gray-800"
              value={editedProfile.savings}
              onChange={(e) => setEditedProfile({...editedProfile, savings: e.target.value})}
              type="number"
            />
          </div>
          
          <div>
            <label htmlFor="householdSize" className="block text-gray-700 mb-1">Household Size: {editedProfile.householdSize}</label>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">1</span>
              <input
                id="householdSize"
                type="range"
                min="1"
                max="10"
                step="1"
                value={editedProfile.householdSize}
                onChange={(e) => setEditedProfile({...editedProfile, householdSize: parseInt(e.target.value)})}
                className="w-4/5 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <span className="text-gray-600">10+</span>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Housing Preference</label>
            <div className="flex space-x-2">
              {['Rent', 'Buy', 'Either'].map(option => (
                <button 
                  key={option}
                  className={`py-2 px-4 rounded-full border ${
                    editedProfile.housingPreference === option 
                      ? 'bg-green-500 border-green-600 text-white' 
                      : 'bg-gray-100 border-gray-300 text-gray-700'
                  }`}
                  onClick={() => setEditedProfile({...editedProfile, housingPreference: option})}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="remoteWork" className="text-gray-700">Remote Work</label>
            <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
              <input
                id="remoteWork"
                type="checkbox"
                className="absolute w-6 h-6 opacity-0 cursor-pointer"
                checked={editedProfile.remoteWork}
                onChange={(e) => setEditedProfile({...editedProfile, remoteWork: e.target.checked})}
              />
              <span 
                className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${editedProfile.remoteWork ? 'bg-green-500' : 'bg-gray-300'}`}
              ></span>
              <span 
                className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform ${editedProfile.remoteWork ? 'translate-x-6' : 'translate-x-0'} shadow-md`}
              ></span>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Relocation Timeframe</label>
            <div className="space-y-1">
              {['ASAP', '3-6 months', '6-12 months', '1+ year', 'Just exploring'].map(option => (
                <button 
                  key={option}
                  className={`w-full p-3 rounded-lg border text-left ${
                    editedProfile.relocationTimeframe === option 
                      ? 'bg-green-100 border-green-300 text-green-700' 
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                  onClick={() => setEditedProfile({...editedProfile, relocationTimeframe: option})}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">Desired Amenities</h2>
        
        <div className="space-y-2">
          {Object.entries(editedProfile.amenities).map(([key, value]) => {
            // Convert camelCase to Title Case with spaces
            const readableKey = key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase());
            
            return (
              <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                <label htmlFor={`amenity-${key}`} className="text-gray-700">{readableKey}</label>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                  <input
                    id={`amenity-${key}`}
                    type="checkbox"
                    className="absolute w-6 h-6 opacity-0 cursor-pointer"
                    checked={value}
                    onChange={(e) => updateAmenity(key, e.target.checked)}
                  />
                  <span 
                    className={`block w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${value ? 'bg-green-500' : 'bg-gray-300'}`}
                  ></span>
                  <span 
                    className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out transform ${value ? 'translate-x-6' : 'translate-x-0'} shadow-md`}
                  ></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-between mt-4 mb-8">
        <button
          className="bg-gray-200 py-3 px-6 rounded-lg text-gray-700 hover:bg-gray-300"
          onClick={handleCancel}
        >
          Cancel
        </button>
        
        <button
          className="bg-green-500 py-3 px-6 rounded-lg text-white hover:bg-green-600"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)}
                className="mr-4 text-gray-600 hover:text-green-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-green-600 hover:text-green-700"
              >
                <Pencil className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-2">
            <span className="text-4xl text-gray-400">
              {profile.name.charAt(0)}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
          <div className="bg-green-100 px-3 py-1 rounded-full mt-1">
            <p className="text-green-700 font-medium">Premium Member</p>
          </div>
        </div>
        
        {isEditing ? renderEditProfile() : renderProfileInfo()}
      </main>
    </div>
  );
};

export default Profile;