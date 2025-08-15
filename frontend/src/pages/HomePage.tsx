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
  LocationOn as LocationIcon,
  TrendingUp as TrendingIcon,
  FamilyRestroom as FamilyIcon,
  Speed as SpeedIcon,

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

// Light theme HomePage with inspired glassmorphism effects
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



  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Hero Section - ABBASS Style */}
      <Box
        sx={{
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 16 },
          position: 'relative',
          zIndex: 3,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Video Background for Hero Section Only */}
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          sx={{
            position: 'absolute',
            top: '-80px', // Extend above the header
            left: 0,
            width: '100%',
            height: 'calc(100% + 80px)', // Make taller to account for header
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/melb.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </Box>

        {/* Overlay for better text readability */}
        <Box
          sx={{
            position: 'absolute',
            top: '-80px', // Match video position
            left: 0,
            right: 0,
            bottom: 0,
            height: 'calc(100% + 80px)', // Match video height
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.99) 0%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.2) 100%)',
            zIndex: 1,
          }}
        />

        {/* Floating Background Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 'calc(10% - 80px)', // Adjust for extended video
            right: '5%',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(33, 150, 243, 0.1) 0%, transparent 70%)',
            animation: `${float} 8s ease-in-out infinite`,
            zIndex: 2,
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
            zIndex: 2,
          }}
        />
        <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 4, md: 5 }, position: 'relative', zIndex: 3 }}>
          <Grid container justifyContent="center">
            {/* Centered Content - Hero Text */}
            <Grid xs={12} md={8} lg={6}>
              <Fade in timeout={1000}>
                <Box sx={{ textAlign: 'center' }}>

                  <Typography
                    variant="h1"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 900,
                      lineHeight: 1.1,
                      mb: 3,
                      color: '#ffffff',
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                      textShadow: '0 4px 20px rgba(0, 0, 0, 0.8), 0 2px 8px rgba(0, 0, 0, 0.6)',
                      filter: 'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.7))',
                    }}
                  >
                    Find Your Perfect Parking Spot
                  </Typography>
                  <Typography
                    variant="h5"
                    paragraph
                    sx={{ 
                      mb: 4, 
                      fontWeight: 600, 
                      lineHeight: 1.6,
                      color: '#ffffff',
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                      maxWidth: 600,
                      mx: 'auto',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.6)',
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))',
                    }}
                  >
                    Discover real-time parking availability across Melbourne CBD with AI-powered predictions. 
                    Save time, reduce stress, and find the perfect spot for your family with our intelligent parking solution.
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      size="large"
                      component={RouterLink}
                      to="/map"
                      startIcon={<LocationIcon />}
                      endIcon={<ArrowIcon />}
                      sx={{
                        px: 8,
                        py: 2.5,
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                        color: '#fff',
                        boxShadow: `0 10px 30px ${alpha(colors.primary[500], 0.5)}`,
                        transition: 'all 0.3s ease-in-out',
                        textTransform: 'none',
                        '&:hover': {
                          transform: 'translateY(-3px) scale(1.02)',
                          boxShadow: `0 15px 40px ${alpha(colors.primary[500], 0.7)}`,
                          background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
                        },
                        '&:active': {
                          transform: 'translateY(-1px) scale(0.98)',
                        },
                      }}
                    >
                      Start Finding Parking
                    </Button>
                  </Box>
                                  </Box>
                </Fade>
              </Grid>
            </Grid>
          </Container>

          {/* Scroll Down Indicator */}
          <Box
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
              });
            }}
            sx={{
              position: 'absolute',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              cursor: 'pointer',
              padding: 2,
              borderRadius: 3,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateX(-50%) translateY(-5px)',
                '& .scroll-text': {
                  color: colors.primary[200],
                },
                '& .scroll-line': {
                  background: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.4) 100%)',
                  transform: 'scaleY(1.2)',
                },
              },
            }}
          >
            <Typography
              className="scroll-text"
              variant="h6"
              sx={{
                color: '#ffffff',
                fontWeight: 700,
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(255, 255, 255, 0.3)',
                fontSize: '1.25rem',
                letterSpacing: '1px',
                transition: 'all 0.3s ease-in-out',
                mb: 2,
                textTransform: 'uppercase',
                animation: `${pulse} 2s ease-in-out infinite`,
                '&:hover': {
                  color: '#87CEEB',
                  textShadow: '0 4px 8px rgba(0, 0, 0, 0.9), 0 0 30px rgba(135, 206, 235, 0.6)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              Scroll to explore
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                p: 2,
                borderRadius: '50px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '2px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 255, 255, 0.4)',
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box
                className="scroll-line"
                sx={{
                  width: 4,
                  height: 50,
                  background: 'linear-gradient(180deg, #00BFFF 0%, #1E90FF 50%, #4169E1 100%)',
                  borderRadius: 3,
                  animation: `${float} 2s ease-in-out infinite`,
                  position: 'relative',
                  transition: 'all 0.3s ease-in-out',
                  boxShadow: '0 0 15px rgba(0, 191, 255, 0.6), 0 0 30px rgba(30, 144, 255, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(180deg, #00BFFF 0%, #0066CC 50%, #0000CD 100%)',
                    boxShadow: '0 0 25px rgba(0, 191, 255, 0.8), 0 0 40px rgba(30, 144, 255, 0.6)',
                    transform: 'scale(1.1)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '10px solid #00BFFF',
                    transition: 'all 0.3s ease-in-out',
                    filter: 'drop-shadow(0 0 8px rgba(0, 191, 255, 0.8))',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 12 }, px: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
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
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '0 4px 20px rgba(33, 150, 243, 0.1)',
                mb: 3,
              }}
            >
              Why Choose Park Pal?
            </Typography>
          </Fade>
          <Fade in timeout={1000}>
            <Typography 
              variant="h5" 
              sx={{ 
                maxWidth: 700, 
                mx: 'auto', 
                color: 'text.secondary',
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Smart parking made simple - find the perfect spot for your family with real-time updates
            </Typography>
          </Fade>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              icon: <SpeedIcon sx={{ fontSize: 50, color: '#ffffff' }} />,
              title: 'Live Parking Updates',
              description: 'See which spots are available right now across Melbourne CBD.',
              color: '#2196F3',
              gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              bgGradient: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(25, 118, 210, 0.1) 100%)',
            },
            {
              icon: <TrendingIcon sx={{ fontSize: 50, color: '#ffffff' }} />,
              title: 'Smart Predictions',
              description: 'Know the best times to park and avoid busy periods.',
              color: '#FF9800',
              gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
              bgGradient: 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(245, 124, 0, 0.1) 100%)',
            },
            {
              icon: <FamilyIcon sx={{ fontSize: 50, color: '#ffffff' }} />,
              title: 'Family-Friendly',
              description: 'Find spots near childcare and easy-access parking areas.',
              color: '#4CAF50',
              gradient: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
              bgGradient: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(56, 142, 60, 0.1) 100%)',
            },
          ].map((feature, index) => (
            <Grid xs={12} md={4} key={index}>
              <Zoom in timeout={1000 + index * 200}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    p: 5,
                    background: feature.bgGradient,
                    backdropFilter: 'blur(20px)',
                    border: `2px solid ${alpha(feature.color, 0.2)}`,
                    borderRadius: 6,
                    transition: 'all 0.4s ease-in-out',
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
                      background: feature.gradient,
                      backgroundSize: '200% 100%',
                      animation: `${shimmer} 3s ease-in-out infinite`,
                    },
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.03)',
                      boxShadow: `0 20px 60px ${alpha(feature.color, 0.3)}`,
                      border: `2px solid ${alpha(feature.color, 0.4)}`,
                      '& .feature-icon': {
                        transform: 'scale(1.15) rotate(5deg)',
                      },
                      '& .feature-title': {
                        color: feature.color,
                      },
                    },
                  }}
                >
                  <Box 
                    className="feature-icon"
                    sx={{ 
                      textAlign: 'center', 
                      mb: 4,
                      transition: 'all 0.4s ease-in-out',
                      animation: `${float} 4s ease-in-out infinite`,
                      animationDelay: `${index * 0.5}s`,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: feature.gradient,
                        opacity: 0.1,
                        zIndex: -1,
                      },
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    className="feature-title"
                    variant="h5" 
                    component="h3" 
                    fontWeight="bold" 
                    gutterBottom 
                    sx={{ 
                      color: 'text.primary',
                      transition: 'color 0.4s ease-in-out',
                      textAlign: 'center',
                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      lineHeight: 1.7, 
                      color: 'text.secondary',
                      textAlign: 'center',
                      fontSize: '1.1rem',
                    }}
                  >
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


