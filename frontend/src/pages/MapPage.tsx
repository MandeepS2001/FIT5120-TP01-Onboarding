import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import ParkingMap from '../components/ParkingMap';
import { ParkingLocation } from '../types/parking';
import { fetchParkingLocations } from '../services/api';
import Container from '@mui/material/Container';
import { colors } from '../theme';

const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  


  useEffect(() => {
    fetchParkingLocations().then((locations) => {
      console.log('Loaded parking locations:', locations.length, locations);
      setLocations(locations);
    }).catch((error) => {
      console.error('Error loading parking locations:', error);
      setLocations([]);
    });
  }, []);

  const filtered = useMemo(() => {
    return locations;
  }, [locations]);



  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pt: { xs: 12, md: 16 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 4, md: 5 } }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            mb: 4,
            background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[600]} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Parking Map
        </Typography>







        <ParkingMap locations={filtered} height={560} />
        
        {/* Parking Legend */}
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.paper' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Parking Availability Legend
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: '#4CAF50',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
              <Typography variant="body2">Good availability (&gt;50%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: '#FF9800',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
              <Typography variant="body2">Moderate availability (20-50%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: '#FF5722',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
              <Typography variant="body2">Low availability (1-20%)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: '#FF4444',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              />
              <Typography variant="body2">No availability (0%)</Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MapPage;


