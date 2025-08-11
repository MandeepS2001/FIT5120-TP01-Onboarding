import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  LocationOn as LocationIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { Fade, Slide } from '@mui/material';
import { colors } from '../theme';

// Clean, simple homepage with parking image and clear call-to-action
const HomePage: React.FC = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
      position: 'relative',
    }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center',
          position: 'relative',
        }}>
          <Grid container spacing={6} alignItems="center">
            {/* Left Content - Text */}
            <Grid xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box sx={{ pl: { xs: 2, md: 4, lg: 6 } }}>
                  <Typography
                    variant="h1"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 800,
                      lineHeight: 1.1,
                      mb: 3,
                      background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[800]} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    }}
                  >
                    Smarter Parking in Melbourne
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
                    Save time and stress with smarter parking.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      component={RouterLink}
                      to="/map"
                      startIcon={<LocationIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #FF6B35 0%, #FF5722 100%)',
                        color: '#fff',
                        boxShadow: '0 8px 25px rgba(255, 107, 53, 0.3)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 35px rgba(255, 107, 53, 0.4)',
                          background: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
                        },
                      }}
                    >
                      OPEN MAP & SEARCH
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={RouterLink}
                      to="/data-insights"
                      startIcon={<BarChartIcon />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderWidth: 2,
                        borderRadius: 2,
                        borderColor: '#333',
                        color: '#333',
                        background: 'rgba(255, 255, 255, 0.8)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          borderWidth: 3,
                          background: 'rgba(255, 255, 255, 0.9)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                        },
                      }}
                    >
                      DATA OVERVIEW
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            {/* Right Content - Parking Image */}
            <Grid xs={12} md={6}>
              <Slide direction="left" in timeout={1200}>
                <Box sx={{ position: 'relative', height: '100%', minHeight: 400 }}>
                  {/* Parking Garage Image */}
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      minHeight: 400,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
                          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
                        `,
                      },
                    }}
                  >
                    {/* Parking Structure Visual */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '60%',
                        background: `
                          linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%),
                          repeating-linear-gradient(
                            90deg,
                            transparent 0%,
                            transparent 8%,
                            rgba(255,255,255,0.1) 8%,
                            rgba(255,255,255,0.1) 10%
                          ),
                          repeating-linear-gradient(
                            0deg,
                            transparent 0%,
                            transparent 8%,
                            rgba(255,255,255,0.1) 8%,
                            rgba(255,255,255,0.1) 10%
                          )
                        `,
                      }}
                    />
                    
                    {/* Floating Parking Elements */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '20%',
                        left: '15%',
                        width: 60,
                        height: 40,
                        background: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: 1,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        animation: 'float 4s ease-in-out infinite',
                        '@keyframes float': {
                          '0%, 100%': { transform: 'translateY(0px)' },
                          '50%': { transform: 'translateY(-10px)' },
                        },
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '35%',
                        right: '20%',
                        width: 50,
                        height: 35,
                        background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: 1,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        animation: 'float 5s ease-in-out infinite reverse',
                        '@keyframes float': {
                          '0%, 100%': { transform: 'translateY(0px)' },
                          '50%': { transform: 'translateY(-10px)' },
                        },
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: '25%',
                        left: '25%',
                        width: 70,
                        height: 45,
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: 1,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        animation: 'float 6s ease-in-out infinite',
                        '@keyframes float': {
                          '0%, 100%': { transform: 'translateY(0px)' },
                          '50%': { transform: 'translateY(-10px)' },
                        },
                      }}
                    />
                    
                    {/* City Skyline Silhouette */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '40%',
                        background: `
                          linear-gradient(to bottom, 
                            transparent 0%, 
                            rgba(0,0,0,0.3) 50%, 
                            rgba(0,0,0,0.6) 100%
                          )
                        `,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '100%',
                          background: `
                            polygon(
                              0% 100%, 5% 80%, 10% 90%, 15% 70%, 20% 85%, 25% 60%, 
                              30% 75%, 35% 50%, 40% 65%, 45% 40%, 50% 55%, 55% 30%, 
                              60% 45%, 65% 20%, 70% 35%, 75% 15%, 80% 25%, 85% 10%, 
                              90% 20%, 95% 5%, 100% 15%, 100% 100%
                            )
                          `,
                          backgroundSize: '100% 100%',
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;


