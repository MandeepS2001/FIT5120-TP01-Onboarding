import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
  alpha,
  keyframes,
  Fade,
  Grow,
  Zoom,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
} from '@mui/icons-material';
import { colors } from '../theme';

// Custom keyframe animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
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

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', href: '/' },
        { label: 'Parking Map', href: '/map' },
        { label: 'Learn More', href: '/learn-more' },
        { label: 'Data Insights', href: '/data-insights' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Parking Guide', href: '/guide' },
        { label: 'Accessibility Info', href: '/accessibility' },
        { label: 'Family Tips', href: '/family-tips' },
        { label: 'CBD Navigation', href: '/navigation' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Feedback', href: '/feedback' },
        { label: 'Report Issue', href: '/report' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Accessibility', href: '/accessibility-legal' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
    { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
    { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
    { icon: <LinkedInIcon />, href: '#', label: 'LinkedIn' },
  ];

  const contactInfo = [
    { icon: <EmailIcon />, label: 'info@melbourneparking.com', href: 'mailto:info@melbourneparking.com' },
    { icon: <PhoneIcon />, label: '+61 3 9000 0000', href: 'tel:+61390000000' },
    { icon: <LocationIcon />, label: 'Melbourne CBD, VIC 3000', href: '#' },
    { icon: <TimeIcon />, label: '24/7 Support Available', href: '#' },
  ];

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderTop: `1px solid ${alpha(colors.neutral[200], 0.8)}`,
        position: 'relative',
        overflow: 'visible',
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
      {/* Floating Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colors.primary[200], 0.2)} 0%, transparent 70%)`,
          animation: `${float} 8s ease-in-out infinite`,
          zIndex: 0,
          '@media (max-width: 1200px)': {
            right: '2%',
            width: 80,
            height: 80,
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '30%',
          left: '3%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(colors.secondary[200], 0.15)} 0%, transparent 70%)`,
          animation: `${float} 6s ease-in-out infinite reverse`,
          zIndex: 0,
          '@media (max-width: 1200px)': {
            left: '1%',
            width: 60,
            height: 60,
          },
        }}
      />

              <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, px: { xs: 3, sm: 4, md: 5 } }}>
        {/* Main Footer Content */}
        <Grid container spacing={6} sx={{ mb: 6, pt: 6 }}>
          {/* Brand Section */}
          <Grid xs={12} md={4}>
            <Fade in timeout={800}>
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      boxShadow: `0 4px 20px ${alpha(colors.primary[500], 0.3)}`,
                      animation: `${float} 4s ease-in-out infinite`,
                      '&:hover': {
                        animation: `${pulse} 0.6s ease-in-out`,
                      },
                    }}
                  >
                    M
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      component="h2"
                      fontWeight="bold"
                      sx={{
                        background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: `${shimmer} 3s ease-in-out infinite`,
                        backgroundSize: '200% 100%',
                      }}
                    >
                      Melbourne Parking
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                      Smart • Accessible • Family-Friendly
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6, pl: { xs: 2, sm: 3 } }}>
                  Empowering Melbourne families with real-time parking intelligence, 
                  accessibility features, and stress-free CBD navigation.
                </Typography>
                
                {/* Enhanced Contact Info */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: { xs: 1, sm: 2 } }}>
                  {contactInfo.map((contact, index) => (
                    <Grow in timeout={1000 + index * 200} key={index}>
                      <Link
                        href={contact.href}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          color: 'text.secondary',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            color: colors.primary[600],
                            transform: 'translateX(8px)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            bgcolor: alpha(colors.primary[500], 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.primary[600],
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              bgcolor: colors.primary[500],
                              color: 'white',
                              transform: 'scale(1.1)',
                            },
                          }}
                        >
                          {contact.icon}
                        </Box>
                        <Typography variant="body2" fontWeight="500">
                          {contact.label}
                        </Typography>
                      </Link>
                    </Grow>
                  ))}
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <Grid xs={12} sm={6} md={2} key={index}>
              <Zoom in timeout={1000 + index * 200}>
                <Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      color: colors.primary[700],
                      mb: 3,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: 30,
                        height: 3,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${colors.primary[500]}, ${colors.secondary[500]})`,
                        animation: `${shimmer} 3s ease-in-out infinite`,
                        backgroundSize: '200% 100%',
                      },
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {section.links.map((link, linkIndex) => (
                      <Grow in timeout={1200 + linkIndex * 100} key={linkIndex}>
                        <Link
                          href={link.href}
                          sx={{
                            color: 'text.secondary',
                            textDecoration: 'none',
                            fontWeight: 500,
                            transition: 'all 0.3s ease-in-out',
                            '&:hover': {
                              color: colors.primary[600],
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          {link.label}
                        </Link>
                      </Grow>
                    ))}
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4, borderColor: alpha(colors.neutral[300], 0.5) }} />

        {/* Bottom Footer */}
        <Box sx={{ py: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Fade in timeout={1400}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              © {currentYear} Melbourne Parking. All rights reserved.
            </Typography>
          </Fade>
          
          <Fade in timeout={1600}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <Grow in timeout={1800 + index * 100} key={index}>
                  <IconButton
                    href={social.href}
                    aria-label={social.label}
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: alpha(colors.primary[500], 0.1),
                      color: colors.primary[600],
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        bgcolor: colors.primary[500],
                        color: 'white',
                        transform: 'translateY(-4px) scale(1.1)',
                        boxShadow: `0 8px 25px ${alpha(colors.primary[500], 0.3)}`,
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                </Grow>
              ))}
            </Box>
          </Fade>
        </Box>

        {/* Enhanced Features Showcase */}
        <Box sx={{ py: 4, mt: 4, bgcolor: alpha(colors.neutral[50], 0.5), borderRadius: 4, px: 4 }}>
          <Fade in timeout={2000}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                Trusted by Melbourne Families
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join thousands of parents who've transformed their CBD parking experience
              </Typography>
            </Box>
          </Fade>
          
          <Grid container spacing={3}>
            {[
              { icon: <StarIcon />, label: '4.9/5 Rating', color: colors.warning },
              { icon: <TrendingIcon />, label: '10,000+ Users', color: colors.success },
              { icon: <SecurityIcon />, label: '100% Secure', color: colors.info },
              { icon: <SupportIcon />, label: '24/7 Support', color: colors.primary[500] },
            ].map((feature, index) => (
              <Grid xs={6} md={3} key={index}>
                <Grow in timeout={2200 + index * 200}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 3,
                      transition: 'all 0.3s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        '& .feature-icon': {
                          animation: `${pulse} 0.6s ease-in-out`,
                        },
                      },
                    }}
                  >
                    <Box
                      className="feature-icon"
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 1,
                        animation: `${float} 4s ease-in-out infinite`,
                        animationDelay: `${index * 0.5}s`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          bgcolor: alpha(feature.color, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: feature.color,
                          fontSize: '1.5rem',
                        }}
                      >
                        {feature.icon}
                      </Box>
                    </Box>
                    <Typography variant="body2" fontWeight="600" color="text.primary">
                      {feature.label}
                    </Typography>
                  </Box>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AppFooter;


