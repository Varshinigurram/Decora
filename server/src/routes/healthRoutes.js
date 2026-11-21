import { Router } from 'express';
import { apiResponse } from '../utils/apiResponse.js';
import { getDbReadiness } from '../config/db.js';

const router = Router();
const startTime = Date.now();

/**
 * GET /api/v1/health
 * Basic liveness probe confirming that the Express server process is running.
 */
router.get('/health', (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  return apiResponse.success(
    res,
    {
      status: 'HEALTHY',
      service: 'decora-backend',
      apiVersion: 'v1',
      uptime: `${uptimeSeconds}s`,
    },
    'Décora API server is operational'
  );
});

/**
 * GET /api/v1/ready
 * Readiness probe checking MongoDB database connection state.
 * Returns 200 when connected; 503 when disconnected.
 * Never exposes credentials or full connection strings.
 */
router.get('/ready', (req, res) => {
  const readiness = getDbReadiness();

  if (readiness.isConnected) {
    return apiResponse.success(
      res,
      {
        status: 'READY',
        database: {
          connected: true,
          readyState: readiness.readyState,
          name: readiness.name,
        },
      },
      'Database connection is healthy and ready'
    );
  }

  return res.status(503).json({
    success: false,
    statusCode: 503,
    message: 'Database is not ready to receive traffic',
    data: {
      status: 'NOT_READY',
      database: {
        connected: false,
        readyState: readiness.readyState,
      },
    },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
