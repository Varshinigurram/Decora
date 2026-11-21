import crypto from 'crypto';

/**
 * Generates a SHA-256 cryptographic digest of a token string.
 * Used for storing high-entropy refresh tokens without event-loop lag.
 * 
 * @param {string} token 
 * @returns {string} 64-character hexadecimal string
 */
export function hashToken(token) {
  if (!token || typeof token !== 'string') return '';
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Constant-time comparison of two SHA-256 hex digests.
 * Prevents side-channel timing attacks.
 * 
 * @param {string} hashA 
 * @param {string} hashB 
 * @returns {boolean}
 */
export function safeCompareHashes(hashA, hashB) {
  if (!hashA || !hashB || typeof hashA !== 'string' || typeof hashB !== 'string') {
    return false;
  }
  if (hashA.length !== hashB.length) {
    return false;
  }

  try {
    const bufA = Buffer.from(hashA, 'hex');
    const bufB = Buffer.from(hashB, 'hex');
    if (bufA.length !== bufB.length || bufA.length === 0) {
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
