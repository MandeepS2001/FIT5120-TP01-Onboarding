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
    fetchParkingLocations().then(setLocations).catch(() => setLocations([]));
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
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" gutterBottom>
          Parking Map
        </Typography>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Search by name"
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

        <ParkingMap locations={filtered} height={560} />
      </Container>
    </Box>
  );
};

export default MapPage;


