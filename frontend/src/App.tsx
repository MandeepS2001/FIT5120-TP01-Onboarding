import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import LearnMorePage from './pages/LearnMorePage';
import DataInsightsPage from './pages/DataInsightsPage';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

const App: React.FC = () => {
  return (
    <Box display="flex" minHeight="100vh" flexDirection="column">
      <AppHeader />
      <Box sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/learn-more" element={<LearnMorePage />} />
          <Route path="/data-insights" element={<DataInsightsPage />} />
        </Routes>
      </Box>
      <AppFooter />
    </Box>
  );
};

export default App;
