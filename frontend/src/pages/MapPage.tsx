import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ParkingMap from '../components/ParkingMap';
import { ParkingLocation, ParkingType } from '../types/parking';
import { fetchParkingLocations } from '../services/api';
import Container from '@mui/material/Container';

const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<ParkingType | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(20);
  const [onlyAccessible, setOnlyAccessible] = useState(false);
  const [onlyFamilyFriendly, setOnlyFamilyFriendly] = useState(false);
  
  // Planner state
  const [plannedDateTime, setPlannedDateTime] = useState<Date | null>(new Date());
  const [isPlannerActive, setIsPlannerActive] = useState(false);
  const [predictedAvailability, setPredictedAvailability] = useState<{
    good: number;
    moderate: number;
    low: number;
    none: number;
    total: number;
  } | null>(null);

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
    return locations.filter((l) => {
      if (query && !l.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (type !== 'all' && l.type !== type) return false;
      if (onlyAccessible && !l.accessible) return false;
      if (onlyFamilyFriendly && !l.familyFriendly) return false;
      if (l.pricePerHour && l.pricePerHour > maxPrice) return false;
      return true;
    });
  }, [locations, query, type, onlyAccessible, onlyFamilyFriendly, maxPrice]);

  // Predict parking availability based on time
  const predictAvailability = (dateTime: Date) => {
    const hour = dateTime.getHours();
    const dayOfWeek = dateTime.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
    
    let good = 0, moderate = 0, low = 0, none = 0;
    
    filtered.forEach(location => {
      let availabilityRate = location.available / (location.capacity || 1) * 100;
      
      // Adjust based on time patterns
      if (isWeekend) {
        // Weekends generally have better availability
        availabilityRate *= 1.3;
      } else if (isPeakHour) {
        // Peak hours have worse availability
        availabilityRate *= 0.6;
      } else if (hour >= 22 || hour <= 6) {
        // Late night/early morning has better availability
        availabilityRate *= 1.5;
      }
      
      // Ensure availability stays within bounds
      availabilityRate = Math.max(0, Math.min(100, availabilityRate));
      
      if (availabilityRate > 50) good++;
      else if (availabilityRate > 20) moderate++;
      else if (availabilityRate > 0) low++;
      else none++;
    });
    
    return { good, moderate, low, none, total: filtered.length };
  };

  const handlePlannerToggle = () => {
    setIsPlannerActive(!isPlannerActive);
    if (!isPlannerActive && plannedDateTime) {
      setPredictedAvailability(predictAvailability(plannedDateTime));
    } else {
      setPredictedAvailability(null);
    }
  };

  const handleDateTimeChange = (newDateTime: Date | null) => {
    setPlannedDateTime(newDateTime);
    if (newDateTime && isPlannerActive) {
      setPredictedAvailability(predictAvailability(newDateTime));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 4, md: 6 } }}>
              <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 4, md: 5 } }}>
        <Typography variant="h4" gutterBottom>
          Parking Map
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Filter parking by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ minWidth: 240 }}
            />
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="on_street">On-street</MenuItem>
                <MenuItem value="off_street">Off-street</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ minWidth: 240 }}>
              <Typography variant="body2" color="text.secondary">
                Max price per hour: ${maxPrice}
              </Typography>
              <Slider
                value={maxPrice}
                onChange={(_, v) => setMaxPrice(v as number)}
                min={0}
                max={30}
                step={1}
              />
            </Box>
            <FormControlLabel
              control={<Switch checked={onlyAccessible} onChange={(e) => setOnlyAccessible(e.target.checked)} />}
              label="Accessible only"
            />
            <FormControlLabel
              control={<Switch checked={onlyFamilyFriendly} onChange={(e) => setOnlyFamilyFriendly(e.target.checked)} />}
              label="Family-friendly only"
            />
          </Stack>
        </Paper>

        <Box sx={{ mb: 2, p: 2, bgcolor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.200' }}>
          <Typography variant="body2" color="info.700">
            💡 <strong>Search Tips:</strong> Use the filters above to find specific parking locations, or use the search bar below the map to find any location in Melbourne and center the map on it.
          </Typography>
        </Box>

        {/* Parking Planner Section */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <EventIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold">
              Parking Planner
            </Typography>
            <Chip 
              label={isPlannerActive ? "Active" : "Inactive"} 
              color={isPlannerActive ? "success" : "default"}
              size="small"
            />
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Plan your CBD visit and see predicted parking availability for any date and time. Our AI analyzes historical patterns to help you choose the best time to park.
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
              <DateTimePicker
                label="When are you planning to park?"
                value={plannedDateTime}
                onChange={handleDateTimeChange}
                disablePast
                slotProps={{
                  textField: {
                    sx: { minWidth: 280 },
                    disabled: !isPlannerActive
                  }
                }}
              />
              
              <Button
                variant={isPlannerActive ? "outlined" : "contained"}
                onClick={handlePlannerToggle}
                startIcon={<TrendingUpIcon />}
                sx={{ 
                  px: 3, 
                  py: 1.5,
                  minWidth: 140,
                  borderRadius: 2
                }}
              >
                {isPlannerActive ? "Disable Planner" : "Enable Planner"}
              </Button>
            </Stack>
          </LocalizationProvider>

          {/* Prediction Results */}
          {isPlannerActive && predictedAvailability && (
            <Card sx={{ mt: 3, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <AccessTimeIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Predicted Availability for {plannedDateTime?.toLocaleDateString()} at {plannedDateTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                  <Chip 
                    label={`${predictedAvailability.good} Good (${Math.round(predictedAvailability.good / predictedAvailability.total * 100)}%)`}
                    sx={{ bgcolor: '#4CAF50', color: 'white', fontWeight: 'bold' }}
                  />
                  <Chip 
                    label={`${predictedAvailability.moderate} Moderate (${Math.round(predictedAvailability.moderate / predictedAvailability.total * 100)}%)`}
                    sx={{ bgcolor: '#FF9800', color: 'white', fontWeight: 'bold' }}
                  />
                  <Chip 
                    label={`${predictedAvailability.low} Low (${Math.round(predictedAvailability.low / predictedAvailability.total * 100)}%)`}
                    sx={{ bgcolor: '#FF5722', color: 'white', fontWeight: 'bold' }}
                  />
                  <Chip 
                    label={`${predictedAvailability.none} None (${Math.round(predictedAvailability.none / predictedAvailability.total * 100)}%)`}
                    sx={{ bgcolor: '#FF4444', color: 'white', fontWeight: 'bold' }}
                  />
                </Stack>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Based on {predictedAvailability.total} parking locations and historical patterns for this time of day and day of week.
                </Typography>
                
                {/* Time-based recommendations */}
                {plannedDateTime && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      💡 Recommendations:
                    </Typography>
                    <Box component="ul" sx={{ m: 0, pl: 2 }}>
                      {plannedDateTime.getHours() >= 8 && plannedDateTime.getHours() <= 10 && (
                        <Typography component="li" variant="body2" color="text.secondary">
                          Morning peak hours (8-10 AM) - Consider arriving 30 minutes earlier for better availability
                        </Typography>
                      )}
                      {plannedDateTime.getHours() >= 17 && plannedDateTime.getHours() <= 19 && (
                        <Typography component="li" variant="body2" color="text.secondary">
                          Evening peak hours (5-7 PM) - Parking will be challenging, consider public transport
                        </Typography>
                      )}
                      {(plannedDateTime.getHours() >= 22 || plannedDateTime.getHours() <= 6) && (
                        <Typography component="li" variant="body2" color="text.secondary">
                          Late night/early morning - Excellent parking availability expected
                        </Typography>
                      )}
                      {(plannedDateTime.getDay() === 0 || plannedDateTime.getDay() === 6) && (
                        <Typography component="li" variant="body2" color="text.secondary">
                          Weekend parking - Generally better availability than weekdays
                        </Typography>
                      )}
                      {predictedAvailability.good / predictedAvailability.total > 0.6 && (
                        <Typography component="li" variant="body2" color="text.secondary">
                          Great time to visit! High parking availability expected
                        </Typography>
                      )}
                      {predictedAvailability.none / predictedAvailability.total > 0.3 && (
                        <Typography component="li" variant="body2" color="text.secondary">
                          Consider alternative times - Limited parking availability expected
                        </Typography>
                      )}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Paper>

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


