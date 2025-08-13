import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Container,
  alpha,
  keyframes,
  Fade,
  Grow,
  Slide,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Map as MapIcon,
  Analytics as AnalyticsIcon,
  Close as CloseIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { colors } from '../theme';

// Enhanced keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-4px) rotate(1deg); }
  50% { transform: translateY(-6px) rotate(0deg); }
  75% { transform: translateY(-4px) rotate(-1deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// const slideIn = keyframes`
//   0% { transform: translateX(-100%); opacity: 0; }
//   100% { transform: translateX(0); opacity: 1; }
// `;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px ${alpha('#4CAF50', 0.5)}; }
  50% { box-shadow: 0 0 30px ${alpha('#4CAF50', 0.8)}, 0 0 40px ${alpha('#4CAF50', 0.3)}; }
`;

const AppHeader: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon />, description: 'Dashboard & Overview' },
    { path: '/map', label: 'Parking Map', icon: <MapIcon />, description: 'Find Parking Spots' },
    { path: '/data-insights', label: 'Data Insights', icon: <AnalyticsIcon />, description: 'Analytics & Trends' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  const drawer = (
    <Box sx={{ width: 320, pt: 2, height: '100%' }}>
      {/* Enhanced Mobile Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        px: 3, 
        mb: 3,
        pb: 2,
        borderBottom: `1px solid ${alpha(colors.neutral[200], 0.5)}`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
              width: 48,
              height: 48,
              fontSize: '1.4rem',
              fontWeight: 'bold',
              animation: `${pulse} 2s ease-in-out infinite`,
              boxShadow: `0 4px 20px ${alpha(colors.primary[500], 0.3)}`,
            }}
          >
            P
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="primary">
              Park Pal
            </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Smart Parking Solutions
                  </Typography>
          </Box>
        </Box>
        <IconButton 
          onClick={handleDrawerToggle}
          sx={{
            color: colors.primary[700],
            '&:hover': { bgcolor: alpha(colors.primary[500], 0.1) }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Search Bar in Mobile */}
      <Box sx={{ px: 3, mb: 3 }}>
        <Paper
          component="form"
          onSubmit={(event) => event.preventDefault()}
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 3,
            boxShadow: `0 2px 10px ${alpha(colors.neutral[300], 0.3)}`,
            '&:hover': {
              boxShadow: `0 4px 20px ${alpha(colors.neutral[300], 0.4)}`,
            },
          }}
        >
          <Box
            sx={{ 
              ml: 2, 
              flex: 1, 
              py: 1.5,
              color: 'text.disabled',
              fontSize: '0.875rem',
            }}
          >
            Search functionality moved to map page
          </Box>
          <IconButton sx={{ p: 1.5, color: 'text.disabled' }} disabled>
            {/* <SearchIcon /> */}
          </IconButton>
        </Paper>
      </Box>

      {/* Enhanced Navigation List */}
      <List sx={{ px: 2 }}>
        {navItems.map((item, index) => (
          <Slide direction="right" in timeout={400 + index * 100} key={item.path}>
            <ListItem
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                mx: 1,
                borderRadius: 3,
                mb: 1,
                bgcolor: isActiveRoute(item.path) ? alpha(colors.primary[500], 0.1) : 'transparent',
                color: isActiveRoute(item.path) ? colors.primary[700] : 'inherit',
                transition: 'all 0.3s ease-in-out',
                border: isActiveRoute(item.path) ? `1px solid ${alpha(colors.primary[500], 0.3)}` : '1px solid transparent',
                '&:hover': {
                  bgcolor: alpha(colors.primary[500], 0.05),
                  transform: 'translateX(8px)',
                  borderColor: alpha(colors.primary[500], 0.2),
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 48 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: isActiveRoute(item.path) ? alpha(colors.primary[500], 0.1) : alpha(colors.neutral[200], 0.3),
                  transition: 'all 0.3s ease-in-out',
                }}>
                  {item.icon}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.description}
                primaryTypographyProps={{
                  fontWeight: isActiveRoute(item.path) ? 600 : 500,
                  fontSize: '1rem',
                }}
                secondaryTypographyProps={{
                  fontSize: '0.8rem',
                  color: isActiveRoute(item.path) ? colors.primary[600] : 'text.secondary',
                }}
              />
            </ListItem>
          </Slide>
        ))}
      </List>



      {/* Quick Actions */}
      <Box sx={{ px: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<LocationIcon />}
            sx={{
              borderRadius: 2,
              borderColor: colors.primary[300],
              color: colors.primary[700],
              '&:hover': {
                borderColor: colors.primary[500],
                bgcolor: alpha(colors.primary[500], 0.05),
              },
            }}
          >
            Find Nearest Parking
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<TrendingIcon />}
            sx={{
              borderRadius: 2,
              borderColor: colors.secondary[300],
              color: colors.secondary[700],
              '&:hover': {
                borderColor: colors.secondary[500],
                bgcolor: alpha(colors.secondary[500], 0.05),
              },
            }}
          >
            View Traffic Status
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={scrolled ? 2 : 0}
        sx={{
          backgroundColor: scrolled ? 'rgba(28, 36, 52, 0.95)' : 'transparent',
          backgroundImage: scrolled 
            ? 'none'
            : 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease-in-out',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 4, md: 5 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            height: scrolled ? '80px' : '100px',
            transition: 'height 0.3s ease-in-out'
          }}>
            {/* Enhanced Logo and Brand */}
            <Fade in timeout={800}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                    width: scrolled ? { xs: 40, md: 48 } : { xs: 44, md: 52 },
                    height: scrolled ? { xs: 40, md: 48 } : { xs: 44, md: 52 },
                    fontSize: scrolled ? { xs: '1.2rem', md: '1.5rem' } : { xs: '1.3rem', md: '1.6rem' },
                    fontWeight: 'bold',
                    boxShadow: `0 4px 20px ${alpha(colors.primary[500], 0.3)}`,
                    animation: `${float} 4s ease-in-out infinite`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      animation: `${pulse} 0.6s ease-in-out`,
                      boxShadow: `0 6px 25px ${alpha(colors.primary[500], 0.4)}`,
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  P
                </Avatar>
                <Box>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    component="div"
                    fontWeight="bold"
                    sx={{
                      background: `linear-gradient(135deg, #ffffff 0%, ${colors.primary[200]} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2,
                      cursor: 'pointer',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        color: colors.primary[200],
                      },
                    }}
                  >
                    Park Pal
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ 
                      fontWeight: 600, 
                      letterSpacing: '0.5px',
                      display: { xs: 'none', sm: 'block' },
                      background: `linear-gradient(135deg, ${colors.primary[200]} 0%, ${colors.primary[300]} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                    }}
                  >
                    Smart Parking Solutions
                  </Typography>
                </Box>
              </Box>
            </Fade>

            {/* Desktop Navigation - Moved to Right */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {navItems.map((item, index) => (
                  <Grow in timeout={800 + index * 100} key={item.path}>
                    <Tooltip title={item.description} arrow>
                      <Button
                        component={RouterLink}
                        to={item.path}
                        startIcon={item.icon}
                        variant={isActiveRoute(item.path) ? 'contained' : 'outlined'}
                        color={isActiveRoute(item.path) ? 'primary' : 'primary'}
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          textTransform: 'none',
                          position: 'relative',
                          transition: 'all 0.3s ease-in-out',
                          minWidth: 'auto',
                          color: isActiveRoute(item.path) ? '#ffffff' : '#ffffff',
                          backgroundColor: isActiveRoute(item.path) 
                            ? colors.primary[500] 
                            : 'rgba(255, 255, 255, 0.1)',
                          border: isActiveRoute(item.path) 
                            ? 'none' 
                            : `1px solid ${colors.primary[300]}`,
                          fontSize: '16px',
                          backdropFilter: 'blur(10px)',
                          boxShadow: isActiveRoute(item.path) 
                            ? `0 4px 15px ${alpha(colors.primary[500], 0.4)}`
                            : '0 2px 8px rgba(0, 0, 0, 0.1)',
                          '&:hover': {
                            backgroundColor: isActiveRoute(item.path) 
                              ? colors.primary[600]
                              : 'rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            transform: 'translateY(-1px)',
                            boxShadow: isActiveRoute(item.path) 
                              ? `0 6px 20px ${alpha(colors.primary[500], 0.5)}`
                              : '0 4px 12px rgba(0, 0, 0, 0.15)',
                          },
                          ...(isActiveRoute(item.path) && {
                            color: '#ffffff',
                            fontWeight: 700,
                            borderBottom: `2.5px solid ${colors.primary[300]}`,
                          }),
                          '& .MuiButton-startIcon': {
                            color: 'inherit',
                            opacity: 0.9,
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </Tooltip>
                  </Grow>
                ))}
              </Box>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <Box sx={{ flexGrow: 1 }} />
            )}
            {isMobile && (
              <Grow in timeout={800}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: '#ffffff',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: alpha(colors.primary[500], 0.2),
                      transform: 'rotate(90deg)',
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Grow>
            )}
          </Box>
        </Container>
      </AppBar>



      {/* Enhanced Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 320,
            border: 'none',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
            background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[100]} 100%)`,
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default AppHeader;


