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
  const [duration, setDuration] = useState<number>(2);
  const [isPlannerActive, setIsPlannerActive] = useState(false);
  
  console.log('Current planned date time:', plannedDateTime);
  console.log('Is planner active:', isPlannerActive);
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

  // Update prediction when filtered locations change (if planner is active)
  useEffect(() => {
    if (plannedDateTime && isPlannerActive) {
      const prediction = predictAvailability(plannedDateTime);
      setPredictedAvailability(prediction);
    }
  }, [filtered, plannedDateTime, isPlannerActive]);

  // Predict parking availability based on time
  const predictAvailability = (dateTime: Date) => {
    console.log('Predicting availability for:', dateTime);
    const hour = dateTime.getHours();
    const dayOfWeek = dateTime.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
    
    console.log('Hour:', hour, 'Day of week:', dayOfWeek, 'Is weekend:', isWeekend, 'Is peak hour:', isPeakHour);
    
    let good = 0, moderate = 0, low = 0, none = 0;
    
    console.log('Processing', filtered.length, 'locations');
    
    filtered.forEach((location, index) => {
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
      
      if (index < 5) {
        console.log(`Location ${index}: available=${location.available}, capacity=${location.capacity}, rate=${availabilityRate.toFixed(1)}%`);
      }
    });
    
    const result = { good, moderate, low, none, total: filtered.length };
    console.log('Final prediction result:', result);
    return result;
  };

  const handlePredictAvailability = () => {
    console.log('Predict button clicked');
    console.log('Planned date time:', plannedDateTime);
    console.log('Filtered locations count:', filtered.length);
    
    if (plannedDateTime) {
      const prediction = predictAvailability(plannedDateTime);
      console.log('Prediction result:', prediction);
      setPredictedAvailability(prediction);
      setIsPlannerActive(true);
    } else {
      console.log('No planned date time set');
    }
  };

  const handleDateTimeChange = (newDateTime: Date | null) => {
    setPlannedDateTime(newDateTime);
    if (newDateTime && isPlannerActive) {
      // Update prediction immediately when date/time changes
      const prediction = predictAvailability(newDateTime);
      setPredictedAvailability(prediction);
    } else {
      setIsPlannerActive(false);
      setPredictedAvailability(null);
    }
  };

  const handleDurationChange = (newDuration: number) => {
    setDuration(newDuration);
    if (plannedDateTime && isPlannerActive) {
      // Update prediction immediately when duration changes
      const prediction = predictAvailability(plannedDateTime);
      setPredictedAvailability(prediction);
    } else {
      setIsPlannerActive(false);
      setPredictedAvailability(null);
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AccessTimeIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold">
                Parking Planner
              </Typography>
            </Box>
            <Box sx={{ cursor: 'pointer' }}>
              <Typography variant="h6">⌄</Typography>
            </Box>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Plan your CBD visit and see predicted parking availability for your chosen time.
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
              <Box sx={{ minWidth: 280 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  When will you arrive?
                </Typography>
                <DateTimePicker
                  value={plannedDateTime}
                  onChange={handleDateTimeChange}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small"
                    }
                  }}
                />
              </Box>
              
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  How long will you stay?
                </Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={duration}
                    onChange={(e) => handleDurationChange(e.target.value as number)}
                    displayEmpty
                  >
                    <MenuItem value={1}>1 hour</MenuItem>
                    <MenuItem value={2}>2 hours</MenuItem>
                    <MenuItem value={3}>3 hours</MenuItem>
                    <MenuItem value={4}>4 hours</MenuItem>
                    <MenuItem value={6}>6 hours</MenuItem>
                    <MenuItem value={8}>8 hours</MenuItem>
                    <MenuItem value={12}>12 hours</MenuItem>
                    <MenuItem value={24}>24 hours</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Button
                variant="contained"
                onClick={handlePredictAvailability}
                startIcon={<TrendingUpIcon />}
                sx={{ 
                  px: 3, 
                  py: 1.5,
                  minWidth: 180,
                  borderRadius: 2,
                  mt: { xs: 2, md: 3 }
                }}
              >
                Predict Availability
              </Button>
            </Stack>
          </LocalizationProvider>

          {/* Prediction Results */}
          {isPlannerActive && predictedAvailability && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Predicted Parking Availability
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Based on {plannedDateTime?.toLocaleDateString()} at {plannedDateTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <Card sx={{ 
                  flex: 1, 
                  bgcolor: '#4CAF50', 
                  color: 'white',
                  textAlign: 'center',
                  py: 2
                }}>
                  <Typography variant="h4" fontWeight="bold">
                    {predictedAvailability.good}
                  </Typography>
                  <Typography variant="body2">
                    Good Availability
                  </Typography>
                </Card>
                <Card sx={{ 
                  flex: 1, 
                  bgcolor: '#FF9800', 
                  color: 'white',
                  textAlign: 'center',
                  py: 2
                }}>
                  <Typography variant="h4" fontWeight="bold">
                    {predictedAvailability.moderate}
                  </Typography>
                  <Typography variant="body2">
                    Moderate Availability
                  </Typography>
                </Card>
                <Card sx={{ 
                  flex: 1, 
                  bgcolor: '#FF5722', 
                  color: 'white',
                  textAlign: 'center',
                  py: 2
                }}>
                  <Typography variant="h4" fontWeight="bold">
                    {predictedAvailability.low}
                  </Typography>
                  <Typography variant="body2">
                    Low Availability
                  </Typography>
                </Card>
                <Card sx={{ 
                  flex: 1, 
                  bgcolor: '#FF4444', 
                  color: 'white',
                  textAlign: 'center',
                  py: 2
                }}>
                  <Typography variant="h4" fontWeight="bold">
                    {predictedAvailability.none}
                  </Typography>
                  <Typography variant="body2">
                    No Availability
                  </Typography>
                </Card>
              </Stack>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ 
                  width: 16, 
                  height: 16, 
                  borderRadius: '50%', 
                  bgcolor: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                    i
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Tip: These predictions are based on historical patterns and current data. For the most accurate information, check real-time availability closer to your visit time.
                </Typography>
              </Box>
            </Box>
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


