import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';

const analyticsService = new AnalyticsService();

// Get comprehensive analytics dashboard data
export const getAnalyticsDashboard = async (req: Request, res: Response) => {
  try {
    const [parkingAnalytics, vehicleAnalytics, sensorSummary] = await Promise.all([
      analyticsService.getParkingAnalytics(),
      analyticsService.getVehicleAnalytics(),
      analyticsService.getSensorStatusSummary()
    ]);

    const dashboardData = {
      parking: parkingAnalytics,
      vehicles: vehicleAnalytics,
      sensors: sensorSummary,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: dashboardData,
      source: 'Real-time analytics from data-science datasets'
    });
  } catch (error: any) {
    console.error('Error generating analytics dashboard:', error);
    res.status(500).json({ error: 'Failed to generate analytics dashboard', message: error.message });
  }
};

// Get parking analytics only
export const getParkingAnalytics = async (req: Request, res: Response) => {
  try {
    const analytics = await analyticsService.getParkingAnalytics();
    
    res.json({
      success: true,
      data: analytics,
      source: 'Real-time parking analytics from sensor data'
    });
  } catch (error: any) {
    console.error('Error getting parking analytics:', error);
    res.status(500).json({ error: 'Failed to get parking analytics', message: error.message });
  }
};

// Get vehicle analytics only
export const getVehicleAnalytics = async (req: Request, res: Response) => {
  try {
    const analytics = await analyticsService.getVehicleAnalytics();
    
    res.json({
      success: true,
      data: analytics,
      source: 'Vehicle ownership analytics from ABS data'
    });
  } catch (error: any) {
    console.error('Error getting vehicle analytics:', error);
    res.status(500).json({ error: 'Failed to get vehicle analytics', message: error.message });
  }
};

// Get sensor status summary
export const getSensorStatusSummary = async (req: Request, res: Response) => {
  try {
    const summary = await analyticsService.getSensorStatusSummary();
    
    res.json({
      success: true,
      data: summary,
      source: 'Real-time sensor status from parking sensors'
    });
  } catch (error: any) {
    console.error('Error getting sensor status summary:', error);
    res.status(500).json({ error: 'Failed to get sensor status summary', message: error.message });
  }
};

// Get real-time parking recommendations
export const getParkingRecommendations = async (req: Request, res: Response) => {
  try {
    const analytics = await analyticsService.getParkingAnalytics();
    
    res.json({
      success: true,
      data: {
        recommendations: analytics.recommendations,
        context: {
          totalSensors: analytics.totalSensors,
          availabilityRate: analytics.availabilityRate,
          areasAnalyzed: Object.keys(analytics.areaBreakdown).length
        }
      },
      source: 'AI-powered recommendations based on real sensor data'
    });
  } catch (error: any) {
    console.error('Error getting parking recommendations:', error);
    res.status(500).json({ error: 'Failed to get parking recommendations', message: error.message });
  }
};
