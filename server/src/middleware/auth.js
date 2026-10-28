import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import pool from '../config/db.js';

const COOKIE_NAME = 'token';
const JWT_ISSUER = 'campus-auction';
const JWT_AUDIENCE = 'campus-auction-client';

/**
 * Express middleware: requires a valid JWT in the HttpOnly cookie.
 * Attaches `req.user` = { id, name, email, campus_id } on success.
 */
export async function requireAuth(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Verify signature, expiration, issuer, audience
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  // Confirm the account still exists
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, campus_id FROM users WHERE id = $1',
      [payload.sub]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Account no longer exists' });
    }
    req.user = rows[0];
    next();
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Sign a JWT and set it as an HttpOnly cookie on the response.
 */
export function setAuthCookie(res, userId) {
  const token = jwt.sign(
    { sub: userId },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }
  );

  const maxAge = parseDuration(env.JWT_EXPIRES_IN);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

/**
 * Clear the auth cookie.
 */
export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: 'lax',
    path: '/',
  });
}

/** Convert "1d" / "7d" / "2h" → milliseconds */
function parseDuration(str) {
  const match = str.match(/^(\d+)([dhms])$/);
  if (!match) return 86_400_000; // default 1 day
  const n = Number(match[1]);
  const unit = match[2];
  const ms = { d: 86_400_000, h: 3_600_000, m: 60_000, s: 1_000 };
  return n * (ms[unit] || 86_400_000);
}

export { COOKIE_NAME, JWT_ISSUER, JWT_AUDIENCE };
