import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LocationDetails from './pages/LocationDetails';
import CompareLocations from './pages/CompareLocations';
import SavedLocations from './pages/SavedLocations';
import Onboarding from './pages/Onboarding';
import OnboardingChoice from './pages/OnboardingChoice';
import DecisionTree from './pages/DecisionTree';
import DecisionTreeResults from './pages/DecisionTreeResults';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import MLDashboard from './pages/Admin/MLDashboard';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/location/:id" element={<LocationDetails />} />
          <Route path="/compare" element={<CompareLocations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding-choice" element={<OnboardingChoice />} />
          <Route path="/decision-tree" element={<DecisionTree />} />
          <Route path="/decision-tree-results" element={<DecisionTreeResults />} />
          
          {/* Protected routes */}
          <Route path="/saved" element={<PrivateRoute><SavedLocations /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/admin/ml-dashboard" element={<PrivateRoute><MLDashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;