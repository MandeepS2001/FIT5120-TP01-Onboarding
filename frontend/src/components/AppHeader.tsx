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
  Chip,
  Avatar,
  Container,
  alpha,
  keyframes,
  Fade,
  Grow,
  Slide,
  Badge,
  Tooltip,
  Divider,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Map as MapIcon,
  Info as InfoIcon,
  Analytics as AnalyticsIcon,
  // DirectionsCar as CarIcon,
  Close as CloseIcon,
  FlashOn as FlashIcon,
  Notifications as NotificationsIcon,
  // AccountCircle as AccountIcon,
  LocationOn as LocationIcon,
  TrendingUp as TrendingIcon,
  // Security as SecurityIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

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
  const { currentColors } = useAppTheme();
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
    { path: '/learn-more', label: 'Learn More', icon: <InfoIcon />, description: 'About the Project' },
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

      <Divider sx={{ my: 2, mx: 3 }} />

      {/* Live Data Status */}
      <Box sx={{ px: 3, mb: 3 }}>
        <Chip
          icon={<FlashIcon />}
          label="Live Data"
          color="success"
          variant="filled"
          component={RouterLink}
          to="/data-insights"
          clickable
          onClick={handleDrawerToggle}
          sx={{
            fontWeight: 600,
            background: `linear-gradient(45deg, ${colors.success} 30%, ${colors.accent[500]} 90%)`,
            color: 'white',
            boxShadow: `0 4px 15px ${alpha(colors.success, 0.4)}`,
            animation: `${glow} 3s ease-in-out infinite`,
            cursor: 'pointer',
            textDecoration: 'none',
            width: '100%',
            justifyContent: 'center',
            '&:hover': {
              transform: 'scale(1.02)',
              boxShadow: `0 6px 20px ${alpha(colors.success, 0.6)}`,
              animation: `${pulse} 1s ease-in-out infinite`,
              textDecoration: 'none',
            },
            '& .MuiChip-icon': {
              color: 'inherit',
            },
          }}
        />
      </Box>

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
        elevation={0}
        sx={{
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.9)' 
            : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(25px)',
          borderBottom: `1px solid ${alpha(colors.neutral[200], 0.4)}`,
          boxShadow: scrolled 
            ? '0 8px 30px rgba(0, 0, 0, 0.15)' 
            : '0 4px 20px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease-in-out',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 10px 35px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 3, sm: 4, md: 5 } }}>
          <Toolbar sx={{ px: { xs: 0 }, minHeight: { xs: 64, md: 72 } }}>
            {/* Enhanced Logo and Brand */}
            <Fade in timeout={800}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                    width: { xs: 44, md: 52 },
                    height: { xs: 44, md: 52 },
                    fontSize: { xs: '1.3rem', md: '1.6rem' },
                    fontWeight: 'bold',
                    boxShadow: `0 4px 20px ${alpha(colors.primary[500], 0.3)}`,
                    animation: `${float} 4s ease-in-out infinite`,
                    cursor: 'pointer',
                    transform: scrolled ? 'scale(0.95)' : 'scale(1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      animation: `${pulse} 0.6s ease-in-out`,
                      boxShadow: `0 6px 25px ${alpha(colors.primary[500], 0.4)}`,
                      transform: scrolled ? 'scale(1)' : 'scale(1.05)',
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
                      background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2,
                      animation: `${shimmer} 4s ease-in-out infinite`,
                      backgroundSize: '200% 100%',
                      cursor: 'pointer',
                      '&:hover': {
                        animation: `${shimmer} 2s ease-in-out infinite`,
                      },
                    }}
                  >
                    Park Pal
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ 
                      fontWeight: 500, 
                      letterSpacing: '0.5px',
                      display: { xs: 'none', sm: 'block' },
                      color: colors.primary[600],
                    }}
                  >
                    Smart Parking Solutions
                  </Typography>
                </Box>
              </Box>
            </Fade>

            {/* Desktop Navigation */}
            {!isMobile && (
              <>
                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
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
                            borderRadius: 3,
                            fontWeight: 600,
                            textTransform: 'none',
                            position: 'relative',
                            transition: 'all 0.3s ease-in-out',
                            minWidth: 'auto',
                            borderWidth: isActiveRoute(item.path) ? 0 : 2,
                            borderColor: isActiveRoute(item.path) ? 'transparent' : colors.primary[300],
                            color: isActiveRoute(item.path) ? 'white' : colors.primary[700],
                            bgcolor: isActiveRoute(item.path) 
                              ? `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`
                              : 'transparent',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              bgcolor: isActiveRoute(item.path) 
                                ? `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`
                                : alpha(colors.primary[500], 0.1),
                              borderColor: isActiveRoute(item.path) ? 'transparent' : colors.primary[500],
                              boxShadow: isActiveRoute(item.path) 
                                ? `0 8px 25px ${alpha(colors.primary[500], 0.3)}`
                                : `0 4px 15px ${alpha(colors.primary[400], 0.2)}`,
                            },
                            '&::after': isActiveRoute(item.path) ? {
                              content: '""',
                              position: 'absolute',
                              bottom: -8,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: colors.secondary[500],
                              boxShadow: `0 0 20px ${alpha(colors.secondary[500], 0.5)}`,
                              animation: `${pulse} 2s ease-in-out infinite`,
                            } : {},
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

                {/* Enhanced Right Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 3 }}>
                  {/* Theme Toggle */}
                  <ThemeToggle />
                  
                  {/* Notifications */}
                  <Tooltip title="Notifications" arrow>
                    <IconButton
                      sx={{
                        color: colors.neutral[600],
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          color: colors.primary[600],
                          transform: 'scale(1.1)',
                          bgcolor: alpha(colors.primary[500], 0.1),
                        },
                      }}
                    >
                      <Badge badgeContent={3} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  {/* Live Data Chip */}
                  <Grow in timeout={1200}>
                    <Chip
                      icon={<FlashIcon />}
                      label="Live Data"
                      color="success"
                      variant="filled"
                      component={RouterLink}
                      to="/data-insights"
                      clickable
                      sx={{
                        fontWeight: 600,
                        background: `linear-gradient(45deg, ${colors.success} 30%, ${colors.accent[500]} 90%)`,
                        color: 'white',
                        boxShadow: `0 4px 15px ${alpha(colors.success, 0.4)}`,
                        animation: `${glow} 3s ease-in-out infinite`,
                        cursor: 'pointer',
                        textDecoration: 'none',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: `0 6px 20px ${alpha(colors.success, 0.6)}`,
                          animation: `${pulse} 1s ease-in-out infinite`,
                          textDecoration: 'none',
                        },
                        '& .MuiChip-icon': {
                          color: 'inherit',
                        },
                      }}
                    />
                  </Grow>

                  {/* User Profile */}
                  <Tooltip title="User Profile" arrow>
                    <IconButton
                      sx={{
                        color: colors.primary[600],
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.1)',
                          bgcolor: alpha(colors.primary[500], 0.1),
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: colors.secondary[500],
                          fontSize: '1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        U
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                </Box>
              </>
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
                    color: colors.primary[700],
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: alpha(colors.primary[500], 0.1),
                      transform: 'rotate(90deg)',
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Grow>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Spacer to prevent content from going behind fixed header */}
      <Box sx={{ height: { xs: 64, md: 72 } }} />

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


