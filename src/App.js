import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CitySelector from './pages/CitySelector';
import CityDetails from './pages/CityDetails';
import { loadAllCities } from './utils/cityLoader';
import './App.css';

function App() {
  const [citiesLoaded, setCitiesLoaded] = useState(false);

  useEffect(() => {
    // Load all cities on app startup
    loadAllCities().then(() => {
      setCitiesLoaded(true);
    });
  }, []);

  if (!citiesLoaded) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitySelector />} />
        <Route path="/cities/:slug" element={<CityDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
