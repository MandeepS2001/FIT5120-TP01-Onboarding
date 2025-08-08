import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import LearnMorePage from './pages/LearnMorePage';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

const App: React.FC = () => {
  return (
    <Box display="flex" minHeight="100vh" flexDirection="column">
      <AppHeader />
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/learn-more" element={<LearnMorePage />} />
        </Routes>
      </Container>
      <AppFooter />
    </Box>
  );
};

export default App;
