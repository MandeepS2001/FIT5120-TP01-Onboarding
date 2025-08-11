import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import dataInsightsRoutes from './routes/dataInsights';
import parkingRoutes from './routes/parking';
import analyticsRoutes from './routes/analytics';
import dataDiscoveryRoutes from './routes/dataDiscovery';

// Load environment variables
dotenv.config();

const app: express.Application = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || 'v1',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database health check
app.get('/health/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ ok: true });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error?.message || 'DB error' });
  }
});

// API routes
app.use('/api/v1/data-insights', dataInsightsRoutes);
app.use('/api/v1/parking', parkingRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/data-discovery', dataDiscoveryRoutes);

// API info endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Melbourne Parking Accessibility API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      'data-insights': {
        'vehicle-ownership': '/api/v1/data-insights/vehicle-ownership',
        'population-growth': '/api/v1/data-insights/population-growth',
        'parking-sensors': '/api/v1/data-insights/parking-sensors',
        'parking-availability': '/api/v1/data-insights/parking-availability',
        'parking-trends': '/api/v1/data-insights/parking-trends'
      },
      parking: {
        'locations': '/api/v1/parking/locations',
        'availability': '/api/v1/parking/availability',
        'history': '/api/v1/parking/history',
        'predictions': '/api/v1/parking/predictions'
      },
      analytics: {
        'dashboard': '/api/v1/analytics/dashboard',
        'parking': '/api/v1/analytics/parking',
        'vehicles': '/api/v1/analytics/vehicles',
        'sensors': '/api/v1/analytics/sensors',
        'recommendations': '/api/v1/analytics/recommendations'
      },
      'data-discovery': {
        'overview': '/api/v1/data-discovery/overview',
        'file-info': '/api/v1/data-discovery/file/:filePath',
        'statistics': '/api/v1/data-discovery/statistics'
      }
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist on this server`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Data Insights: http://localhost:${PORT}/api/v1/data-insights`);
  console.log(`🚗 Parking Data: http://localhost:${PORT}/api/v1/parking`);
  console.log(`📈 Analytics: http://localhost:${PORT}/api/v1/analytics`);
  console.log(`🔍 Data Discovery: http://localhost:${PORT}/api/v1/data-discovery`);
});

export default app;