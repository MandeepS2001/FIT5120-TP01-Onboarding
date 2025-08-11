import { Router } from 'express';
import { 
  getAnalyticsDashboard, 
  getParkingAnalytics, 
  getVehicleAnalytics, 
  getSensorStatusSummary, 
  getParkingRecommendations 
} from '../controllers/analyticsController';

const router: Router = Router();

// Comprehensive analytics dashboard
router.get('/dashboard', getAnalyticsDashboard);

// Individual analytics endpoints
router.get('/parking', getParkingAnalytics);
router.get('/vehicles', getVehicleAnalytics);
router.get('/sensors', getSensorStatusSummary);
router.get('/recommendations', getParkingRecommendations);

export default router;
