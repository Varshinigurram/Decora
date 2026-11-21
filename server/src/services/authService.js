import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/apiError.js';
import { hashToken, safeCompareHashes } from '../utils/cryptoUtils.js';

export const authService = {
  /**
   * Generates a pair of access and refresh JWTs for a user.
   * 
   * @param {Object} user - User document
   * @returns {{ accessToken: string, refreshToken: string }}
   */
  generateTokens(user) {
    const payloadBase = {
      id: user._id.toString(),
      tokenVersion: user.tokenVersion ?? 0,
    };

    const accessToken = jwt.sign(
      {
        ...payloadBase,
        role: user.role,
        type: 'access',
      },
      env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      {
        ...payloadBase,
        type: 'refresh',
        jti: crypto.randomUUID(),
      },
      env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  },

  /**
   * Verifies an access token and validates token type.
   */
  verifyAccessToken(token) {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    if (decoded.type !== 'access') {
      throw AppError.unauthorized('Invalid token type.');
    }
    return decoded;
  },

  /**
   * Verifies a refresh token and validates token type.
   */
  verifyRefreshToken(token) {
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    if (decoded.type !== 'refresh') {
      throw AppError.unauthorized('Invalid token type.');
    }
    return decoded;
  },

  /**
   * Registers a new customer account.
   * Forces role = 'customer'.
   */
  async registerUser({ fullName, email, password }) {
    // 1. Check for email collision
    const existing = await User.findOne({ email });
    if (existing) {
      throw AppError.conflict('An account with this email address already exists.');
    }

    // 2. Create customer user record
    const user = new User({
      fullName,
      email,
      password,
      role: 'customer', // Never allow public registration to set admin
    });

    // 3. Generate session tokens
    const tokens = this.generateTokens(user);

    // 4. Store hashed refresh token
    user.refreshTokenHash = hashToken(tokens.refreshToken);
    await user.save();

    return { user, tokens };
  },

  /**
   * Authenticates user credentials with constant-time password check.
   */
  async loginUser({ email, password }) {
    // Project password and verification fields explicitly
    const user = await User.findOne({ email }).select('+password +tokenVersion +role +isActive');

    // Generic 401 error message for both non-existent user and incorrect password
    const genericAuthError = AppError.unauthorized('Invalid email address or password.');

    if (!user || !user.isActive) {
      throw genericAuthError;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw genericAuthError;
    }

    // Generate new tokens
    const tokens = this.generateTokens(user);

    // Update stored refresh token hash atomically
    user.refreshTokenHash = hashToken(tokens.refreshToken);
    await user.save();

    return { user, tokens };
  },

  /**
   * Atomically rotates refresh token, guarding against concurrency and replay attacks.
   */
  async rotateRefreshToken(incomingToken) {
    if (!incomingToken) {
      throw AppError.unauthorized('Refresh token is required.');
    }

    // 1. Verify token signature, expiry and type
    const decoded = this.verifyRefreshToken(incomingToken);

    // 2. Fetch live user with refresh hash and status
    const user = await User.findById(decoded.id).select('+refreshTokenHash +tokenVersion +isActive +role');
    if (!user || !user.isActive) {
      throw AppError.unauthorized('Account is deactivated or no longer exists.');
    }

    const incomingHash = hashToken(incomingToken);

    // 3. Replay Detection & Invalidation:
    // If tokenVersion matches but the stored hash does not match, a previously rotated token is being re-presented.
    if (!safeCompareHashes(user.refreshTokenHash, incomingHash)) {
      if (decoded.tokenVersion === user.tokenVersion) {
        // Confirmed replay of a validly signed token from current version family:
        // Invalidate active session and increment tokenVersion to revoke all outstanding access tokens
        user.tokenVersion += 1;
        user.refreshTokenHash = null;
        await user.save();
        throw AppError.unauthorized('Session invalidated due to detected token reuse. Please sign in again.');
      }
      throw AppError.unauthorized('Invalid or superseded session. Please sign in again.');
    }

    // 4. Generate replacement token pair
    const tokens = this.generateTokens(user);
    const newRefreshHash = hashToken(tokens.refreshToken);

    // 5. Atomic conditional replacement
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: user._id,
        refreshTokenHash: incomingHash,
        tokenVersion: decoded.tokenVersion,
        isActive: true,
      },
      {
        $set: { refreshTokenHash: newRefreshHash },
      },
      { new: true }
    );

    // If null, a concurrent request already consumed this refresh token
    if (!updatedUser) {
      throw AppError.unauthorized('Session conflict: Token has already been rotated. Please sign in again.');
    }

    return { user: updatedUser, tokens };
  },

  /**
   * Invalidates active refresh session for a user.
   */
  async logoutUser(userId) {
    if (!userId) return;
    try {
      await User.findByIdAndUpdate(userId, { $set: { refreshTokenHash: null } });
    } catch {
      // Ignore database errors during logout to ensure cookies are still cleared
    }
  },
};
