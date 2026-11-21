import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HAS_LETTER_REGEX = /[a-zA-Z]/;
const HAS_DIGIT_REGEX = /[0-9]/;

async function seedAdmin() {
  console.log('====================================================');
  console.log('  DÉCORA — Administrator Provisioning Utility       ');
  console.log('====================================================');

  const email = (process.env.ADMIN_EMAIL || process.argv[2] || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || process.argv[3] || '';
  const fullName = (process.env.ADMIN_NAME || process.argv[4] || 'Décora Lead Architect').trim();

  // 1. Validate Input Presence
  if (!email || !password) {
    console.error('\n[Error] Missing Administrator Credentials.');
    console.error('Usage:');
    console.error('  1. Environment Variables: ADMIN_EMAIL="admin@decora.com" ADMIN_PASSWORD="..." node scripts/seedAdmin.js');
    console.error('  2. CLI Arguments: node scripts/seedAdmin.js <email> <password> [fullName]\n');
    process.exit(1);
  }

  // 2. Validate Email Syntax
  if (!EMAIL_REGEX.test(email)) {
    console.error('\n[Error] Invalid email address format provided.\n');
    process.exit(1);
  }

  // 3. Validate Password Complexity
  if (password.length < 8) {
    console.error('\n[Error] Password must be at least 8 characters long.\n');
    process.exit(1);
  }
  if (Buffer.byteLength(password, 'utf8') > 72) {
    console.error('\n[Error] Password cannot exceed 72 bytes.\n');
    process.exit(1);
  }
  if (!HAS_LETTER_REGEX.test(password)) {
    console.error('\n[Error] Password must contain at least one letter.\n');
    process.exit(1);
  }
  if (!HAS_DIGIT_REGEX.test(password)) {
    console.error('\n[Error] Password must contain at least one digit.\n');
    process.exit(1);
  }

  try {
    await connectDB();

    // 4. Check for Existing Admin (Never overwrite unexpectedly)
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`\n[Info] Administrator account '${email}' already exists in database.`);
      console.log('[Info] Current role:', existing.role);
      console.log('[Info] Existing account was preserved. No modifications were made.\n');
      await disconnectDB();
      process.exit(0);
    }

    // 5. Create Administrator via User model
    const admin = new User({
      fullName,
      email,
      password,
      role: 'admin',
    });

    await admin.save();

    console.log(`\n[Success] Administrator account created successfully!`);
    console.log(`  - ID: ${admin._id}`);
    console.log(`  - Name: ${admin.fullName}`);
    console.log(`  - Email: ${admin.email}`);
    console.log(`  - Role: ${admin.role}`);
    console.log(`  - Created At: ${admin.createdAt.toISOString()}\n`);

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('\n[Fatal Error] Failed to provision administrator:', error.message);
    try {
      await disconnectDB();
    } catch {
      // Ignore
    }
    process.exit(1);
  }
}

seedAdmin();
