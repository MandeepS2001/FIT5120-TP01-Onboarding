import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import DataInsightsPage from './pages/DataInsightsPage';
import AppHeader from './components/AppHeader';

const App: React.FC = () => {
  return (
    <Box display="flex" minHeight="100vh" flexDirection="column">
      <AppHeader />
      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/data-insights" element={<DataInsightsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
