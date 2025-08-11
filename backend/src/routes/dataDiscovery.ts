import { Router } from 'express';
import { getDataOverview, getDataFileInfo, getDataStatistics } from '../controllers/dataDiscoveryController';

const router: Router = Router();

// Get overview of all available data files
router.get('/overview', getDataOverview);

// Get detailed information about a specific data file
router.get('/file/:filePath(*)', getDataFileInfo);

// Get data file statistics
router.get('/statistics', getDataStatistics);

export default router;
