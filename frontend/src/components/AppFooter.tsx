import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const AppFooter: React.FC = () => {
  return (
    <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Melbourne Parking Accessibility — Monash FIT5120
      </Typography>
    </Box>
  );
};

export default AppFooter;


