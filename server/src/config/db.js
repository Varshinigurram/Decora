import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

/**
 * Sanitizes a MongoDB connection URI for safe console logging,
 * masking any username/password credentials.
 */
function sanitizeUri(uri) {
  if (!uri) return 'undefined';
  try {
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  } catch {
    return '[Protected URI]';
  }
}

/**
 * Connects to MongoDB using the validated MONGODB_URI.
 * Configured with strict timeouts and error handlers.
 * Never silently switches databases or falls back to in-memory storage.
 */
export async function connectDB() {
  if (isConnected) {
    return mongoose.connection;
  }

  const sanitized = sanitizeUri(env.MONGODB_URI);

  try {
    console.log(`[Database] Connecting to MongoDB at ${sanitized}...`);

    const connectionOptions = {
      serverSelectionTimeoutMS: 5000, // Fail fast after 5s if Atlas/cluster is unreachable
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(env.MONGODB_URI, connectionOptions);
    isConnected = true;

    console.log(`[Database] MongoDB Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);

    // Mongoose connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('[Database Error] Mongoose runtime connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database Warning] Mongoose disconnected from MongoDB.');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[Database] Mongoose reconnected to MongoDB.');
      isConnected = true;
    });

    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    throw error;
  }
}

/**
 * Closes the active MongoDB connection cleanly during graceful server shutdown.
 */
export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    console.log('[Database] Closing MongoDB connection...');
    await mongoose.connection.close(false);
    isConnected = false;
    console.log('[Database] MongoDB connection closed.');
  }
}

/**
 * Returns current MongoDB connection readiness state.
 * 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
 */
export function getDbReadiness() {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
}
