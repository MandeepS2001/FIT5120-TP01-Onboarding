import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Container,
  Chip,
  Avatar,
  alpha,
  Fade,
  Slide,
  Zoom,
  Grow,
  keyframes,
  Paper,
} from '@mui/material';
import {
  DirectionsCar as CarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingIcon,
  FamilyRestroom as FamilyIcon,
  Accessibility as AccessibilityIcon,
  Speed as SpeedIcon,
  Info as InfoIcon,
  ArrowForward as ArrowIcon,
  Star as StarIcon,
  FlashOn as FlashIcon,
  Map as MapIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { fetchParkingLocations } from '../services/api';
import { ParkingLocation } from '../types/parking';
import { colors } from '../theme';
import { calculateParkingMetrics, ParkingMetrics } from '../services/parkingDataService';

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

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const HomePage: React.FC = () => {
  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [parkingMetrics, setParkingMetrics] = useState<ParkingMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

  useEffect(() => {
    fetchParkingLocations().then(setLocations).catch(() => setLocations([]));
  }, []);

  useEffect(() => {
    const loadMetrics = async () => {
      setIsLoadingMetrics(true);
      try {
        const metrics = await calculateParkingMetrics();
        setParkingMetrics(metrics);
      } catch (error) {
        console.error('Error loading parking metrics:', error);
      } finally {
        setIsLoadingMetrics(false);
      }
    };

    loadMetrics();
  }, []);

  const featureCards = [
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: colors.primary[500] }} />,
      title: 'Real-time Availability',
      description: 'Live updates from 3,309+ CBD parking sensors and car parks across Melbourne.',
      color: colors.primary[500],
      gradient: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.primary[100]} 100%)`,
      delay: 0,
    },
    {
      icon: <TrendingIcon sx={{ fontSize: 40, color: colors.secondary[600] }} />,
      title: 'Smart Predictions',
      description: 'AI-powered forecasts for peak hours, events, and optimal parking times.',
      color: colors.secondary[600],
      gradient: `linear-gradient(135deg, ${colors.secondary[50]} 0%, ${colors.secondary[100]} 100%)`,
      delay: 200,
    },
    {
      icon: <FamilyIcon sx={{ fontSize: 40, color: colors.accent[600] }} />,
      title: 'Family-Focused',
      description: 'Highlighted childcare-friendly zones and accessible parking bays.',
      color: colors.accent[600],
      gradient: `linear-gradient(135deg, ${colors.accent[50]} 0%, ${colors.accent[100]} 100%)`,
      delay: 400,
    },
  ];

  const stats = [
    { 
      value: isLoadingMetrics ? '...' : `${parkingMetrics?.totalSensors.toLocaleString()}+`, 
      label: 'Live Sensors', 
      icon: <CarIcon />, 
      color: colors.primary[500] 
    },
    { 
      value: isLoadingMetrics ? '...' : `${parkingMetrics?.availabilityRate}%`, 
      label: 'Availability Rate', 
      icon: <TrendingIcon />, 
      color: colors.secondary[500] 
    },
    { 
      value: isLoadingMetrics ? '...' : '24/7', 
      label: 'Real-time Updates', 
      icon: <TimeIcon />, 
      color: colors.accent[500] 
    },
    { 
      value: isLoadingMetrics ? '...' : `${parkingMetrics?.accessibleSpots.toLocaleString()}+`, 
      label: 'Accessible', 
      icon: <AccessibilityIcon />, 
      color: colors.success 
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative', overflow: 'visible' }}>
      {/* Floating Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '3%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colors.primary[200], 0.3)} 0%, transparent 70%)`,
          animation: `${float} 6s ease-in-out infinite`,
          zIndex: 0,
          '@media (max-width: 1200px)': {
            right: '1%',
            width: 150,
            height: 150,
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colors.secondary[200], 0.2)} 0%, transparent 70%)`,
          animation: `${float} 8s ease-in-out infinite reverse`,
          zIndex: 0,
          '@media (max-width: 1200px)': {
            left: '2%',
            width: 120,
            height: 120,
          },
        }}
      />

      {/* Hero Section with Image */}
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
          <Grid container spacing={6} alignItems="center">
            <Grid xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Chip
                    label={isLoadingMetrics ? "🔄 Loading Real Data..." : "🚀 Live Data Connected"}
                    color="success"
                    variant="filled"
                    sx={{ 
                      mb: 3, 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      animation: isLoadingMetrics ? 'none' : `${pulse} 2s ease-in-out infinite`,
                      background: `linear-gradient(45deg, ${colors.success} 30%, ${colors.accent[500]} 90%)`,
                      color: 'white',
                      boxShadow: `0 4px 15px ${alpha(colors.success, 0.4)}`,
                    }}
                  />
                  {parkingMetrics && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Last updated: {parkingMetrics.lastUpdated}
                    </Typography>
                  )}
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
                    Smarter Parking for Busy Melbourne Families
                  </Typography>
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    paragraph
                    sx={{ mb: 4, fontWeight: 400, lineHeight: 1.6 }}
                  >
                    Real-time availability, predictions, and accessible options in the CBD—
                    helping working parents save time and reduce stress.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      component={RouterLink}
                      to="/map"
                      startIcon={<LocationIcon />}
                      endIcon={<ArrowIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                        boxShadow: `0 8px 25px ${alpha(colors.primary[500], 0.3)}`,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-3px) scale(1.02)',
                          boxShadow: `0 12px 35px ${alpha(colors.primary[500], 0.4)}`,
                          background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
                        },
                        '&:active': {
                          transform: 'translateY(-1px) scale(0.98)',
                        },
                      }}
                    >
                      View Parking Near Me
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={RouterLink}
                      to="/learn-more"
                      startIcon={<InfoIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderWidth: 2,
                        borderRadius: 3,
                        borderColor: colors.primary[500],
                        color: colors.primary[600],
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          borderWidth: 3,
                          background: alpha(colors.primary[500], 0.04),
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 25px ${alpha(colors.primary[500], 0.2)}`,
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            {/* Hero Image Section */}
            <Grid xs={12} md={6}>
              <Slide direction="left" in timeout={1200}>
                <Box sx={{ position: 'relative' }}>
                  {/* Hero Image Card */}
                  <Card
                    elevation={0}
                    sx={{
                      p: 0,
                      background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[100]} 100%)`,
                      border: `1px solid ${alpha(colors.neutral[200], 0.5)}`,
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, ${colors.primary[500]}, ${colors.secondary[500]}, ${colors.accent[500]})`,
                        backgroundSize: '200% 100%',
                        animation: `${shimmer} 3s ease-in-out infinite`,
                      },
                    }}
                  >
                    {/* Hero Image Placeholder */}
                    <Box
                      sx={{
                        height: { xs: 300, md: 400 },
                        background: `linear-gradient(135deg, ${colors.primary[100]} 0%, ${colors.secondary[100]} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231976D2' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                          opacity: 0.5,
                        },
                      }}
                    >
                      {/* Melbourne City Skyline Icon */}
                      <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <Box
                          sx={{
                            fontSize: { xs: '4rem', md: '6rem' },
                            color: colors.primary[500],
                            mb: 2,
                            animation: `${float} 4s ease-in-out infinite`,
                          }}
                        >
                          🏙️
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: colors.primary[700],
                            fontWeight: 600,
                            animation: `${fadeInUp} 1s ease-out`,
                          }}
                        >
                          Melbourne CBD
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: colors.primary[600],
                            opacity: 0.8,
                            animation: `${fadeInUp} 1s ease-out 0.2s both`,
                          }}
                        >
                          Smart Parking Infrastructure
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Quick Stats Overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap',
                      }}
                    >
                      <Chip
                        label="3,309+ Sensors"
                        size="small"
                        sx={{
                          bgcolor: alpha(colors.success, 0.9),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label="Live Data"
                        size="small"
                        sx={{
                          bgcolor: alpha(colors.primary[500], 0.9),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label="Family-Friendly"
                        size="small"
                        sx={{
                          bgcolor: alpha(colors.accent[500], 0.9),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Card>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Today at a Glance Section - Moved Down */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, sm: 4, md: 5 } }}>
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
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
              Today at a Glance
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Live insights from Melbourne's parking infrastructure
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          <Grid xs={12} md={4}>
            <Grow in timeout={800}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(colors.warning, 0.1)} 0%, ${alpha(colors.warning, 0.05)} 100%)`,
                                          border: `1px solid ${alpha(colors.warning, 0.2)}`,
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: colors.warning[500],
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: colors.warning[500],
                      width: 48,
                      height: 48,
                      animation: `${pulse} 2s ease-in-out infinite`,
                    }}
                  >
                    <TimeIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      Peak Hours
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Congestion alerts
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {isLoadingMetrics ? 'Loading real-time data...' : 
                    `${parkingMetrics?.availableSpots.toLocaleString()} spots available now`
                  }
                </Typography>
              </Card>
            </Grow>
          </Grid>

          <Grid xs={12} md={4}>
            <Grow in timeout={1000}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(colors.success, 0.1)} 0%, ${alpha(colors.success, 0.05)} 100%)`,
                                          border: `1px solid ${alpha(colors.success, 0.2)}`,
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: colors.success[500],
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: colors.success[500],
                      width: 48,
                      height: 48,
                      animation: `${pulse} 2s ease-in-out infinite`,
                    }}
                  >
                    <LocationIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      Best Options
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Recommended spots
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {isLoadingMetrics ? 'Loading recommendations...' : 
                    `${parkingMetrics?.totalSpots.toLocaleString()} total parking spots across Melbourne`
                  }
                </Typography>
              </Card>
            </Grow>
          </Grid>

          <Grid xs={12} md={4}>
            <Grow in timeout={1200}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  background: `linear-gradient(135deg, ${alpha(colors.info, 0.1)} 0%, ${alpha(colors.info, 0.05)} 100%)`,
                                          border: `1px solid ${alpha(colors.info, 0.2)}`,
                  borderRadius: 4,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: colors.info[500],
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: colors.info[500],
                      width: 48,
                      height: 48,
                      animation: `${pulse} 2s ease-in-out infinite`,
                    }}
                  >
                    <FamilyIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      Family-Friendly
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Accessible bays
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {isLoadingMetrics ? 'Loading family-friendly data...' : 
                    `${parkingMetrics?.familyFriendlySpots.toLocaleString()} family-friendly spots available`
                  }
                </Typography>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Container>

      {/* Enhanced Stats Section */}
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
              Melbourne Parking by the Numbers
            </Typography>
          </Fade>
          <Fade in timeout={1000}>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Real-time data from our comprehensive parking infrastructure network
            </Typography>
          </Fade>
        </Box>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid xs={6} md={3} key={index}>
              <Grow in timeout={800 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${alpha(stat.color, 0.05)} 0%, ${alpha(stat.color, 0.1)} 100%)`,
                    border: `1px solid ${alpha(stat.color, 0.2)}`,
                    borderRadius: 4,
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: `0 12px 40px ${alpha(stat.color, 0.15)}`,
                      background: `linear-gradient(135deg, ${alpha(stat.color, 0.08)} 0%, ${alpha(stat.color, 0.15)} 100%)`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2,
                      animation: `${float} 3s ease-in-out infinite`,
                      animationDelay: `${index * 0.5}s`,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(stat.color, 0.1),
                        color: stat.color,
                        width: 64,
                        height: 64,
                        fontSize: '1.5rem',
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>
                  <Typography
                    variant="h3"
                    component="div"
                    fontWeight="bold"
                    sx={{
                      color: stat.color,
                      mb: 1,
                      animation: `${pulse} 2s ease-in-out infinite`,
                      animationDelay: `${index * 0.3}s`,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight="500">
                    {stat.label}
                  </Typography>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Enhanced Features Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in timeout={800}>
            <Typography
              variant="h2"
              component="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.accent[600]} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Why Choose Park Pal?
            </Typography>
          </Fade>
          <Fade in timeout={1000}>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Cutting-edge technology meets family-friendly design for the ultimate parking experience
            </Typography>
          </Fade>
        </Box>

        <Grid container spacing={4}>
          {featureCards.map((feature, index) => (
            <Grid xs={12} md={4} key={index}>
              <Zoom in timeout={1000 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    background: feature.gradient,
                    border: `1px solid ${alpha(feature.color, 0.2)}`,
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
                      background: `linear-gradient(90deg, ${feature.color}, ${alpha(feature.color, 0.7)})`,
                      backgroundSize: '200% 100%',
                      animation: `${shimmer} 3s ease-in-out infinite`,
                    },
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: `0 16px 48px ${alpha(feature.color, 0.2)}`,
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                    },
                  }}
                >
                  <Box 
                    className="feature-icon"
                    sx={{ 
                      textAlign: 'center', 
                      mb: 3,
                      transition: 'all 0.3s ease-in-out',
                      animation: `${float} 4s ease-in-out infinite`,
                      animationDelay: `${feature.delay}ms`,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Enhanced CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[800]} 100%)`,
          py: { xs: 8, md: 12 },
          mt: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ textAlign: 'center', color: 'white', position: 'relative', zIndex: 1 }}>
            <Fade in timeout={800}>
              <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
                Ready to Transform Your Parking Experience?
              </Typography>
            </Fade>
            <Fade in timeout={1000}>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                Join thousands of Melbourne families who've already discovered the convenience of smart parking
              </Typography>
            </Fade>
            <Fade in timeout={1200}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/map"
                  startIcon={<LocationIcon />}
                  endIcon={<ArrowIcon />}
                  sx={{
                    bgcolor: 'white',
                    color: colors.primary[700],
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: colors.neutral[100],
                      transform: 'translateY(-3px) scale(1.02)',
                      boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
                    },
                    '&:active': {
                      transform: 'translateY(-1px) scale(0.98)',
                    },
                  }}
                >
                  Get Started Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/data-insights"
                  startIcon={<AnalyticsIcon />}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: alpha('#FFFFFF', 0.1),
                      borderColor: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  View Data Insights
                </Button>
              </Box>
            </Fade>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;


