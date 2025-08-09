import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';

const LearnMorePage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Typography variant="h4" gutterBottom>About the Project</Typography>
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1" paragraph>
            Our goal is to enhance accessibility and predictability of parking in Melbourne's CBD
            for working parents by providing real-time availability, predictions, and
            family-friendly filters.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This prototype demonstrates live mapping, filtering, and a clean UI with a focus on
            practical commuter needs. Data is mocked temporarily and will be replaced with
            integrated APIs.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LearnMorePage;


