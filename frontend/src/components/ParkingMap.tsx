import React, { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
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

  // Log map configuration for debugging
  useEffect(() => {
    if (isLoaded) {
      console.log('Google Maps loaded successfully');
    }
  }, [isLoaded]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isUsingFallbackSuggestions, setIsUsingFallbackSuggestions] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<any[]>([]);
  const searchBoxRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  // Common Melbourne locations for quick search
  const quickLocations = [
    'Melbourne CBD',
    'Federation Square',
    'Flinders Street Station',
    'Bourke Street Mall',
    'Queen Victoria Market',
    'Southbank',
    'Docklands',
    'Carlton',
    'North Melbourne',
    'East Melbourne',
    'West Melbourne',
    'South Melbourne',
    'Port Melbourne',
    'St Kilda',
    'Richmond',
    'Collingwood',
    'Fitzroy',
    'Brunswick',
    'Northcote',
    'Thornbury',
    'Preston',
    'Coburg',
    'Essendon',
    'Moonee Ponds',
    'Footscray',
    'Yarraville',
    'Williamstown',
    'Altona',
    'Point Cook',
    'Werribee',
    'Sunshine',
    'St Albans',
    'Keilor',
    'Airport West',
    'Tullamarine',
    'Broadmeadows',
    'Craigieburn',
    'Mickleham',
    'Roxburgh Park',
    'Greenvale',
    'Epping',
    'Thomastown',
    'Lalor',
    'Mill Park',
    'Bundoora',
    'Reservoir',
    'Preston',
    'Northcote',
    'Thornbury',
    'Fairfield',
    'Alphington',
    'Ivanhoe',
    'Heidelberg',
    'Rosanna',
    'Macleod',
    'Watsonia',
    'Greensborough',
    'Diamond Creek',
    'Eltham',
    'Research',
    'Warrandyte',
    'Doncaster',
    'Templestowe',
    'Bulleen',
    'Balwyn',
    'Kew',
    'Hawthorn',
    'Camberwell',
    'Glen Iris',
    'Malvern',
    'Toorak',
    'South Yarra',
    'Prahran',
    'Windsor',
    'St Kilda East',
    'Balaclava',
    'Elwood',
    'Brighton',
    'Sandringham',
    'Beaumaris',
    'Mentone',
    'Cheltenham',
    'Moorabbin',
    'Oakleigh',
    'Clayton',
    'Springvale',
    'Noble Park',
    'Dandenong',
    'Keysborough',
    'Chelsea',
    'Bonbeach',
    'Carrum',
    'Seaford',
    'Frankston',
    'Mount Eliza',
    'Mornington',
    'Mount Martha',
    'Dromana',
    'Rosebud',
    'Rye',
    'Sorrento',
    'Portsea'
  ];

  // Handle search input changes
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSearchError(null);
    setSelectedSuggestionIndex(-1);
    
    // Clear suggestions if query is too short
    if (value.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // Get suggestions immediately as user types
    getSearchSuggestions(value);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    setSelectedSuggestionIndex(-1);
    
    // Auto-search the selected suggestion
    setTimeout(() => {
      handleSearchSubmit(suggestion);
    }, 100);
  };

  // Handle form submission
  const handleSearchSubmit = async (queryToSearch?: string) => {
    const searchTerm = queryToSearch || searchQuery;
    if (!searchTerm.trim() || !mapRef.current) return;

    setIsSearching(true);
    setSearchError(null);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    setSelectedSuggestionIndex(-1);

    try {
      const geocoder = new (window as any).google.maps.Geocoder();
      
      // Try multiple search strategies
      const searchStrategies = [
        // Strategy 1: Direct geocoding
        () => geocoder.geocode({ address: searchTerm }),
        // Strategy 2: Add "Melbourne, VIC" to make it more specific
        () => geocoder.geocode({ address: `${searchTerm}, Melbourne, VIC, Australia` }),
        // Strategy 3: Try with just "Melbourne" suffix
        () => geocoder.geocode({ address: `${searchTerm}, Melbourne` }),
        // Strategy 4: Try with just "VIC" suffix
        () => geocoder.geocode({ address: `${searchTerm}, VIC, Australia` })
      ];

      let results = null;
      let strategyUsed = '';

      for (let i = 0; i < searchStrategies.length; i++) {
        try {
          const response = await searchStrategies[i]();
          if (response.results && response.results.length > 0) {
            results = response.results;
            strategyUsed = i === 0 ? 'direct' : i === 1 ? 'with full address' : i === 2 ? 'with Melbourne' : 'with VIC';
            break;
          }
        } catch (error) {
          console.log(`Strategy ${i + 1} failed:`, error);
          continue;
        }
      }

      if (!results || results.length === 0) {
        // Try to find a close match from quick locations
        const closeMatch = quickLocations.find(location => 
          location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          searchTerm.toLowerCase().includes(location.toLowerCase())
        );

        if (closeMatch) {
          setSearchError(`Location not found. Did you mean "${closeMatch}"? Try searching for that instead.`);
        } else {
          setSearchError(`Location "${searchTerm}" not found. Try a more specific address or use one of the quick locations below.`);
        }
        return;
      }

      const location = results[0].geometry.location;
      const newCenter = {
        lat: location.lat(),
        lng: location.lng(),
      };

      // Pan and zoom to the found location
      mapRef.current.panTo(newCenter);
      mapRef.current.setZoom(16);

      // Add a temporary marker at the searched location
      const tempMarker = new (window as any).google.maps.Marker({
        position: newCenter,
        map: mapRef.current,
        title: `Searched: ${searchTerm}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" fill="#FF6B6B" stroke="#FFF" stroke-width="2"/>
              <circle cx="12" cy="12" r="4" fill="#FFF"/>
            </svg>
          `),
          scaledSize: new (window as any).google.maps.Size(24, 24),
        },
        zIndex: 1000,
      });

      // Remove the temporary marker after 5 seconds
      setTimeout(() => {
        tempMarker.setMap(null);
      }, 5000);

      console.log(`Search successful using ${strategyUsed} strategy for: ${searchTerm}`);

    } catch (error) {
      console.error('Geocoding error:', error);
      
      // Provide more helpful error messages
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      if (errorMessage.includes('ZERO_RESULTS')) {
        setSearchError(`No results found for "${searchTerm}". Try a more specific address or use one of the quick locations below.`);
      } else if (errorMessage.includes('OVER_QUERY_LIMIT')) {
        setSearchError('Search limit reached. Please try again in a moment.');
      } else if (errorMessage.includes('REQUEST_DENIED')) {
        setSearchError('Search service temporarily unavailable. Please try again later.');
      } else {
        setSearchError(`Search failed: ${errorMessage}. Please try a different search term.`);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Search for a location (form submission handler)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit();
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (!mapRef.current) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          mapRef.current!.panTo(newCenter);
          mapRef.current!.setZoom(16);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setSearchError('Unable to get your current location.');
        }
      );
    } else {
      setSearchError('Geolocation is not supported by this browser.');
    }
  };

  // Initialize Google Places services when map loads
  useEffect(() => {
    if (isLoaded && mapRef.current) {
      autocompleteServiceRef.current = new (window as any).google.maps.places.AutocompleteService();
      placesServiceRef.current = new (window as any).google.maps.places.PlacesService(mapRef.current);
    }
  }, [isLoaded]);

  // Get search suggestions as user types
  const getSearchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      setIsUsingFallbackSuggestions(false);
      return;
    }

    if (!autocompleteServiceRef.current) return;

    setIsLoadingSuggestions(true);
    setShowSuggestions(true);
    setIsUsingFallbackSuggestions(false);

    try {
      const request = {
        input: query,
        componentRestrictions: { country: 'au' }, // Restrict to Australia
        types: ['establishment', 'geocode', 'locality', 'sublocality'], // Include more location types
      };

      autocompleteServiceRef.current.getPlacePredictions(request, (predictions, status) => {
        setIsLoadingSuggestions(false);
        
        if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && predictions) {
          // Get more diverse suggestions including suburbs, landmarks, and addresses
          const allSuggestions = predictions
            .filter(pred => 
              pred.description.toLowerCase().includes('melbourne') ||
              pred.description.toLowerCase().includes('vic') ||
              pred.description.toLowerCase().includes('victoria') ||
              pred.description.toLowerCase().includes('australia')
            )
            .slice(0, 10)
            .map(pred => pred.description);
          
          setSearchSuggestions(allSuggestions);
          setIsUsingFallbackSuggestions(false);
        } else {
          // Fallback to quick locations if Places API fails
          const fallbackSuggestions = quickLocations
            .filter(location => 
              location.toLowerCase().includes(query.toLowerCase())
            )
            .slice(0, 6);
          
          if (fallbackSuggestions.length > 0) {
            setSearchSuggestions(fallbackSuggestions);
            setIsUsingFallbackSuggestions(true);
          } else {
            setSearchSuggestions([]);
            setIsUsingFallbackSuggestions(false);
          }
        }
      });
    } catch (error) {
      console.error('Autocomplete error:', error);
      setIsLoadingSuggestions(false);
      
      // Fallback to quick locations on error
      const fallbackSuggestions = quickLocations
        .filter(location => 
          location.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6);
      
      setSearchSuggestions(fallbackSuggestions);
      setIsUsingFallbackSuggestions(true);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionSelect(searchSuggestions[selectedSuggestionIndex]);
        } else {
          // Submit the form if no suggestion is selected
          const form = searchBoxRef.current?.closest('form');
          if (form) form.requestSubmit();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSearchSuggestions([]);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSearchSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

    // Create Enhanced Markers when map or locations change
  useEffect(() => {
    console.log('Marker useEffect triggered:', { 
      isLoaded, 
      hasMapRef: !!mapRef.current, 
      hasGoogle: !!(window as any).google,
      locationsLength: locations.length 
    });
    
    // Wait for all dependencies to be ready
    if (!isLoaded || !mapRef.current || !(window as any).google) {
      console.log('Marker creation blocked - waiting for dependencies:', { 
        isLoaded, 
        hasMapRef: !!mapRef.current, 
        hasGoogle: !!(window as any).google 
      });
      return;
    }

    console.log('Creating markers for', locations.length, 'locations');

    // Clear existing markers
    markersRef.current.forEach((m) => {
      if (m && m.map) m.map = null;
    });
    markersRef.current = [];

    const g = (window as any).google as typeof google;
    
    // Force use of regular markers for better compatibility
    console.log('Using regular markers for better visibility');
    console.log('Locations to create markers for:', locations);
    
    // Add a test marker if no locations are provided
    if (locations.length === 0) {
      console.log('No locations provided, adding test marker');
      const testMarker = new g.maps.Marker({
        map: mapRef.current,
        position: { lat: -37.8136, lng: 144.9631 }, // Melbourne CBD
        title: 'Test Marker - Melbourne CBD',
        icon: {
          path: g.maps.SymbolPath.CIRCLE,
          fillColor: '#4CAF50',
          fillOpacity: 0.8,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 3,
        },
      });
      markersRef.current.push(testMarker);
    }
    
    // Always add a simple test marker to verify marker creation works
    console.log('Adding simple test marker');
    try {
      const simpleTestMarker = new g.maps.Marker({
        map: mapRef.current,
        position: { lat: -37.8136, lng: 144.9631 }, // Melbourne CBD
        title: 'Simple Test Marker',
      });
      console.log('Simple test marker created successfully:', simpleTestMarker);
      markersRef.current.push(simpleTestMarker);
    } catch (error) {
      console.error('Error creating simple test marker:', error);
    }
    
    console.log('Creating parking location markers for', locations.length, 'locations');
    locations.forEach((loc, index) => {
      console.log(`Creating marker ${index + 1}/${locations.length}:`, loc.name, 'at', loc.latitude, loc.longitude);
      
      // Create enhanced marker with availability status
      const availabilityRate = loc.capacity && loc.capacity > 0 ? (loc.available / loc.capacity) * 100 : 0;
      
      // Determine marker color and size based on availability
      let markerColor = '#FF4444'; // Red for no availability
      let markerSize = 20;
      
      if (availabilityRate > 50) {
        markerColor = '#4CAF50'; // Green for good availability
        markerSize = 28;
      } else if (availabilityRate > 20) {
        markerColor = '#FF9800'; // Orange for moderate availability
        markerSize = 24;
      } else if (availabilityRate > 0) {
        markerColor = '#FF5722'; // Red-orange for low availability
        markerSize = 22;
      }

      // Create custom marker icon
      const markerIcon = {
        path: g.maps.SymbolPath.CIRCLE,
        fillColor: markerColor,
        fillOpacity: 0.8,
        strokeColor: '#FFFFFF',
        strokeWeight: 2,
        scale: markerSize / 10,
      };

              try {
          const marker = new g.maps.Marker({
            map: mapRef.current,
            position: { lat: loc.latitude, lng: loc.longitude },
            title: `${loc.name} - ${loc.available} available`,
            icon: markerIcon,
            animation: g.maps.Animation.DROP,
          });

          // Add click listener
          marker.addListener('click', () => setActiveId(loc.id));
          
          // Add hover effects
          marker.addListener('mouseover', () => {
            marker.setAnimation(g.maps.Animation.BOUNCE);
          });
          
          marker.addListener('mouseout', () => {
            marker.setAnimation(null);
          });

      markersRef.current.push(marker);
          console.log(`Marker ${index + 1} created successfully for ${loc.name}`);
        } catch (error) {
          console.error(`Error creating marker for ${loc.name}:`, error);
        }
    });
  }, [isLoaded, locations]);

  return (
    <Box sx={{ height, borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
      {/* Search Bar */}
      <Paper
        component="form"
        onSubmit={handleSearch}
        sx={{
          p: 2,
          mb: 2,
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            ref={searchBoxRef}
            fullWidth
            placeholder="Search for a location, address, or landmark..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyDown}
            disabled={isSearching}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    type="submit"
                    disabled={!searchQuery.trim() || isSearching}
                    sx={{ color: 'primary.main' }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <IconButton
            onClick={handleGetCurrentLocation}
            disabled={isSearching}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
              '&:disabled': {
                bgcolor: 'action.disabledBackground',
                color: 'action.disabled',
              },
            }}
          >
            <MyLocationIcon />
          </IconButton>
        </Box>
        
        {/* Search Suggestions Dropdown */}
        {showSuggestions && (searchSuggestions.length > 0 || isLoadingSuggestions) && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              mt: 1,
              maxHeight: 500,
              overflow: 'auto',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {isLoadingSuggestions ? (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Loading suggestions...
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ p: 1.5, bgcolor: 'info.50', borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" color="info.700" sx={{ fontSize: '0.75rem' }}>
                    {isUsingFallbackSuggestions 
                      ? '🔍 Showing quick location suggestions (Google Places API unavailable)'
                      : '🔍 Showing Melbourne area suggestions'
                    }
                  </Typography>
                </Box>
                {searchSuggestions.map((suggestion, index) => (
                  <Box
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.2s ease-in-out',
                      bgcolor: selectedSuggestionIndex === index ? 'action.hover' : 'transparent',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: selectedSuggestionIndex === index ? 600 : 500,
                        color: selectedSuggestionIndex === index ? 'primary.main' : 'inherit',
                      }}
                    >
                      {suggestion}
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </Paper>
        )}
        
        {/* Error Message */}
        {searchError && (
          <Typography
            variant="body2"
            color="error"
            sx={{ mt: 1, fontSize: '0.875rem' }}
          >
            {searchError}
          </Typography>
        )}
        
        {/* Search Status */}
        {isSearching && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, fontSize: '0.875rem' }}
          >
            Searching...
          </Typography>
        )}

        {/* Quick Location Suggestions */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
            Quick locations:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {quickLocations.slice(0, 8).map((location) => (
              <Box
                key={location}
                onClick={() => {
                  setSearchQuery(location);
                  setShowSuggestions(false);
                  // Auto-search after a short delay
                  setTimeout(() => {
                    const form = searchBoxRef.current?.closest('form');
                    if (form) form.requestSubmit();
                  }, 100);
                }}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  bgcolor: 'primary.50',
                  color: 'primary.700',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: 'primary.200',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'primary.100',
                    borderColor: 'primary.300',
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                {location}
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {!isLoaded && !loadError && (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Loading Google Maps...
          </Typography>
        </Box>
      )}

      {loadError && (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" color="error" gutterBottom>
            Google Maps Error
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {loadError.message === 'ApiProjectMapError' 
              ? 'Google Maps API key is missing or invalid. Please set REACT_APP_GOOGLE_MAPS_API_KEY in your environment variables.'
              : loadError.message}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            To fix this, you need to:
          </Typography>
          <Box component="ul" sx={{ textAlign: 'left', mt: 1 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              1. Get a Google Maps API key from the Google Cloud Console
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              2. Set REACT_APP_GOOGLE_MAPS_API_KEY in your .env.local file
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              3. For production, add it to Vercel environment variables
            </Typography>
          </Box>
        </Box>
      )}

      {isLoaded && !loadError && (
        <GoogleMap
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={initialZoom}
          options={{
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            clickableIcons: true,
            zoomControl: true,
          }}
          onLoad={(map) => {
            console.log('Map loaded successfully');
            mapRef.current = map;
            console.log('Map center:', map.getCenter());
            console.log('Map zoom:', map.getZoom());
            
            if (locations.length && (window as any).google) {
              console.log('Fitting bounds for', locations.length, 'locations');
              const g = (window as any).google as typeof google;
              const b = new g.maps.LatLngBounds();
              locations.forEach((l) => {
                console.log('Adding location to bounds:', l.name, l.latitude, l.longitude);
                b.extend({ lat: l.latitude, lng: l.longitude });
              });
              map.fitBounds(b, { top: 40, bottom: 40, left: 40, right: 40 } as any);
              console.log('Bounds fitted, new center:', map.getCenter(), 'new zoom:', map.getZoom());
            }
          }}
        >
          {/* Advanced markers created imperatively below */}
          {locations.map(
            (loc) =>
              activeId === loc.id && (
                <InfoWindow
                  key={`iw-${loc.id}`}
                  position={{ lat: loc.latitude, lng: loc.longitude }}
                  onCloseClick={() => setActiveId(null)}
                >
                  <Box sx={{ p: 1, minWidth: 200 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {loc.name}
                    </Typography>
                    
                    {/* Availability Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: loc.available > 0 ? '#4CAF50' : '#FF4444',
                        }}
                      />
                      <Typography variant="body2" fontWeight="600">
                        {loc.available} spots available
                        {loc.capacity ? ` of ${loc.capacity}` : ''}
                      </Typography>
                    </Box>
                    
                    {/* Type and Price */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {loc.type === 'on_street' ? '🚗 On-street' : '🏢 Off-street'} parking
                      {loc.pricePerHour ? ` · $${loc.pricePerHour.toFixed(2)}/hour` : ' · Free'}
                    </Typography>
                    
                    {/* Features */}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {loc.accessible && (
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            bgcolor: '#E3F2FD',
                            color: '#1976D2',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          ♿ Accessible
                        </Box>
                      )}
                      {loc.familyFriendly && (
                        <Box
                          sx={{
                            px: 1,
                            py: 0.5,
                            bgcolor: '#E8F5E8',
                            color: '#2E7D32',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          👨‍👩‍👧‍👦 Family-friendly
                        </Box>
                      )}
                    </Box>
                    
                    {/* Availability Rate */}
                    {loc.capacity && loc.capacity > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Availability: {Math.round((loc.available / loc.capacity) * 100)}%
                        </Typography>
                        <Box
                          sx={{
                            width: '100%',
                            height: 6,
                            bgcolor: '#E0E0E0',
                            borderRadius: 3,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${(loc.available / loc.capacity) * 100}%`,
                              height: '100%',
                              bgcolor: loc.available > 0 ? '#4CAF50' : '#FF4444',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </InfoWindow>
              )
          )}
        </GoogleMap>
      )}
    </Box>
  );
};

export default ParkingMap;


