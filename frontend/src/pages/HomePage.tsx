import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { Link as RouterLink } from 'react-router-dom';
import ParkingMap from '../components/ParkingMap';
import { useEffect, useState } from 'react';
import { fetchParkingLocations } from '../services/api';
import { ParkingLocation } from '../types/parking';

const HomePage: React.FC = () => {
  const [locations, setLocations] = useState<ParkingLocation[]>([]);

  useEffect(() => {
    fetchParkingLocations().then(setLocations).catch(() => setLocations([]));
  }, []);

  return (
    <Box>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
        gap={4}
        alignItems="center"
      >
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Smarter parking for busy Melbourne families
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Real-time availability, predictions, and accessible options in the CBD—
            helping working parents save time and reduce stress.
          </Typography>
          <Box display="flex" gap={2} mt={2}>
            <Button variant="contained" size="large" component={RouterLink} to="/map">
              View Parking Near Me
            </Button>
            <Button variant="outlined" size="large" component={RouterLink} to="/learn-more">
              Learn More
            </Button>
          </Box>
        </Box>

        <Box>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Today at a glance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Peak congestion expected 8:00–9:30 AM and 4:30–6:00 PM
              <br />• Best off-street options near Collins St and Queen St
              <br />• Family-friendly bays near Federation Square available
            </Typography>
          </Paper>
          <ParkingMap locations={locations} height={340} />
        </Box>
      </Box>

      <Box
        mt={4}
        display="grid"
        gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }}
        gap={3}
      >
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6">Real-time availability</Typography>
          <Typography variant="body2" color="text.secondary">
            Live updates from CBD parking sensors and car parks.
          </Typography>
        </Paper>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6">Smart predictions</Typography>
          <Typography variant="body2" color="text.secondary">
            Plan ahead with time-of-day and event-based forecasts.
          </Typography>
        </Paper>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6">Family-focused</Typography>
          <Typography variant="body2" color="text.secondary">
            Highlight childcare-friendly zones and accessible bays.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default HomePage;


