import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Map as MapIcon,
  Info as InfoIcon,
  Analytics as AnalyticsIcon,
  DirectionsCar as CarIcon,
  Close as CloseIcon,
  FlashOn as FlashIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { colors } from '../theme';

// Custom keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
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

const AppHeader: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/map', label: 'Parking Map', icon: <MapIcon /> },
    { path: '/learn-more', label: 'Learn More', icon: <InfoIcon /> },
    { path: '/data-insights', label: 'Data Insights', icon: <AnalyticsIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              bgcolor: colors.primary[500],
              width: 40,
              height: 40,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
          >
            M
          </Avatar>
          <Typography variant="h6" fontWeight="bold" color="primary">
            Melbourne Parking
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item, index) => (
          <Grow in timeout={300 + index * 100} key={item.path}>
            <ListItem
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                mx: 1,
                borderRadius: 2,
                mb: 0.5,
                bgcolor: isActiveRoute(item.path) ? alpha(colors.primary[500], 0.1) : 'transparent',
                color: isActiveRoute(item.path) ? colors.primary[700] : 'inherit',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  bgcolor: alpha(colors.primary[500], 0.05),
                  transform: 'translateX(8px)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActiveRoute(item.path) ? 600 : 400,
                }}
              />
            </ListItem>
          </Grow>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(colors.neutral[200], 0.8)}`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Toolbar sx={{ px: { xs: 0 } }}>
            {/* Logo and Brand */}
            <Fade in timeout={800}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                    width: 48,
                    height: 48,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    boxShadow: `0 4px 20px ${alpha(colors.primary[500], 0.3)}`,
                    animation: `${float} 3s ease-in-out infinite`,
                    '&:hover': {
                      animation: `${pulse} 0.6s ease-in-out`,
                    },
                  }}
                >
                  M
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    component="div"
                    fontWeight="bold"
                    sx={{
                      background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2,
                      animation: `${shimmer} 3s ease-in-out infinite`,
                      backgroundSize: '200% 100%',
                    }}
                  >
                    Melbourne Parking
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 500, letterSpacing: '0.5px' }}
                  >
                    Smart • Accessible • Family-Friendly
                  </Typography>
                </Box>
              </Box>
            </Fade>

            {/* Desktop Navigation */}
            {!isMobile && (
              <>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {navItems.map((item, index) => (
                    <Grow in timeout={800 + index * 100} key={item.path}>
                      <Button
                        component={RouterLink}
                        to={item.path}
                        startIcon={item.icon}
                        variant={isActiveRoute(item.path) ? 'contained' : 'text'}
                        color={isActiveRoute(item.path) ? 'primary' : 'inherit'}
                        sx={{
                          px: 3,
                          py: 1.5,
                          borderRadius: 3,
                          fontWeight: 600,
                          textTransform: 'none',
                          position: 'relative',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: isActiveRoute(item.path) 
                              ? `0 8px 25px ${alpha(colors.primary[500], 0.3)}`
                              : `0 4px 15px ${alpha(colors.neutral[400], 0.2)}`,
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
                        }}
                      >
                        {item.label}
                      </Button>
                    </Grow>
                  ))}
                </Box>
                <Box sx={{ ml: 2 }}>
                  <Grow in timeout={1200}>
                    <Chip
                      icon={<FlashIcon />}
                      label="Live Data"
                      color="success"
                      variant="filled"
                      sx={{
                        fontWeight: 600,
                        background: `linear-gradient(45deg, ${colors.success} 30%, ${colors.accent[500]} 90%)`,
                        color: 'white',
                        boxShadow: `0 4px 15px ${alpha(colors.success, 0.4)}`,
                        animation: `${pulse} 2s ease-in-out infinite`,
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: `0 6px 20px ${alpha(colors.success, 0.6)}`,
                        },
                        '& .MuiChip-icon': {
                          color: 'inherit',
                        },
                      }}
                    />
                  </Grow>
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

      {/* Mobile Drawer */}
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
            width: 280,
            border: 'none',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)',
            background: `linear-gradient(135deg, ${colors.neutral[50]} 0%, ${colors.neutral[100]} 100%)`,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default AppHeader;


