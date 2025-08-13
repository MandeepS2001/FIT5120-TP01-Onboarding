import React, { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DirectionsIcon from '@mui/icons-material/Directions';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { ParkingLocation } from '../types/parking';
import { GoogleMap, InfoWindow, useJsApiLoader } from '@react-google-maps/api';

type Props = {
  locations: ParkingLocation[];
  height?: number | string;
  initialCenter?: [number, number];
  initialZoom?: number;
};

const ParkingMap: React.FC<Props> = ({
  locations,
  height = 600,
  initialCenter = [-37.8136, 144.9631], // Melbourne CBD
  initialZoom = 14,
}) => {
  const center = useMemo(() => ({ lat: initialCenter[0], lng: initialCenter[1] }), [initialCenter]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  // Map state
  const [activeId, setActiveId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<ParkingLocation | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Prediction state
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [predictionDateTime, setPredictionDateTime] = useState<Date | null>(new Date());
  const [predictionDuration, setPredictionDuration] = useState<number>(2);
  const [predictionResults, setPredictionResults] = useState<{
    good: number;
    moderate: number;
    low: number;
    none: number;
    total: number;
    bestSpots: ParkingLocation[];
  } | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<any[]>([]);
  const searchBoxRef = useRef<HTMLInputElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
          if (mapRef.current) {
            mapRef.current.panTo(newLocation);
            mapRef.current.setZoom(16);
          }

        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };



  // Handle search input changes for autocomplete
  const handleSearchInputChange = async (value: string) => {
    setSearchQuery(value);
    
    if (!value.trim() || !(window as any).google) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const autocompleteService = new (window as any).google.maps.places.AutocompleteService();
      const response = await autocompleteService.getPlacePredictions({
        input: `${value}, Melbourne, VIC, Australia`,
        types: ['geocode'],
        componentRestrictions: { country: 'au' }
      });
      
      setSearchSuggestions(response.predictions || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Autocomplete error:', error);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle search selection
  const handleSearchSelection = async (prediction: google.maps.places.AutocompletePrediction) => {
    setSearchQuery(prediction.description);
    setShowSuggestions(false);
    
    if (!mapRef.current) return;

    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const response = await geocoder.geocode({ 
        placeId: prediction.place_id 
      });
      
      if (response.results && response.results.length > 0) {
        const location = response.results[0].geometry.location;
        const newCenter = {
          lat: location.lat(),
          lng: location.lng(),
        };
        
        mapRef.current.panTo(newCenter);
        mapRef.current.setZoom(16);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  // Handle search form submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapRef.current) return;

    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      const response = await geocoder.geocode({ 
        address: `${searchQuery}, Melbourne, VIC, Australia` 
      });
      
      if (response.results && response.results.length > 0) {
        const location = response.results[0].geometry.location;
        const newCenter = {
          lat: location.lat(),
          lng: location.lng(),
        };
        
        mapRef.current.panTo(newCenter);
        mapRef.current.setZoom(16);
        
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    }
  };

  // Find the best parking spot nearby
  const findBestParkingNearby = () => {
    if (!userLocation) {
      // If no user location, get it first
      alert('Getting your location first, then finding the best parking...');
      getCurrentLocation();
      // Try to find parking after a delay
      setTimeout(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              findBestParkingForLocation(currentLocation);
            },
            () => {
              alert('Could not get your location. Please allow location access and try again.');
            }
          );
        }
      }, 1000);
      return;
    }

    findBestParkingForLocation(userLocation);
  };

  // Find best parking for a specific location
  const findBestParkingForLocation = (location: { lat: number; lng: number }) => {
    // Filter available parking spots
    const availableSpots = locations.filter((l) => {
      const availabilityRate = l.available / (l.capacity || 1) * 100;
      return availabilityRate > 0;
    });

    if (availableSpots.length === 0) {
      alert('No parking spots available nearby.');
      return;
    }

    // Calculate distance and score for each location
    const scoredLocations = availableSpots.map((spot) => {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        spot.latitude,
        spot.longitude
      );
      
      const availabilityRate = spot.available / (spot.capacity || 1) * 100;
      const priceScore = spot.pricePerHour ? Math.max(0, 30 - spot.pricePerHour) / 30 : 10; // Lower price = higher score
      const availabilityScore = availabilityRate / 100;
      const distanceScore = Math.max(0, 1 - distance / 5); // Closer = higher score
      
      // Weight factors: distance (40%), price (35%), availability (25%)
      const totalScore = (distanceScore * 0.4) + (priceScore * 0.35) + (availabilityScore * 0.25);
      
      return {
        ...spot,
        distance,
        score: totalScore,
        availabilityRate
      };
    });

    // Sort by score and get the best option
    const bestParking = scoredLocations.sort((a, b) => b.score - a.score)[0];

    // Select and highlight the best parking spot
    setSelectedLocation(bestParking);
    setActiveId(bestParking.id);

    // Pan map to the best parking spot
    if (mapRef.current) {
      mapRef.current.panTo({ lat: bestParking.latitude, lng: bestParking.longitude });
      mapRef.current.setZoom(17);
    }

    // Show success message with details
    const distanceText = bestParking.distance < 1 ? 
      `${Math.round(bestParking.distance * 1000)}m away` : 
      `${bestParking.distance.toFixed(1)}km away`;
    
    alert(`Found the best parking spot!\n\n${bestParking.name}\n${distanceText}\n${bestParking.available} spots available\n$${bestParking.pricePerHour || 0}/hr\n\nClick "Get Directions" to navigate there.`);
  };

  // Predict parking availability based on time patterns
  const predictParkingAvailability = (dateTime: Date, duration: number) => {
    const hour = dateTime.getHours();
    const dayOfWeek = dateTime.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isPeakHour = (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19);
    const isLateNight = hour >= 22 || hour <= 6;
    
    let good = 0, moderate = 0, low = 0, none = 0;
    const bestSpots: ParkingLocation[] = [];
    
    // Use filtered locations (only available spots)
    filteredLocations.forEach((location) => {
      let availabilityRate = location.available / (location.capacity || 1) * 100;
      
      // Apply time-based adjustments
      if (isWeekend) {
        // Weekends: generally more available
        availabilityRate *= 1.2;
      } else if (isPeakHour) {
        // Peak hours: much less available
        availabilityRate *= 0.4;
      } else if (isLateNight) {
        // Late night: more available
        availabilityRate *= 1.5;
      } else {
        // Regular hours: slight reduction
        availabilityRate *= 0.8;
      }
      
      // Apply duration-based adjustments
      if (duration > 4) {
        // Longer stays: less availability
        availabilityRate *= 0.7;
      } else if (duration <= 1) {
        // Short stays: more availability
        availabilityRate *= 1.1;
      }
      
      // Ensure availability is within bounds
      availabilityRate = Math.max(0, Math.min(100, availabilityRate));
      
      // Categorize availability
      if (availabilityRate > 50) {
        good++;
        if (bestSpots.length < 3) {
          bestSpots.push({ ...location, available: Math.round(availabilityRate / 100 * (location.capacity || 1)) });
        }
      } else if (availabilityRate > 20) {
        moderate++;
      } else if (availabilityRate > 0) {
        low++;
      } else {
        none++;
      }
    });
    
    return { good, moderate, low, none, total: filteredLocations.length, bestSpots };
  };

  // Handle prediction form submission
  const handlePredictionSubmit = () => {
    if (!predictionDateTime) return;
    
    const results = predictParkingAvailability(predictionDateTime, predictionDuration);
    setPredictionResults(results);
  };

  // Handle get directions to parking spot
  const handleGetDirections = (destination: ParkingLocation) => {
    if (!userLocation) {
      // If no user location, get it first and show a message
      alert('Getting your location first, then opening directions...');
      getCurrentLocation();
      // Try to open directions after a delay
      setTimeout(() => {
        // Use a simpler approach - just try to open directions with current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const origin = `${position.coords.latitude},${position.coords.longitude}`;
              const destinationCoords = `${destination.latitude},${destination.longitude}`;
              const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destinationCoords}&travelmode=driving`;
              window.open(directionsUrl, '_blank');
            },
            () => {
              alert('Could not get your location. Please allow location access and try again.');
            }
          );
        }
      }, 1000);
      return;
    }

    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destinationCoords = `${destination.latitude},${destination.longitude}`;
    
    // Open Google Maps directions in a new tab
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destinationCoords}&travelmode=driving`;
    window.open(directionsUrl, '_blank');
  };

  // Filter locations to show only available spots
  const filteredLocations = useMemo(() => {
    return locations.filter((l) => {
      // Filter out locations with no availability (red markers)
      const availabilityRate = l.available / (l.capacity || 1) * 100;
      return availabilityRate > 0;
    });
  }, [locations]);

  // Create markers when map or locations change
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !(window as any).google) return;

    // Clear existing markers
    markersRef.current.forEach((m) => {
      if (m && m.map) m.map = null;
    });
    markersRef.current = [];

    const g = (window as any).google as typeof google;
    
         filteredLocations.forEach((location, index) => {
       try {
         const availabilityRate = location.available / (location.capacity || 1) * 100;
         
         // Determine marker color based on availability (no red markers since we filtered them out)
         let fillColor = '#FF5722'; // Low availability (default)
         if (availabilityRate > 50) fillColor = '#4CAF50'; // Good
         else if (availabilityRate > 20) fillColor = '#FF9800'; // Moderate

         const marker = new g.maps.Marker({
           map: mapRef.current,
           position: { lat: location.latitude, lng: location.longitude },
           title: `${location.name} - ${location.available}/${location.capacity} spots available`,
           icon: {
             path: g.maps.SymbolPath.CIRCLE,
             fillColor,
             fillOpacity: 0.8,
             strokeColor: '#FFFFFF',
             strokeWeight: 2,
             scale: 6,
           },
           clickable: true,
         });

        // Add click listener
        marker.addListener('click', () => {
          setSelectedLocation(location);
          setActiveId(location.id);
        });

        markersRef.current.push(marker);
      } catch (error) {
        console.error(`Error creating marker for ${location.name}:`, error);
      }
    });
  }, [isLoaded, filteredLocations]);

  if (loadError) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography color="error">Error loading map</Typography>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading map...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
             {/* Search and Filter Panel */}
       <Paper
         sx={{
           position: 'absolute',
           top: 16,
           left: 16,
           right: 16,
           zIndex: 1000,
           p: 2,
           background: 'rgba(255, 255, 255, 0.95)',
           backdropFilter: 'blur(10px)',
           border: '1px solid rgba(0, 0, 0, 0.1)',
           boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
         }}
       >
         <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                       {/* Search Bar */}
            <Box component="form" onSubmit={handleSearch} sx={{ flex: 1, position: 'relative' }}>
              <TextField
                ref={searchBoxRef}
                fullWidth
                placeholder="Search for a location in Melbourne..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={() => {
                  if (searchSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" disabled={!searchQuery.trim()}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <Paper
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1001,
                    mt: 0.5,
                    maxHeight: 300,
                    overflow: 'auto',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  {searchSuggestions.map((prediction, index) => (
                    <Box
                      key={prediction.place_id}
                      sx={{
                        p: 1.5,
                        cursor: 'pointer',
                        borderBottom: index < searchSuggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                      onClick={() => handleSearchSelection(prediction)}
                    >
                      <Typography variant="body2" noWrap>
                        {prediction.description}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>

                       <Button
              variant="contained"
              onClick={getCurrentLocation}
              startIcon={<MyLocationIcon />}
              size="small"
              sx={{ minWidth: 'auto', px: 2 }}
            >
              My Location
            </Button>
            
            <Button
              variant="outlined"
              onClick={findBestParkingNearby}
              startIcon={<DirectionsIcon />}
              size="small"
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Park Nearby
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => setShowPredictionModal(true)}
              startIcon={<TrendingUpIcon />}
              size="small"
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Predict
            </Button>
         </Box>
       </Paper>

      

      

      {/* Map Component */}
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={initialZoom}
        onLoad={(map) => {
          mapRef.current = map;
          // Get user location on map load
          getCurrentLocation();
        }}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
                {/* Info Window for selected location */}
        {selectedLocation && activeId && (
          <InfoWindow
            position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
            onCloseClick={() => {
              setSelectedLocation(null);
              setActiveId(null);
            }}
          >
            <Box sx={{ p: 1, maxWidth: 200 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {selectedLocation.name}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {selectedLocation.available} spots
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  ${selectedLocation.pricePerHour || 0}/hr
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                startIcon={<DirectionsIcon />}
                size="small"
                onClick={() => handleGetDirections(selectedLocation)}
              >
                Get Directions
              </Button>
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Prediction Modal */}
      <Dialog 
        open={showPredictionModal} 
        onClose={() => setShowPredictionModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon color="primary" />
            Parking Availability Prediction
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                When will you arrive?
              </Typography>
              <DateTimePicker
                value={predictionDateTime}
                onChange={setPredictionDateTime}
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small"
                  }
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                How long will you stay?
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={predictionDuration}
                  onChange={(e) => setPredictionDuration(e.target.value as number)}
                >
                  <MenuItem value={1}>1 hour</MenuItem>
                  <MenuItem value={2}>2 hours</MenuItem>
                  <MenuItem value={3}>3 hours</MenuItem>
                  <MenuItem value={4}>4 hours</MenuItem>
                  <MenuItem value={6}>6 hours</MenuItem>
                  <MenuItem value={8}>8 hours</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {predictionResults && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Predicted Availability
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip 
                    label={`${predictionResults.good} Good`} 
                    color="success" 
                    variant="outlined"
                  />
                  <Chip 
                    label={`${predictionResults.moderate} Moderate`} 
                    color="warning" 
                    variant="outlined"
                  />
                  <Chip 
                    label={`${predictionResults.low} Low`} 
                    color="error" 
                    variant="outlined"
                  />
                  <Chip 
                    label={`${predictionResults.none} None`} 
                    color="default" 
                    variant="outlined"
                  />
                </Box>

                {predictionResults.bestSpots.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Best Spots to Try:
                    </Typography>
                    {predictionResults.bestSpots.map((spot, index) => (
                      <Box key={spot.id} sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1, mb: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {spot.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Predicted: {spot.available} spots • ${spot.pricePerHour || 0}/hr
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </LocalizationProvider>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setShowPredictionModal(false)}>
            Close
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePredictionSubmit}
            startIcon={<TrendingUpIcon />}
          >
            Predict Availability
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ParkingMap;


