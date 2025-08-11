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
  useTheme,
  keyframes,
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
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import ParkingMap from '../components/ParkingMap';
import { fetchParkingLocations } from '../services/api';
import { ParkingLocation } from '../types/parking';
import { colors } from '../theme';

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

const HomePage: React.FC = () => {
  const theme = useTheme();
  const [locations, setLocations] = useState<ParkingLocation[]>([]);

  useEffect(() => {
    fetchParkingLocations().then(setLocations).catch(() => setLocations([]));
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
    { value: '3,309+', label: 'Live Sensors', icon: <CarIcon />, color: colors.primary[500] },
    { value: '41.7%', label: 'Availability Rate', icon: <TrendingIcon />, color: colors.secondary[500] },
    { value: '24/7', label: 'Real-time Updates', icon: <TimeIcon />, color: colors.accent[500] },
    { value: '100%', label: 'Accessible', icon: <AccessibilityIcon />, color: colors.success },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative', overflow: 'visible' }}>
      {/* Floating Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colors.primary[200], 0.2)} 0%, transparent 70%)`,
          animation: `${float} 6s ease-in-out infinite`,
          zIndex: 0,
          '@media (max-width: 1200px)': {
            right: '2%',
            width: 150,
            height: 150,
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colors.secondary[200], 0.15)} 0%, transparent 70%)`,
          animation: `${float} 8s ease-in-out infinite reverse`,
          zIndex: 0,
          '@media (max-width: 1200px)': {
            left: '3%',
            width: 120,
            height: 120,
          },
        }}
      />

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.neutral[50]} 100%)`,
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
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 4, sm: 6, md: 8, lg: 10 } }}>
          <Grid container spacing={6} alignItems="center">
            <Grid xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box sx={{ 
                  pl: { xs: 0, sm: 2, md: 4, lg: 6 },
                  pr: { xs: 2, sm: 2, md: 2, lg: 2 },
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}>
                  <Chip
                    label="🚀 Live Data Connected"
                    color="success"
                    variant="filled"
                    sx={{ 
                      mb: 3, 
                      fontWeight: 600, 
                      fontSize: '0.9rem',
                      animation: `${pulse} 2s ease-in-out infinite`,
                      background: `linear-gradient(45deg, ${colors.success} 30%, ${colors.accent[500]} 90%)`,
                      color: 'white',
                      boxShadow: `0 4px 15px ${alpha(colors.success, 0.4)}`,
                    }}
                  />
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

            <Grid xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <Slide direction="left" in timeout={1200}>
                <Box sx={{ width: '100%', mt: { xs: 2, sm: 3, md: 4 } }}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 4,
                      mb: 3,
                      background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[100]} 100%)`,
                      border: `1px solid ${alpha(colors.neutral[200], 0.5)}`,
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      zIndex: 3,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: colors.secondary[500],
                          width: 48,
                          height: 48,
                          animation: `${pulse} 2s ease-in-out infinite`,
                        }}
                      >
                        <TimeIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                          Today at a Glance
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Live insights from Melbourne's parking infrastructure
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: colors.warning,
                            animation: `${pulse} 2s ease-in-out infinite`,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Peak congestion expected 8:00-9:30 AM and 4:30-6:00 PM
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: colors.success,
                            animation: `${pulse} 2s ease-in-out infinite`,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Best off-street options near Collins St and Queen St
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: colors.info,
                            animation: `${pulse} 2s ease-in-out infinite`,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Family-friendly bays near Federation Square available
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                  
                  {/* Enhanced Map Card */}
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      p: 4,
                      background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[100]} 100%)`,
                      border: `1px solid ${alpha(colors.neutral[200], 0.5)}`,
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      zIndex: 3,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, ${colors.accent[500]}, ${colors.primary[500]}, ${colors.secondary[500]})`,
                        backgroundSize: '200% 100%',
                        animation: `${shimmer} 4s ease-in-out infinite`,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Avatar
                        sx={{
                          bgcolor: colors.accent[500],
                          width: 48,
                          height: 48,
                          animation: `${pulse} 2s ease-in-out infinite`,
                        }}
                      >
                        <LocationIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                          Live Parking Map
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Real-time availability across Melbourne CBD
                        </Typography>
                      </Box>
                    </Box>
                    <ParkingMap locations={locations} />
                  </Card>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Enhanced Stats Section */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 }, px: { xs: 4, sm: 6, md: 8, lg: 10 } }}>
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
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 }, px: { xs: 4, sm: 6, md: 8, lg: 10 } }}>
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
              Why Choose Melbourne Parking?
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
        <Container maxWidth="lg" sx={{ px: { xs: 4, sm: 6, md: 8, lg: 10 } }}>
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
                  startIcon={<TrendingIcon />}
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


