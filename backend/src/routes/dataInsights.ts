import { Router } from 'express';
import { getVehicleOwnershipData, getPopulationData, getParkingSensorData, getParkingAvailabilityData, getParkingTrendsData } from '../controllers/dataInsightsController';

const router: Router = Router();

// Vehicle ownership data
router.get('/vehicle-ownership', getVehicleOwnershipData);

// Population growth data
router.get('/population-growth', getPopulationData);

// Parking sensor data
router.get('/parking-sensors', getParkingSensorData);

// Real-time parking availability
router.get('/parking-availability', getParkingAvailabilityData);

// Parking trends and analytics
router.get('/parking-trends', getParkingTrendsData);

export default router;
