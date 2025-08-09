import React, { useState, useMemo } from 'react';
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
  TrendingUp as TrendingIcon,
  DirectionsCar as CarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Speed as SpeedIcon,
  FamilyRestroom as FamilyIcon,
  Accessibility as AccessibilityIcon,
  Star as StarIcon,
  FlashOn as FlashIcon,
  Analytics as AnalyticsIcon,
  Insights as InsightsIcon,
  DataUsage as DataIcon,
} from '@mui/icons-material';
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

const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const DataInsightsPage: React.FC = () => {
  const theme = useTheme();

  // Mock data for demonstration
  const parkingData = useMemo(() => ({
    totalSpots: 3309,
    availableSpots: 1380,
    occupancyRate: 58.3,
    averageWaitTime: 12,
    peakHours: ['8:00-9:30 AM', '4:30-6:00 PM'],
    popularAreas: ['Collins Street', 'Bourke Street', 'Flinders Street'],
    accessibilitySpots: 156,
    familyFriendlyZones: 23,
  }), []);

  const insights = [
    {
      title: 'Peak Congestion Patterns',
      description: 'Morning rush peaks at 8:30 AM with 89% occupancy, while evening peaks at 5:15 PM with 92% occupancy.',
      icon: <TrendingIcon />,
      color: colors.warning,
      metric: '89%',
      trend: '+12%',
      delay: 0,
    },
    {
      title: 'Family-Friendly Zones',
      description: '23 designated areas with stroller access, changing facilities, and extended time limits.',
      icon: <FamilyIcon />,
      color: colors.accent[600],
      metric: '23',
      trend: '+3',
      delay: 200,
    },
    {
      title: 'Accessibility Coverage',
      description: '156 accessible parking bays across the CBD, with real-time availability tracking.',
      icon: <AccessibilityIcon />,
      color: colors.info,
      metric: '156',
      trend: '100%',
      delay: 400,
    },
    {
      title: 'Smart Predictions',
      description: 'AI-powered forecasting with 94% accuracy for parking availability up to 2 hours ahead.',
      icon: <SpeedIcon />,
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
            <Fade in timeout={800}>
              <Chip
                label="📊 Live Analytics Dashboard"
                color="primary"
                variant="filled"
                sx={{ 
                  mb: 3, 
                  fontWeight: 600, 
                  fontSize: '0.9rem',
                  animation: `${pulse} 2s ease-in-out infinite`,
                  background: `linear-gradient(45deg, ${colors.primary[500]} 30%, ${colors.secondary[500]} 90%)`,
                  color: 'white',
                  boxShadow: `0 4px 15px ${alpha(colors.primary[500], 0.4)}`,
                }}
              />
            </Fade>
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
                Real-time analytics and intelligent insights from our comprehensive parking infrastructure network. 
                Discover patterns, optimize your commute, and make informed parking decisions.
              </Typography>
            </Fade>
          </Box>

          {/* Key Metrics Overview */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {[
              { label: 'Total Spots', value: parkingData.totalSpots, icon: <CarIcon />, color: colors.primary[500] },
              { label: 'Available Now', value: parkingData.availableSpots, icon: <LocationIcon />, color: colors.success },
              { label: 'Occupancy Rate', value: `${parkingData.occupancyRate}%`, icon: <TrendingIcon />, color: colors.warning },
              { label: 'Avg Wait Time', value: `${parkingData.averageWaitTime}min`, icon: <TimeIcon />, color: colors.info },
            ].map((metric, index) => (
              <Grid xs={6} md={3} key={index}>
                <Grow in timeout={800 + index * 200}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${alpha(metric.color, 0.05)} 0%, ${alpha(metric.color, 0.1)} 100%)`,
                      border: `1px solid ${alpha(metric.color, 0.2)}`,
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
                        background: `linear-gradient(90deg, ${metric.color}, ${alpha(metric.color, 0.7)})`,
                        backgroundSize: '200% 100%',
                        animation: `${shimmer} 3s ease-in-out infinite`,
                      },
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: `0 12px 40px ${alpha(metric.color, 0.15)}`,
                        background: `linear-gradient(135deg, ${alpha(metric.color, 0.08)} 0%, ${alpha(metric.color, 0.15)} 100%)`,
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
                          bgcolor: alpha(metric.color, 0.1),
                          color: metric.color,
                          width: 56,
                          height: 56,
                          fontSize: '1.5rem',
                        }}
                      >
                        {metric.icon}
                      </Avatar>
                    </Box>
                    <Typography
                      variant="h3"
                      component="div"
                      fontWeight="bold"
                      sx={{
                        color: metric.color,
                        mb: 1,
                        animation: `${pulse} 2s ease-in-out infinite`,
                        animationDelay: `${index * 0.3}s`,
                      }}
                    >
                      {metric.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                      {metric.label}
                    </Typography>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

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
              Intelligent Insights & Trends
            </Typography>
          </Fade>
          <Fade in timeout={1000}>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Data-driven analysis to help you understand parking patterns and optimize your experience
            </Typography>
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

              {/* Trends Analysis Section */}
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 }, px: { xs: 3, sm: 4, md: 5 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in timeout={800}>
            <Typography
              variant="h2"
              component="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: `linear-gradient(135deg, ${colors.secondary[600]} 0%, ${colors.accent[600]} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Real-Time Trends Analysis
            </Typography>
          </Fade>
          <Fade in timeout={1000}>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Live monitoring of parking patterns and occupancy trends across Melbourne CBD
            </Typography>
          </Fade>
        </Box>

        <Grid container spacing={4}>
          <Grid xs={12} md={8}>
            <Slide direction="up" in timeout={1200}>
              <Card
                elevation={0}
                sx={{
                  p: 4,
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
                    animation: `${shimmer} 4s ease-in-out infinite`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Avatar
                    sx={{
                      bgcolor: colors.primary[500],
                      width: 48,
                      height: 48,
                      animation: `${pulse} 2s ease-in-out infinite`,
                    }}
                  >
                    <AnalyticsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="h3" fontWeight="bold" color="text.primary">
                      Live Occupancy Trends
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Real-time monitoring of parking availability across all CBD zones
                    </Typography>
                  </Box>
                </Box>
                
                {/* Mock Chart Placeholder */}
                <Box
                  sx={{
                    height: 300,
                    background: `linear-gradient(135deg, ${alpha(colors.primary[100], 0.3)} 0%, ${alpha(colors.secondary[100], 0.2)} 100%)`,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      border: `4px solid ${alpha(colors.primary[500], 0.2)}`,
                      borderTop: `4px solid ${colors.primary[500]}`,
                      animation: `${rotate} 2s linear infinite`,
                    },
                  }}
                >
                  <Box sx={{ textAlign: 'center', zIndex: 1 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Live Data Visualization
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Interactive charts and real-time updates
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Slide>
          </Grid>

          <Grid xs={12} md={4}>
            <Slide direction="left" in timeout={1400}>
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
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${colors.accent[500]}, ${colors.primary[500]}, ${colors.secondary[500]})`,
                    backgroundSize: '200% 100%',
                    animation: `${shimmer} 5s ease-in-out infinite`,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Avatar
                    sx={{
                      bgcolor: colors.accent[500],
                      width: 48,
                      height: 48,
                      animation: `${pulse} 2s ease-in-out infinite`,
                    }}
                  >
                    <InsightsIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="h3" fontWeight="bold" color="text.primary">
                      Peak Time Analysis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      When to expect congestion and plan accordingly
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {trends.map((trend, index) => (
                    <Grow in timeout={1600 + index * 200} key={index}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(trend.color, 0.05),
                          border: `1px solid ${alpha(trend.color, 0.1)}`,
                          transition: 'all 0.3s ease-in-out',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateX(8px)',
                            bgcolor: alpha(trend.color, 0.1),
                          },
                        }}
                      >
                        <Typography variant="body2" fontWeight="500" color="text.primary">
                          {trend.label}
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: trend.color }}>
                          {trend.value}
                        </Typography>
                      </Box>
                    </Grow>
                  ))}
                </Box>
              </Card>
            </Slide>
          </Grid>
        </Grid>
      </Container>

      {/* Enhanced CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.secondary[600]} 0%, ${colors.secondary[800]} 100%)`,
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
                Ready to Access Real-Time Parking Intelligence?
              </Typography>
            </Fade>
            <Fade in timeout={1000}>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                Join thousands of Melbourne residents who've already discovered the power of data-driven parking decisions
              </Typography>
            </Fade>
            <Fade in timeout={1200}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip
                  icon={<DataIcon />}
                  label="Explore Live Data"
                  variant="filled"
                  sx={{
                    bgcolor: 'white',
                    color: colors.secondary[700],
                    px: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: colors.neutral[100],
                      transform: 'translateY(-3px) scale(1.02)',
                      boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
                    },
                    '&:active': {
                      transform: 'translateY(-1px) scale(0.98)',
                    },
                  }}
                />
                <Chip
                  icon={<FlashIcon />}
                  label="Get Smart Alerts"
                  variant="outlined"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderWidth: 2,
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: alpha('#FFFFFF', 0.1),
                      borderColor: 'white',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(255,255,255,0.2)',
                    },
                  }}
                />
              </Box>
            </Fade>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default DataInsightsPage;
