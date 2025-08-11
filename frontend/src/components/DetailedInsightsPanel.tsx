import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  keyframes,
} from '@mui/material';
import {
  TrendingUp,
  AccessTime,
  LocationOn,
  Accessibility,
  FamilyRestroom,
  Notifications,
  Timeline,
} from '@mui/icons-material';
import { DetailedInsights } from '../services/parkingDataService';
import { colors } from '../theme';

interface DetailedInsightsPanelProps {
  detailedInsights: DetailedInsights;
  isLoading: boolean;
}

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const DetailedInsightsPanel: React.FC<DetailedInsightsPanelProps> = ({ detailedInsights, isLoading }) => {
  if (isLoading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Loading detailed insights...
        </Typography>
      </Paper>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Peak Hours Analysis */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AccessTime sx={{ color: colors.warning, mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">
              Peak Hours Analysis
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {detailedInsights.peakHours.map((peak, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ minWidth: 60, fontWeight: 600 }}>
                  {peak.hour}
                </Typography>
                <Box sx={{ flex: 1, height: 8, bgcolor: colors.neutral[200], borderRadius: 4, overflow: 'hidden' }}>
                  <Box
                    sx={{
                      width: `${peak.occupancy}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${colors.warning}, ${colors.error})`,
                      borderRadius: 4,
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                  {peak.occupancy}%
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>

      {/* Popular Zones */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LocationOn sx={{ color: colors.info, mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">
              Popular Zones
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {detailedInsights.popularZones.map((zone, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={`Zone ${zone.zone}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="body2" color="text.secondary">
                    {zone.popularity} spots
                  </Typography>
                </Box>
                <TrendingUp sx={{ color: colors.success, fontSize: 20 }} />
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>

      {/* Accessibility Stats */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Accessibility sx={{ color: colors.info, mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">
              Accessibility Coverage
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h3" color="info" fontWeight="bold">
              {detailedInsights.accessibilityStats.percentage}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              of total parking spots
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="info" fontWeight="bold">
                {detailedInsights.accessibilityStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success" fontWeight="bold">
                {detailedInsights.accessibilityStats.available}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Family-Friendly Stats */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <FamilyRestroom sx={{ color: colors.accent[600], mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">
              Family-Friendly Zones
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h3" color="accent.600" fontWeight="bold">
              {detailedInsights.familyFriendlyStats.percentage}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              of total parking spots
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="accent.600" fontWeight="bold">
                {detailedInsights.familyFriendlyStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success" fontWeight="bold">
                {detailedInsights.familyFriendlyStats.available}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Real-time Alerts */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Notifications sx={{ color: colors.warning, mr: 1, animation: `${pulse} 2s ease-in-out infinite` }} />
            <Typography variant="h6" fontWeight="bold" color="primary">
              Real-time Alerts
            </Typography>
          </Box>
          <List dense>
            {detailedInsights.realTimeAlerts.map((alert, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: colors.warning,
                      animation: `${pulse} 1s ease-in-out infinite`,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={alert}
                  primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      {/* Predictions */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Timeline sx={{ color: colors.success, mr: 1 }} />
            <Typography variant="h6" fontWeight="bold" color="primary">
              AI Predictions
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {detailedInsights.predictions.map((prediction, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" fontWeight="600">
                  In {prediction.time}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="success" fontWeight="bold">
                    {prediction.availability}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    availability
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DetailedInsightsPanel;
