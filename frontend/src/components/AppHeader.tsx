import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

const AppHeader: React.FC = () => {
  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" component="div">
            Melbourne Parking
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Box display="flex" gap={1}>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/map">Map</Button>
          <Button color="inherit" component={RouterLink} to="/learn-more">Learn More</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;


