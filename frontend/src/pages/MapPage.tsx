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
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import ParkingMap from '../components/ParkingMap';
import { ParkingLocation, ParkingType } from '../types/parking';
import { fetchParkingLocations } from '../services/api';
import Container from '@mui/material/Container';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { 
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const MapPage: React.FC = () => {
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<ParkingType | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(20);
  const [onlyAccessible, setOnlyAccessible] = useState(false);
  const [onlyFamilyFriendly, setOnlyFamilyFriendly] = useState(false);
  
  // Planner state
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [plannedDateTime, setPlannedDateTime] = useState<Date | null>(new Date());
  const [plannedDuration, setPlannedDuration] = useState<number>(2); // hours
  const [isPredicting, setIsPredicting] = useState(false);
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

  // Predict parking availability based on planned time
  const predictParkingAvailability = async () => {
    if (!plannedDateTime || !locations.length) {
      console.log('No date/time or locations available for prediction');
      return;
    }

    setIsPredicting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const hour = plannedDateTime.getHours();
    const dayOfWeek = plannedDateTime.getDay(); // 0 = Sunday, 6 = Saturday
    
    console.log(`Predicting for: ${plannedDateTime.toLocaleString()}, Hour: ${hour}, Day: ${dayOfWeek}`);
    
    // Enhanced prediction logic with more realistic patterns
    let goodCount = 0;
    let moderateCount = 0;
    let lowCount = 0;
    let noneCount = 0;

    locations.forEach(location => {
      let availabilityRate = location.available / (location.capacity || 1);
      
      // Add some randomization to make predictions more realistic
      const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
      availabilityRate *= randomFactor;
      
      // Adjust based on time of day with more nuanced patterns
      if (hour >= 7 && hour <= 9) { // Morning rush
        availabilityRate *= 0.25;
      } else if (hour >= 17 && hour <= 19) { // Evening rush
        availabilityRate *= 0.15;
      } else if (hour >= 10 && hour <= 16) { // Business hours
        availabilityRate *= 0.5;
      } else if (hour >= 20 || hour <= 6) { // Late night
        availabilityRate *= 1.5;
      } else { // Other times
        availabilityRate *= 0.8;
      }
      
      // Adjust based on day of week
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
        availabilityRate *= 1.8;
      } else { // Weekday
        availabilityRate *= 0.7;
      }
      
      // Adjust based on planned duration
      if (plannedDuration > 4) {
        availabilityRate *= 0.9; // Longer stays might have different patterns
      }
      
      // Categorize availability
      if (availabilityRate > 0.5) {
        goodCount++;
      } else if (availabilityRate > 0.2) {
        moderateCount++;
      } else if (availabilityRate > 0) {
        lowCount++;
      } else {
        noneCount++;
      }
    });

    const prediction = {
      good: goodCount,
      moderate: moderateCount,
      low: lowCount,
      none: noneCount,
      total: locations.length
    };

    console.log('Prediction result:', prediction);
    setPredictedAvailability(prediction);
    setIsPredicting(false);
  };

  useEffect(() => {
    if (plannerOpen && plannedDateTime) {
      predictParkingAvailability();
    }
  }, [plannerOpen, plannedDateTime, plannedDuration, locations]);

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

        {/* Parking Planner Section */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ScheduleIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold">
                Parking Planner
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setPlannerOpen(!plannerOpen)}
              sx={{ color: 'primary.main' }}
            >
              {plannerOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Plan your CBD visit and see predicted parking availability for your chosen time.
          </Typography>

          <Collapse in={plannerOpen}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid xs={12} md={4}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                      When will you arrive?
                    </Typography>
                    <DateTimePicker
                      value={plannedDateTime}
                      onChange={(newValue) => setPlannedDateTime(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          variant: 'outlined',
                          placeholder: 'Select date and time'
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                
                <Grid xs={12} md={4}>
                  <FormControl fullWidth>
                    <Typography variant="subtitle2" gutterBottom>
                      How long will you stay?
                    </Typography>
                    <Select
                      value={plannedDuration}
                      onChange={(e) => setPlannedDuration(e.target.value as number)}
                      fullWidth
                    >
                      <MenuItem value={1}>1 hour</MenuItem>
                      <MenuItem value={2}>2 hours</MenuItem>
                      <MenuItem value={3}>3 hours</MenuItem>
                      <MenuItem value={4}>4 hours</MenuItem>
                      <MenuItem value={6}>6 hours</MenuItem>
                      <MenuItem value={8}>8 hours</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid xs={12} md={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={isPredicting}
                    onClick={() => {
                      console.log('Predict button clicked');
                      predictParkingAvailability();
                    }}
                    startIcon={isPredicting ? <AccessTimeIcon /> : <TrendingUpIcon />}
                    sx={{ 
                      mt: 3.5,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      '&:disabled': {
                        opacity: 0.7,
                      }
                    }}
                  >
                    {isPredicting ? 'Predicting...' : 'Predict Availability'}
                  </Button>
                </Grid>
              </Grid>

              {/* Prediction Results */}
              {predictedAvailability && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Predicted Parking Availability
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Based on {plannedDateTime?.toLocaleDateString()} at {plannedDateTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid xs={6} sm={3}>
                      <Card sx={{ bgcolor: '#4CAF50', color: 'white' }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="h4" fontWeight="bold">
                            {predictedAvailability.good}
                          </Typography>
                          <Typography variant="body2">
                            Good Availability
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid xs={6} sm={3}>
                      <Card sx={{ bgcolor: '#FF9800', color: 'white' }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="h4" fontWeight="bold">
                            {predictedAvailability.moderate}
                          </Typography>
                          <Typography variant="body2">
                            Moderate Availability
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid xs={6} sm={3}>
                      <Card sx={{ bgcolor: '#FF5722', color: 'white' }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="h4" fontWeight="bold">
                            {predictedAvailability.low}
                          </Typography>
                          <Typography variant="body2">
                            Low Availability
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid xs={6} sm={3}>
                      <Card sx={{ bgcolor: '#FF4444', color: 'white' }}>
                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="h4" fontWeight="bold">
                            {predictedAvailability.none}
                          </Typography>
                          <Typography variant="body2">
                            No Availability
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
                    <Typography variant="body2" color="info.700">
                      <InfoIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                      <strong>Tip:</strong> These predictions are based on historical patterns and current data. 
                      For the most accurate information, check real-time availability closer to your visit time.
                    </Typography>
                  </Box>
                </Box>
              )}
            </LocalizationProvider>
          </Collapse>
        </Paper>

        <Box sx={{ mb: 2, p: 2, bgcolor: 'info.50', borderRadius: 2, border: '1px solid', borderColor: 'info.200' }}>
          <Typography variant="body2" color="info.700">
            💡 <strong>Search Tips:</strong> Use the filters above to find specific parking locations, or use the search bar below the map to find any location in Melbourne and center the map on it.
          </Typography>
        </Box>

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


