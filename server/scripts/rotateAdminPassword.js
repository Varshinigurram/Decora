import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../src/models/User.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function rotateAdminPassword() {
  try {
    await connectDB();

    const admin = await User.findOne({ email: 'admin@decora.com' }).select('+password');
    if (!admin) {
      console.log('[SECURITY] No admin account with email admin@decora.com found in database.');
      await disconnectDB();
      return;
    }

    // Generate cryptographically strong random password
    const secureRandomPassword = crypto.randomBytes(32).toString('hex') + 'A1!';
    admin.password = secureRandomPassword;
    admin.tokenVersion = (admin.tokenVersion || 0) + 1;
    admin.refreshTokenHash = undefined;

    await admin.save();

    console.log('[SECURITY] Administrator credential invalidated and securely rotated in database.');
    await disconnectDB();
  } catch (error) {
    console.error('[SECURITY ERROR] Failed to rotate administrator credential:', error.message);
    try {
      await disconnectDB();
    } catch {}
    process.exit(1);
  }
}

rotateAdminPassword();
