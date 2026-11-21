import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env relative to server root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Validates and exposes server environment configuration.
 * Fails fast with descriptive error messages if required variables are missing.
 * Never prints secrets or credentials to logs.
 */
function validateEnv() {
  const errors = [];

  const NODE_ENV = process.env.NODE_ENV || 'development';
  const PORT = parseInt(process.env.PORT, 10) || 5000;
  const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
  const MONGODB_URI = process.env.MONGODB_URI;
  const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;

  // Enforce MONGODB_URI presence - never silently fall back
  if (!MONGODB_URI || MONGODB_URI.trim() === '' || MONGODB_URI === 'your_mongodb_atlas_connection_string') {
    errors.push('MONGODB_URI is required. Please set a valid MongoDB connection string in server/.env.');
  }

  // Validate Secrets
  if (NODE_ENV === 'production') {
    if (!JWT_ACCESS_SECRET || JWT_ACCESS_SECRET === 'replace_with_a_strong_random_secret') {
      errors.push('JWT_ACCESS_SECRET must be configured with a strong random secret in production.');
    }
    if (!JWT_REFRESH_SECRET || JWT_REFRESH_SECRET === 'replace_with_another_strong_random_secret') {
      errors.push('JWT_REFRESH_SECRET must be configured with a strong random secret in production.');
    }
    if (BCRYPT_SALT_ROUNDS < 10) {
      errors.push('BCRYPT_SALT_ROUNDS must be at least 10 in production.');
    }
  }

  if (errors.length > 0) {
    console.error('\n[FATAL] Environment Configuration Errors:');
    errors.forEach((err) => console.error(`  - ${err}`));
    console.error('\nServer cannot start with invalid environment configuration.\n');
    throw new Error('Environment configuration validation failed.');
  }

  return {
    isProduction: NODE_ENV === 'production',
    isDevelopment: NODE_ENV === 'development',
    NODE_ENV,
    PORT,
    CLIENT_URL,
    MONGODB_URI,
    JWT_ACCESS_SECRET: JWT_ACCESS_SECRET || 'dev_jwt_access_fallback_secret_decora_2026',
    JWT_REFRESH_SECRET: JWT_REFRESH_SECRET || 'dev_jwt_refresh_fallback_secret_decora_2026',
    BCRYPT_SALT_ROUNDS,
  };
}

export const env = validateEnv();
