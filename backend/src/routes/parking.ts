import { Router } from 'express';
import { getParkingLocations, getParkingAvailability, getParkingHistory, getParkingPredictions } from '../controllers/parkingController';

const router: Router = Router();

// Get all parking locations
router.get('/locations', getParkingLocations);

// Get real-time parking availability
router.get('/availability', getParkingAvailability);

// Get parking history data
router.get('/history', getParkingHistory);

// Get parking predictions
router.get('/predictions', getParkingPredictions);

export default router;
