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


