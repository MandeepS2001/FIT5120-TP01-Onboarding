import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessibleIcon from '@mui/icons-material/Accessible';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import TimelineIcon from '@mui/icons-material/Timeline';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const LearnMorePage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 4, md: 5 } }}>
        
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Park Pal Melbourne
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
            Your Smart Parking Companion for Melbourne CBD
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto', fontSize: '1.1rem' }}>
            Discover real-time parking availability, find family-friendly spots, and navigate Melbourne's CBD with confidence. 
            Powered by live data from Melbourne's parking infrastructure.
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardHeader
                avatar={<MapIcon color="primary" sx={{ fontSize: 40 }} />}
                title="Real-Time Mapping"
                titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Interactive map showing live parking availability across Melbourne CBD. 
                  Color-coded markers indicate availability levels in real-time.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardHeader
                avatar={<SearchIcon color="primary" sx={{ fontSize: 40 }} />}
                title="Smart Search"
                titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Search for specific locations, landmarks, or addresses. 
                  Get instant parking recommendations with availability predictions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
              <CardHeader
                avatar={<AnalyticsIcon color="primary" sx={{ fontSize: 40 }} />}
                title="Data Insights"
                titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive analytics showing parking trends, peak hours, 
                  and historical data to help you plan your journey.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Data Sources Section */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Real Data Sources
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
            Park Pal uses live data from Melbourne's official parking infrastructure to provide accurate, 
            up-to-date information about parking availability across the city.
          </Typography>
          
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader
                  avatar={<LocationOnIcon color="success" />}
                  title="On-Street Parking Sensors"
                  subheader="Real-time individual parking bay data"
                />
                <CardContent>
                  <Typography variant="body2" paragraph>
                    Live data from over 3,000 parking sensors across Melbourne CBD, 
                    providing real-time occupancy status for individual parking bays.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="3,000+ Sensors" color="success" size="small" />
                    <Chip label="Real-time Updates" color="info" size="small" />
                    <Chip label="Zone-based" color="warning" size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader
                  avatar={<DirectionsCarIcon color="success" />}
                  title="Off-Street Car Parks"
                  subheader="Commercial parking facility data"
                />
                <CardContent>
                  <Typography variant="body2" paragraph>
                    Information on over 1,180 commercial car parks including capacity, 
                    location, and estimated availability across Melbourne.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="1,180+ Locations" color="success" size="small" />
                    <Chip label="Capacity Data" color="info" size="small" />
                    <Chip label="Commercial" color="warning" size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* How to Use Section */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            How to Use Park Pal
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                🗺️ Parking Map
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="View color-coded parking markers on the interactive map" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Green markers: Good availability (>50%)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Orange markers: Moderate availability (20-50%)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Red markers: Low availability (1-20%)" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Dark red markers: No availability (0%)" />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                🔍 Search & Navigation
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Use the search bar to find specific locations" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Click on markers for detailed parking information" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Use quick location buttons for popular destinations" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="Get current location with the GPS button" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        {/* Features for Families */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Family-Friendly Features
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
            Park Pal is designed with families in mind, helping parents find convenient, 
            safe, and accessible parking options across Melbourne.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <AccessibleIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Accessible Parking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Find parking spots with accessibility features, 
                  including wheelchair access and family-friendly facilities.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <FamilyRestroomIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Family Spaces
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Locate parking areas with extra space for prams, 
                  car seats, and family loading/unloading.
                </Typography>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ textAlign: 'center', p: 2 }}>
                <TimelineIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Peak Time Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Plan your trips with insights into peak parking hours 
                  and availability predictions.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Data Coverage */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Coverage Areas
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
            Park Pal covers comprehensive parking data across Melbourne's central business district 
            and surrounding areas, ensuring you can find parking wherever you need to go.
          </Typography>
          
          <Grid container spacing={2}>
            {[
              'Melbourne CBD', 'Southbank', 'Docklands', 'Carlton', 
              'North Melbourne', 'East Melbourne', 'West Melbourne', 'South Melbourne'
            ].map((area) => (
              <Grid item xs={6} sm={4} md={3} key={area}>
                <Chip 
                  label={area} 
                  variant="outlined" 
                  color="primary"
                  sx={{ width: '100%', mb: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Technical Information */}
        <Paper sx={{ p: 4, mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Technical Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Data Sources
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><DataUsageIcon color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="Melbourne Open Data Portal"
                    secondary="Official city parking data APIs"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DataUsageIcon color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="On-Street Parking Bay Sensors"
                    secondary="Real-time sensor data from individual parking bays"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><DataUsageIcon color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="Off-Street Car Parks"
                    secondary="Commercial parking facility information"
                  />
                </ListItem>
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Update Frequency
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="On-Street Sensors"
                    secondary="Real-time updates (every few minutes)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="Off-Street Car Parks"
                    secondary="Daily capacity updates"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><InfoIcon color="info" /></ListItemIcon>
                  <ListItemText 
                    primary="Analytics & Trends"
                    secondary="Historical data analysis and predictions"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        {/* Call to Action */}
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Find Your Perfect Parking Spot?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
            Start exploring Melbourne's parking options with real-time data and smart recommendations.
        </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Navigate to the Parking Map to begin your journey, or explore Data Insights 
            to understand parking patterns across the city.
        </Typography>
      </Paper>

      </Container>
    </Box>
  );
};

export default LearnMorePage;


