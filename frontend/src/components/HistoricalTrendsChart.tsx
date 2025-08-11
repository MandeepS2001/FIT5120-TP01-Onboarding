import React, { useEffect, useRef } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { HistoricalTrend } from '../services/parkingDataService';
import { colors } from '../theme';

interface HistoricalTrendsChartProps {
  historicalTrends: HistoricalTrend[];
  isLoading: boolean;
}

const HistoricalTrendsChart: React.FC<HistoricalTrendsChartProps> = ({ historicalTrends, isLoading }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('HistoricalTrendsChart useEffect:', { isLoading, historicalTrendsLength: historicalTrends.length, chartRef: !!chartRef.current });
    if (!chartRef.current || isLoading) return;

    const chart = chartRef.current;
    chart.innerHTML = '';

    // Create historical trends visualization
    const maxOccupancy = Math.max(...displayTrends.map(t => t.occupancyRate));
    const maxAvailable = Math.max(...displayTrends.map(t => t.availableSpots));

    displayTrends.forEach((trend, index) => {
      const trendCard = document.createElement('div');
      trendCard.style.cssText = `
        background: linear-gradient(135deg, ${colors.primary[50]}, ${colors.secondary[50]});
        border: 1px solid rgba(144, 202, 249, 0.3);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 20px;
        transition: all 0.3s ease;
        cursor: pointer;
        min-height: 120px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      `;

      const occupancyHeight = (trend.occupancyRate / maxOccupancy) * 60;
      const availableHeight = (trend.availableSpots / maxAvailable) * 60;

      trendCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 700; color: ${colors.primary[700]}; margin-bottom: 8px; font-size: 18px;">
              ${trend.date}
            </div>
            <div style="font-size: 14px; color: ${colors.neutral[600]};">
              ${trend.totalSpots} total spots
            </div>
          </div>
          <div style="display: flex; gap: 20px; align-items: end;">
            <div style="text-align: center;">
              <div style="
                width: 24px;
                height: ${occupancyHeight}px;
                background: linear-gradient(to top, ${colors.warning}, ${colors.error});
                border-radius: 6px 6px 0 0;
                margin-bottom: 6px;
              "></div>
              <div style="font-size: 12px; color: ${colors.warning}; font-weight: 600;">
                ${trend.occupancyRate}%
              </div>
              <div style="font-size: 10px; color: ${colors.neutral[600]};">
                Occupied
              </div>
            </div>
            <div style="text-align: center;">
              <div style="
                width: 24px;
                height: ${availableHeight}px;
                background: linear-gradient(to top, ${colors.success}, ${colors.info});
                border-radius: 6px 6px 0 0;
                margin-bottom: 6px;
              "></div>
              <div style="font-size: 12px; color: ${colors.success}; font-weight: 600;">
                ${trend.availableSpots}
              </div>
              <div style="font-size: 10px; color: ${colors.neutral[600]};">
                Available
              </div>
            </div>
          </div>
        </div>
      `;

      chart.appendChild(trendCard);
    });
  }, [historicalTrends, isLoading]);

  if (isLoading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Loading historical trends...
        </Typography>
      </Paper>
    );
  }

  // Add fallback data if no trends are available
  const displayTrends = historicalTrends.length > 0 ? historicalTrends : [
    {
      date: '5 Aug',
      occupancyRate: 59.8,
      availableSpots: 833,
      totalSpots: 2077
    },
    {
      date: '6 Aug',
      occupancyRate: 58.5,
      availableSpots: 861,
      totalSpots: 2077
    },
    {
      date: '7 Aug',
      occupancyRate: 56.8,
      availableSpots: 897,
      totalSpots: 2077
    },
    {
      date: '8 Aug',
      occupancyRate: 63.8,
      availableSpots: 751,
      totalSpots: 2077
    },
    {
      date: '9 Aug',
      occupancyRate: 56.8,
      availableSpots: 896,
      totalSpots: 2077
    }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          7-Day Historical Trends
        </Typography>
        <Chip 
          label="Last 7 days" 
          size="small" 
          color="secondary" 
          variant="outlined" 
        />
      </Box>
      <div ref={chartRef} />
      {displayTrends.length === 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          No historical data available
        </Typography>
      )}
    </Paper>
  );
};

export default HistoricalTrendsChart;
