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
  Park as ParkIcon,
  Security as SecurityIcon,
  Wifi as WifiIcon,
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

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(33, 150, 243, 0.3); }
  50% { box-shadow: 0 0 40px rgba(33, 150, 243, 0.6); }
`;

// Light theme HomePage with ABBASS-inspired glassmorphism effects
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
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231976D2' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        opacity: 0.5,
      },
    }}>
      {/* Floating Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(33, 150, 243, 0.1) 0%, transparent 70%)',
          animation: `${float} 8s ease-in-out infinite`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '20%',
          left: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(156, 39, 176, 0.08) 0%, transparent 70%)',
          animation: `${float} 10s ease-in-out infinite reverse`,
          zIndex: 0,
        }}
      />

      {/* Hero Section - ABBASS Style */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 16 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 4, md: 5 } }}>
          <Grid container spacing={6} alignItems="center">
            {/* Left Content - Hero Text */}
            <Grid xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Chip
                    label={isLoadingMetrics ? "🔄 Loading Real Data..." : "🚀 Live Data Connected"}
                    sx={{ 
                      mb: 3, 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      animation: isLoadingMetrics ? 'none' : `${pulse} 2s ease-in-out infinite`,
                      background: 'linear-gradient(45deg, #4CAF50 30%, #2196F3 90%)',
                      color: '#fff',
                      boxShadow: `0 4px 15px ${alpha('#4CAF50', 0.4)}`,
                    }}
                  />
                  {parkingMetrics && (
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
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
                      color: 'text.primary',
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      textShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
                    }}
                  >
                    Smart Parking is Our Business
                  </Typography>
                  <Typography
                    variant="h5"
                    paragraph
                    sx={{ 
                      mb: 4, 
                      fontWeight: 400, 
                      lineHeight: 1.6,
                      color: 'text.secondary',
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                    }}
                  >
                    Real-time availability, AI-powered predictions, and accessible options across Melbourne CBD— 
                    helping busy families save time and reduce stress with intelligent parking solutions.
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
                        background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                        color: '#fff',
                        boxShadow: `0 8px 25px ${alpha('#2196F3', 0.4)}`,
                        transition: 'all 0.3s ease-in-out',
                        animation: `${glow} 3s ease-in-out infinite`,
                        '&:hover': {
                          transform: 'translateY(-3px) scale(1.02)',
                          boxShadow: `0 12px 35px ${alpha('#2196F3', 0.6)}`,
                          background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                        },
                        '&:active': {
                          transform: 'translateY(-1px) scale(0.98)',
                        },
                      }}
                    >
                      Find Parking Now
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
                          boxShadow: `0 8px 25px ${alpha(colors.primary[500], 0.3)}`,
                        },
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            {/* Right Content - Glassmorphism Form */}
            <Grid xs={12} md={6}>
              <Slide direction="left" in timeout={1200}>
                <Box sx={{ position: 'relative' }}>
                  {/* Glassmorphism Card */}
                  <Card
                    elevation={0}
                    sx={{
                      p: 4,
                      background: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        background: 'linear-gradient(90deg, #2196F3, #9C27B0, #FF9800)',
                        backgroundSize: '200% 100%',
                        animation: `${shimmer} 3s ease-in-out infinite`,
                      },
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 700,
                        mb: 3,
                        textAlign: 'center',
                      }}
                    >
                      What's my parking availability?
                    </Typography>
                    
                    {/* Stats Grid */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      {stats.map((stat, index) => (
                        <Grid xs={6} key={index}>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 2,
                              borderRadius: 2,
                              background: 'rgba(255, 255, 255, 0.5)',
                              border: `1px solid ${alpha(stat.color, 0.2)}`,
                              transition: 'all 0.3s ease-in-out',
                              '&:hover': {
                                transform: 'translateY(-5px)',
                                background: 'rgba(255, 255, 255, 0.8)',
                                border: `1px solid ${alpha(stat.color, 0.4)}`,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mb: 1,
                                animation: `${float} 3s ease-in-out infinite`,
                                animationDelay: `${index * 0.5}s`,
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: alpha(stat.color, 0.2),
                                  color: stat.color,
                                  width: 48,
                                  height: 48,
                                  fontSize: '1.2rem',
                                }}
                              >
                                {stat.icon}
                              </Avatar>
                            </Box>
                            <Typography
                              variant="h4"
                              component="div"
                              fontWeight="bold"
                              sx={{
                                color: stat.color,
                                mb: 0.5,
                                animation: `${pulse} 2s ease-in-out infinite`,
                                animationDelay: `${index * 0.3}s`,
                              }}
                            >
                              {stat.value}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                              {stat.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>

                    {/* Quick Actions */}
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label="3,309+ Sensors"
                        size="small"
                        sx={{
                          bgcolor: alpha(colors.success, 0.2),
                          color: colors.success,
                          fontWeight: 600,
                          border: `1px solid ${alpha(colors.success, 0.3)}`,
                        }}
                      />
                      <Chip
                        label="Live Data"
                        size="small"
                        sx={{
                          bgcolor: alpha(colors.primary[500], 0.2),
                          color: colors.primary[500],
                          fontWeight: 600,
                          border: `1px solid ${alpha(colors.primary[500], 0.3)}`,
                        }}
                      />
                      <Chip
                        label="Family-Friendly"
                        size="small"
                        sx={{
                          bgcolor: alpha(colors.accent[500], 0.2),
                          color: colors.accent[500],
                          fontWeight: 600,
                          border: `1px solid ${alpha(colors.accent[500], 0.3)}`,
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

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 }, px: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Fade in timeout={800}>
            <Typography
              variant="h2"
              component="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: 'text.primary',
                fontSize: { xs: '2rem', md: '3rem' },
                textShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
              }}
            >
              Why Choose Park Pal?
            </Typography>
          </Fade>
          <Fade in timeout={1000}>
            <Typography variant="h6" sx={{ maxWidth: 600, mx: 'auto', color: 'text.secondary' }}>
              Cutting-edge technology meets family-friendly design for the ultimate parking experience
            </Typography>
          </Fade>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              icon: <SpeedIcon sx={{ fontSize: 40, color: colors.primary[500] }} />,
              title: 'Real-time Availability',
              description: 'Live updates from 3,309+ CBD parking sensors and car parks across Melbourne.',
              color: colors.primary[500],
            },
            {
              icon: <TrendingIcon sx={{ fontSize: 40, color: colors.secondary[500] }} />,
              title: 'AI Predictions',
              description: 'Smart forecasts for peak hours, events, and optimal parking times.',
              color: colors.secondary[500],
            },
            {
              icon: <FamilyIcon sx={{ fontSize: 40, color: colors.accent[500] }} />,
              title: 'Family-Focused',
              description: 'Highlighted childcare-friendly zones and accessible parking bays.',
              color: colors.accent[500],
            },
          ].map((feature, index) => (
            <Grid xs={12} md={4} key={index}>
              <Zoom in timeout={1000 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 4,
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
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
                      height: 3,
                      background: `linear-gradient(90deg, ${feature.color}, ${alpha(feature.color, 0.7)})`,
                      backgroundSize: '200% 100%',
                      animation: `${shimmer} 3s ease-in-out infinite`,
                    },
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: `0 16px 48px ${alpha(feature.color, 0.2)}`,
                      background: 'rgba(255, 255, 255, 0.9)',
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
                      animationDelay: `${index * 0.5}s`,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom sx={{ color: 'text.primary' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6, color: 'text.secondary' }}>
                    {feature.description}
                  </Typography>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
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
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231976D2' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.3,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ textAlign: 'center', color: 'text.primary', position: 'relative', zIndex: 1 }}>
            <Fade in timeout={800}>
              <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
                Ready to Transform Your Parking Experience?
              </Typography>
            </Fade>
            <Fade in timeout={1000}>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto', color: 'text.secondary' }}>
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
                    bgcolor: colors.primary[500],
                    color: '#fff',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    animation: `${glow} 3s ease-in-out infinite`,
                    '&:hover': {
                      bgcolor: colors.primary[600],
                      transform: 'translateY(-3px) scale(1.02)',
                      boxShadow: `0 12px 35px ${alpha(colors.primary[500], 0.4)}`,
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
                    borderColor: colors.primary[500],
                    color: colors.primary[600],
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: alpha(colors.primary[500], 0.04),
                      borderColor: colors.primary[500],
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha(colors.primary[500], 0.3)}`,
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


