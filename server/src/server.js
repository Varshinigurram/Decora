import app from './app.js';
import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';

let serverInstance = null;
let isShuttingDown = false;

/**
 * Gracefully shuts down the HTTP server and database connections.
 * Prevents duplicate shutdown invocation.
 */
async function gracefulShutdown(signal) {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;

  console.log(`\n[Process] Received ${signal}. Starting graceful shutdown...`);

  // Stop accepting incoming HTTP connections
  if (serverInstance) {
    console.log('[Server] Closing HTTP listener...');
    serverInstance.close(async () => {
      console.log('[Server] HTTP listener closed. No longer accepting requests.');

      try {
        // Disconnect MongoDB connection cleanly
        await disconnectDB();
        console.log('[Process] Graceful shutdown complete. Exiting.');
        process.exit(0);
      } catch (err) {
        console.error('[Process Error] Error while disconnecting database during shutdown:', err.message);
        process.exit(1);
      }
    });

    // Force shutdown after 10s if connections refuse to close
    setTimeout(() => {
      console.error('[Process Error] Forced shutdown: connections timed out after 10s.');
      process.exit(1);
    }, 10000).unref();
  } else {
    await disconnectDB();
    process.exit(0);
  }
}

/**
 * Boots the Décora REST API server.
 * Connects to MongoDB first; starts HTTP listener only after database connection succeeds.
 */
async function startServer() {
  try {
    console.log('====================================================');
    console.log('  DÉCORA — Architectural Interior Platform Server   ');
    console.log('====================================================');
    console.log(`[Config] Environment: ${env.NODE_ENV}`);
    console.log(`[Config] Target Port: ${env.PORT}`);
    console.log(`[Config] Allowed Origin: ${env.CLIENT_URL}`);

    // 1. Connect to Database (Required before listening)
    await connectDB();

    // 2. Start Express HTTP Server
    serverInstance = app.listen(env.PORT, () => {
      console.log(`[Server] Express server listening on http://localhost:${env.PORT}`);
      console.log(`[Server] Health check available at: http://localhost:${env.PORT}/api/v1/health`);
      console.log(`[Server] Readiness probe available at: http://localhost:${env.PORT}/api/v1/ready`);
    });

    // 3. Handle Port Binding Collisions explicitly - Never silently switch ports
    serverInstance.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n[FATAL] Port ${env.PORT} is already in use by another process.`);
        console.error(`Please terminate the conflicting process or configure a different PORT in server/.env.\n`);
        process.exit(1);
      } else {
        console.error('[Server Error] Unexpected server error:', err);
        process.exit(1);
      }
    });

    // 4. Attach OS Process Signal Handlers
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // 5. Global Unhandled Rejection / Exception Handlers
    process.on('unhandledRejection', (reason) => {
      console.error('[Process Error] Unhandled Promise Rejection:', reason);
      gracefulShutdown('unhandledRejection');
    });

    process.on('uncaughtException', (err) => {
      console.error('[Process Error] Uncaught Exception thrown:', err);
      gracefulShutdown('uncaughtException');
    });
  } catch (error) {
    console.error('[FATAL] Failed to initialize server:', error.message);
    process.exit(1);
  }
}

startServer();
