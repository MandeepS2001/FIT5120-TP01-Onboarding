import { DataProcessor } from '../utils/dataProcessor';

export interface ParkingAnalytics {
  totalSensors: number;
  availabilityRate: number;
  areaBreakdown: Record<string, any>;
  timeSeriesData: any[];
  recommendations: string[];
}

export interface VehicleAnalytics {
  totalVehicles: number;
  vehiclesPer1000: number;
  growthTrend: number;
  yearOverYearChange: number;
}

export class AnalyticsService {
  // Get comprehensive parking analytics
  async getParkingAnalytics(): Promise<ParkingAnalytics> {
    try {
      const filePath = DataProcessor.getDataPath('datasets/on-street-parking-bay-sensors.json');
      const sensors = DataProcessor.parseJSON(filePath);

      const totalSensors = sensors.length;
      const availableSensors = sensors.filter((s: any) => s.status_description === 'Unoccupied').length;
      const availabilityRate = (availableSensors / totalSensors) * 100;

      // Area breakdown analysis
      const areaBreakdown = sensors.reduce((acc: any, sensor: any) => {
        // Extract area from coordinates - use a simple grid-based approach
        const lon = sensor.location?.lon;
        const lat = sensor.location?.lat;
        
        // Create a simple area identifier based on coordinate ranges
        let area = 'Unknown';
        if (lon && lat) {
          // Melbourne CBD is roughly between 144.95-144.98 longitude and -37.81 to -37.82 latitude
          if (lon >= 144.95 && lon <= 144.98 && lat >= -37.82 && lat <= -37.81) {
            area = 'Melbourne CBD';
          } else if (lon >= 144.96 && lon <= 144.97 && lat >= -37.81 && lat <= -37.80) {
            area = 'North Melbourne';
          } else if (lon >= 144.97 && lon <= 144.98 && lat >= -37.82 && lat <= -37.81) {
            area = 'East Melbourne';
          } else if (lon >= 144.94 && lon <= 144.95 && lat >= -37.81 && lat <= -37.80) {
            area = 'West Melbourne';
          } else {
            area = 'Greater Melbourne';
          }
        }
        
        if (!acc[area]) {
          acc[area] = { total: 0, available: 0, occupied: 0, maintenance: 0 };
        }
        acc[area].total++;
        if (sensor.status_description === 'Unoccupied') acc[area].available++;
        else if (sensor.status_description === 'Present') acc[area].occupied++;
        else acc[area].maintenance++; // Any other status goes to maintenance
        return acc;
      }, {});

      // Generate time series data for the last 24 hours
      const timeSeriesData = [];
      const now = new Date();
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now);
        time.setHours(time.getHours() - i);
        
        timeSeriesData.push({
          time: time.toISOString(),
          available: Math.floor(Math.random() * 20) + availableSensors - 10,
          occupied: Math.floor(Math.random() * 20) + (totalSensors - availableSensors - 10)
        });
      }

      // Generate recommendations based on data analysis
      const recommendations = this.generateParkingRecommendations(areaBreakdown, availabilityRate);

      return {
        totalSensors,
        availabilityRate: parseFloat(availabilityRate.toFixed(2)),
        areaBreakdown,
        timeSeriesData,
        recommendations
      };
    } catch (error) {
      throw new Error(`Failed to generate parking analytics: ${error}`);
    }
  }

  // Get vehicle ownership analytics
  async getVehicleAnalytics(): Promise<VehicleAnalytics> {
    try {
      const filePath = DataProcessor.getDataPath('vis_us1.1/vehicle_ownership.csv');
      const data = DataProcessor.parseCSV(filePath);

      // Calculate analytics
      const latestData = data[data.length - 1];
      const previousData = data[data.length - 2];
      
      const totalVehicles = parseFloat(latestData.vehicles || '0');
      const vehiclesPer1000 = parseFloat(latestData.vehiclesPer1000 || '0');
      
      const growthTrend = previousData ? 
        ((totalVehicles - parseFloat(previousData.vehicles || '0')) / parseFloat(previousData.vehicles || '1')) * 100 : 0;
      
      const yearOverYearChange = data.length >= 2 ? 
        ((totalVehicles - parseFloat(data[0].vehicles || '0')) / parseFloat(data[0].vehicles || '1')) * 100 : 0;

      return {
        totalVehicles,
        vehiclesPer1000,
        growthTrend: parseFloat(growthTrend.toFixed(2)),
        yearOverYearChange: parseFloat(yearOverYearChange.toFixed(2))
      };
    } catch (error) {
      throw new Error(`Failed to generate vehicle analytics: ${error}`);
    }
  }

  // Generate parking recommendations based on data analysis
  private generateParkingRecommendations(areaBreakdown: Record<string, any>, availabilityRate: number): string[] {
    const recommendations = [];

    // Analyze area performance
    const lowAvailabilityAreas = Object.entries(areaBreakdown)
      .filter(([_, stats]: [string, any]) => {
        const areaRate = (stats.available / stats.total) * 100;
        return areaRate < 20; // Less than 20% availability
      })
      .map(([area, _]) => area);

    if (lowAvailabilityAreas.length > 0) {
      recommendations.push(`Consider expanding parking infrastructure in ${lowAvailabilityAreas.join(', ')} due to low availability`);
    }

    if (availabilityRate < 30) {
      recommendations.push('Overall parking availability is low. Consider implementing dynamic pricing to improve turnover');
    }

    if (availabilityRate > 70) {
      recommendations.push('High parking availability detected. Consider reducing parking fees to increase utilization');
    }

    // Add general recommendations
    recommendations.push('Implement real-time parking guidance to help drivers find available spaces');
    recommendations.push('Consider time-based pricing to encourage turnover during peak hours');
    recommendations.push('Monitor maintenance needs for sensors showing consistent "maintenance" status');

    return recommendations;
  }

  // Get real-time sensor status summary
  async getSensorStatusSummary(): Promise<any> {
    try {
      const filePath = DataProcessor.getDataPath('datasets/on-street-parking-bay-sensors.json');
      const sensors = DataProcessor.parseJSON(filePath);

      const statusCounts = sensors.reduce((acc: any, sensor: any) => {
        const status = sensor.status_description || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const totalSensors = sensors.length;
      const statusPercentages = Object.entries(statusCounts).reduce((acc: any, [status, count]: [string, any]) => {
        acc[status] = parseFloat(((count / totalSensors) * 100).toFixed(2));
        return acc;
      }, {});

      return {
        totalSensors,
        statusCounts,
        statusPercentages,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to get sensor status summary: ${error}`);
    }
  }
}
