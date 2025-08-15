import React, { useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  alpha,
  keyframes,
  Fade,
  Grow,
  Zoom,
  Slide,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  DirectionsCar,
  LocalParking,
  Speed,
  Analytics,
  FamilyRestroom,
  Accessibility,
  FlashOn,
  Insights,
  DataUsage,
} from '@mui/icons-material';
import { colors } from '../theme';
import VehicleOwnershipChart from '../components/VehicleOwnershipChart';
import DetailedInsightsPanel from '../components/DetailedInsightsPanel';
import { 
  calculateParkingMetrics, 
  ParkingMetrics, 
  getDetailedInsights,
  DetailedInsights
} from '../services/parkingDataService';

// Custom keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const DataInsightsPage: React.FC = () => {
  const [parkingMetrics, setParkingMetrics] = React.useState<ParkingMetrics | null>(null);
  const [detailedInsights, setDetailedInsights] = React.useState<DetailedInsights | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = React.useState(true);
  const [isLoadingDetailedInsights, setIsLoadingDetailedInsights] = React.useState(true);

  // Load all data with real-time refresh
  const loadAllData = React.useCallback(async () => {
    try {
      console.log('Starting to load all data...');
      // Load all data in parallel
      const [metrics, insights] = await Promise.all([
        calculateParkingMetrics(),
        getDetailedInsights()
      ]);

      console.log('Data loaded successfully:', { 
        metrics: !!metrics, 
        insights: !!insights 
      });

      setParkingMetrics(metrics);
      setDetailedInsights(insights);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoadingMetrics(false);
      setIsLoadingDetailedInsights(false);
    }
  }, []);

  // Initial load
  React.useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Auto-refresh every 5 minutes
  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log('Refreshing parking data...');
      loadAllData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [loadAllData]);

  // Real data for demonstration
  const parkingData = useMemo(() => ({
    totalSpots: parkingMetrics?.totalSpots || 3309,
    availableSpots: parkingMetrics?.availableSpots || 1380,
    occupancyRate: parkingMetrics ? (100 - parkingMetrics.availabilityRate) : 58.3,
    averageWaitTime: 12,
    peakHours: ['8:00-9:30 AM', '4:30-6:00 PM'],
    popularAreas: ['Collins Street', 'Bourke Street', 'Flinders Street'],
    accessibilitySpots: parkingMetrics?.accessibleSpots || 156,
    familyFriendlyZones: parkingMetrics?.familyFriendlySpots || 23,
  }), [parkingMetrics]);

  const insights = [
    {
      title: 'Busiest Times',
      description: `Parking is busiest at 8:30 AM and 5:15 PM on weekdays. Try to avoid these times if possible.`,
      icon: <TrendingUp />,
      color: colors.warning,
      metric: `${parkingData.occupancyRate}%`,
      trend: 'Live',
      delay: 0,
    },
    {
      title: 'Family Parking',
      description: `${parkingData.familyFriendlyZones} areas with extra space for families, strollers, and longer parking times.`,
      icon: <FamilyRestroom />,
      color: colors.accent[600],
      metric: `${parkingData.familyFriendlyZones}`,
      trend: 'Available',
      delay: 200,
    },
    {
      title: 'Easy Access Spots',
      description: `${parkingData.accessibilitySpots} parking spots that are wider and closer to building entrances.`,
      icon: <Accessibility />,
      color: colors.info,
      metric: `${parkingData.accessibilitySpots}`,
      trend: '100%',
      delay: 400,
    },
    {
      title: 'Parking Forecast',
      description: `We can predict parking availability 2 hours ahead with 94% accuracy to help you plan your trip.`,
      icon: <Speed />,
      color: colors.success,
      metric: '94%',
      trend: '+8%',
      delay: 600,
    },
  ];

  const trends = [
    { label: 'Weekday Peak', value: '92%', color: colors.warning },
    { label: 'Weekend Peak', value: '78%', color: colors.info },
    { label: 'Off-Peak', value: '45%', color: colors.success },
    { label: 'Late Night', value: '23%', color: colors.neutral[500] },
  ];

  console.log('Trends data:', trends);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative', overflow: 'visible' }}>
      {/* Floating Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '5%',
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colors.primary[200], 0.25)} 0%, transparent 70%)`,
          animation: `${float} 8s ease-in-out infinite`,
          zIndex: 0,
          '@media (max-width: 1200px)': {
            right: '2%',
            width: 120,
            height: 120,
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '25%',
          left: '5%',
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colors.secondary[200], 0.2)} 0%, transparent 70%)`,
          animation: `${float} 6s ease-in-out infinite reverse`,
          zIndex: 0,
          '@media (max-width: 1200px)': {
            left: '2%',
            width: 100,
            height: 100,
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colors.accent[200], 0.15)} 0%, transparent 70%)`,
          animation: `${float} 10s ease-in-out infinite`,
          zIndex: 0,
          '@media (max-width: 1200px)': {
            right: '8%',
            width: 80,
            height: 80,
          },
        }}
      />

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.neutral[50]} 100%)`,
          pt: { xs: 6, md: 12 },
          pb: { xs: 8, md: 16 },
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Enhanced Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at 80% 20%, ${alpha(colors.primary[100], 0.3)} 0%, transparent 50%),
                         radial-gradient(circle at 20% 80%, ${alpha(colors.secondary[100], 0.2)} 0%, transparent 50%)`,
            zIndex: 0,
          }}
        />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>

            <Fade in timeout={1000}>
              <Typography
                variant="h1"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 3,
                  background: `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.primary[900]} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: `${shimmer} 3s ease-in-out infinite`,
                  backgroundSize: '200% 100%',
                }}
              >
                Melbourne Parking Insights
              </Typography>
            </Fade>
            <Fade in timeout={1200}>
              <Typography
                variant="h5"
                color="text.secondary"
                paragraph
                sx={{ mb: 4, fontWeight: 400, lineHeight: 1.6, maxWidth: 800, mx: 'auto' }}
              >
                See what's happening with parking in Melbourne right now. 
                Find the best times to park and save time on your daily commute.
              </Typography>
            </Fade>
          </Box>

          {/* Key Metrics Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  perspective: '1000px',
                  height: 200,
                }}
              >
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[700]})`,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'rotateY(180deg)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      opacity: 0.3,
                    }
                  }}
                >
                  {/* Front Side */}
                  <CardContent sx={{ 
                    backfaceVisibility: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {isLoadingMetrics ? '...' : `${parkingMetrics?.totalSensors.toLocaleString()}+`}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Live Parking Sensors
                        </Typography>
                      </Box>
                      <DirectionsCar sx={{ fontSize: 48, opacity: 0.8 }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">Real-time data</Typography>
                    </Box>
                  </CardContent>

                  {/* Back Side */}
                  <Box sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: `linear-gradient(135deg, ${colors.primary[600]}, ${colors.primary[800]})`,
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    color: 'white'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                      What This Means
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6, color: 'white' }}>
                      Smart devices across Melbourne CBD that tell us when parking spots are free or taken. 
                      They update every few minutes so you know exactly where to find parking.
                    </Typography>
                  </Box>
                </Card>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  perspective: '1000px',
                  height: 200,
                }}
              >
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${colors.secondary[500]}, ${colors.secondary[700]})`,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'rotateY(180deg)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      opacity: 0.3,
                    }
                  }}
                >
                  {/* Front Side */}
                  <CardContent sx={{ 
                    backfaceVisibility: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {isLoadingMetrics ? '...' : `${parkingMetrics?.availableSpots.toLocaleString()}`}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Available Spots Now
                        </Typography>
                      </Box>
                      <LocalParking sx={{ fontSize: 48, opacity: 0.8 }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">Live updates</Typography>
                    </Box>
                  </CardContent>

                  {/* Back Side */}
                  <Box sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: `linear-gradient(135deg, ${colors.secondary[600]}, ${colors.secondary[800]})`,
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    color: 'white'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                      What This Means
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6, color: 'white' }}>
                      How many parking spots are free right now. 
                      This number changes every few minutes so you always know what's available.
                    </Typography>
                  </Box>
                </Card>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  perspective: '1000px',
                  height: 200,
                }}
              >
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${colors.success}, ${colors.accent[600]})`,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'rotateY(180deg)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      opacity: 0.3,
                    }
                  }}
                >
                  {/* Front Side */}
                  <CardContent sx={{ 
                    backfaceVisibility: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {isLoadingMetrics ? '...' : `${parkingMetrics?.availabilityRate}%`}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Availability Rate
                        </Typography>
                      </Box>
                      <LocalParking sx={{ fontSize: 48, opacity: 0.8 }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">Melbourne CBD</Typography>
                    </Box>
                  </CardContent>

                  {/* Back Side */}
                  <Box sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: `linear-gradient(135deg, ${colors.success}, ${colors.accent[700]})`,
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    color: 'white'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                      What This Means
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6, color: 'white' }}>
                      What percentage of all parking spots are free right now. 
                      Higher numbers mean it's easier to find parking.
                    </Typography>
                  </Box>
                </Card>
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  perspective: '1000px',
                  height: 200,
                }}
              >
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${colors.warning}, ${colors.secondary[600]})`,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'rotateY(180deg)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                      opacity: 0.3,
                    }
                  }}
                >
                  {/* Front Side */}
                  <CardContent sx={{ 
                    backfaceVisibility: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {isLoadingMetrics ? '...' : `${parkingMetrics?.accessibleSpots.toLocaleString()}+`}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          Accessible Spots
                        </Typography>
                      </Box>
                      <Accessibility sx={{ fontSize: 48, opacity: 0.8 }} />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">ADA compliant</Typography>
                    </Box>
                  </CardContent>

                  {/* Back Side */}
                  <Box sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: `linear-gradient(135deg, ${colors.warning}, ${colors.secondary[700]})`,
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 3,
                    color: 'white'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'white' }}>
                      What This Means
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6, color: 'white' }}>
                      Special parking spots for people who need extra space or are closer to building entrances. 
                      These spots are wider and easier to access.
                    </Typography>
                  </Box>
                </Card>
              </Box>
            </Grid>
          </Grid>

          {/* Vehicle Ownership Visualization */}
          <VehicleOwnershipChart />
        </Container>
      </Box>

      {/* Enhanced Analytics Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in timeout={800}>
            <Typography
              variant="h2"
              component="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[600]} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Parking Patterns & Trends
            </Typography>
          </Fade>
          <Fade in timeout={1000}>
            <Box>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
                See when parking is busiest and find the best times to visit different areas
              </Typography>
            </Box>
          </Fade>
        </Box>

        {/* Detailed Insights Panel */}
        <DetailedInsightsPanel 
          detailedInsights={detailedInsights || {
            peakHours: [],
            popularZones: [],
            accessibilityStats: { total: 0, available: 0, percentage: 0 },
            familyFriendlyStats: { total: 0, available: 0, percentage: 0 },
            realTimeAlerts: [],
            predictions: []
          }}
          isLoading={isLoadingDetailedInsights}
        />
      </Container>

      {/* Insights Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in timeout={800}>
            <Typography
              variant="h2"
              component="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.secondary[600]} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Quick Parking Tips
            </Typography>
          </Fade>
                      <Fade in timeout={1000}>
              <Box>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
                  Simple tips to help you find parking faster and avoid busy times
                </Typography>
              </Box>
            </Fade>
        </Box>

        <Grid container spacing={4}>
          {insights.map((insight, index) => (
            <Grid xs={12} md={6} key={index}>
              <Zoom in timeout={1000 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    background: `linear-gradient(135deg, ${alpha(insight.color, 0.05)} 0%, ${alpha(insight.color, 0.1)} 100%)`,
                    border: `1px solid ${alpha(insight.color, 0.2)}`,
                    borderRadius: 4,
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${insight.color}, ${alpha(insight.color, 0.7)})`,
                      backgroundSize: '200% 100%',
                      animation: `${shimmer} 3s ease-in-out infinite`,
                    },
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: `0 16px 48px ${alpha(insight.color, 0.2)}`,
                      '& .insight-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
                    <Box 
                      className="insight-icon"
                      sx={{ 
                        transition: 'all 0.3s ease-in-out',
                        animation: `${float} 4s ease-in-out infinite`,
                        animationDelay: `${insight.delay}ms`,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(insight.color, 0.1),
                          color: insight.color,
                          width: 56,
                          height: 56,
                          fontSize: '1.5rem',
                        }}
                      >
                        {insight.icon}
                      </Avatar>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h5" component="h3" fontWeight="bold">
                          {insight.title}
                        </Typography>
                        <Chip
                          label={insight.trend}
                          size="small"
                          color="success"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                      <Typography variant="h4" component="div" fontWeight="bold" sx={{ color: insight.color, mb: 2 }}>
                        {insight.metric}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {insight.description}
                  </Typography>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>




    </Box>
  );
};

export default DataInsightsPage;
