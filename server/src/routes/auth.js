import { Router } from 'express';
import bcrypt from 'bcrypt';
import rateLimit from 'express-rate-limit';
import pool from '../config/db.js';
import {
  requireAuth,
  setAuthCookie,
  clearAuthCookie,
} from '../middleware/auth.js';

const router = Router();

// ── Rate limiter for auth endpoints ────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                  // 20 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again later.' },
});

router.use(authLimiter);

// ── Validation helpers ─────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 100;
const MAX_EMAIL = 255;
const MAX_CAMPUS = 50;
const MIN_PW = 6;
const MAX_PW = 72; // bcrypt limit

function validateRegister(body) {
  const errors = [];
  const { name, email, password, campus_id } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0)
    errors.push('Name is required');
  else if (name.trim().length > MAX_NAME)
    errors.push(`Name must be at most ${MAX_NAME} characters`);

  if (!email || typeof email !== 'string' || email.trim().length === 0)
    errors.push('Email is required');
  else if (!EMAIL_RE.test(email.trim()))
    errors.push('Invalid email format');
  else if (email.trim().length > MAX_EMAIL)
    errors.push(`Email must be at most ${MAX_EMAIL} characters`);

  if (!password || typeof password !== 'string')
    errors.push('Password is required');
  else if (password.length < MIN_PW)
    errors.push(`Password must be at least ${MIN_PW} characters`);
  else if (password.length > MAX_PW)
    errors.push(`Password must be at most ${MAX_PW} characters`);

  if (!campus_id || typeof campus_id !== 'string' || campus_id.trim().length === 0)
    errors.push('Campus ID is required');
  else if (campus_id.trim().length > MAX_CAMPUS)
    errors.push(`Campus ID must be at most ${MAX_CAMPUS} characters`);

  return errors;
}

function validateLogin(body) {
  const errors = [];
  if (!body.email || typeof body.email !== 'string' || body.email.trim().length === 0)
    errors.push('Email is required');
  if (!body.password || typeof body.password !== 'string')
    errors.push('Password is required');
  return errors;
}

/** Return safe user object (no password_hash) */
function safeUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    campus_id: row.campus_id,
  };
}

// ── POST /api/auth/register ────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const errors = validateRegister(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors[0], errors });
  }

  const name = req.body.name.trim();
  const email = req.body.email.trim().toLowerCase();
  const campus_id = req.body.campus_id.trim();
  const password = req.body.password;

  try {
    const hash = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, campus_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, campus_id`,
      [name, email, hash, campus_id]
    );

    const user = rows[0];

    // Auto sign-in after registration
    setAuthCookie(res, user.id);

    return res.status(201).json({ user: safeUser(user) });
  } catch (err) {
    // Unique constraint violation → duplicate email
    if (err.code === '23505') {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    console.error('[auth] Registration error:', err.message);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// ── POST /api/auth/login ───────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const errors = validateLogin(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: errors[0], errors });
  }

  const email = req.body.email.trim().toLowerCase();
  const password = req.body.password;

  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, campus_id, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    setAuthCookie(res, user.id);

    return res.json({ user: safeUser(user) });
  } catch (err) {
    console.error('[auth] Login error:', err.message);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// ── POST /api/auth/logout ──────────────────────────────────────────────
router.post('/logout', (_req, res) => {
  clearAuthCookie(res);
  return res.json({ message: 'Logged out successfully' });
});

// ── GET /api/auth/me ───────────────────────────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  return res.json({ user: safeUser(req.user) });
});

// ── GET /api/auth/protected-test (development only) ────────────────────
router.get('/protected-test', requireAuth, (req, res) => {
  return res.json({
    message: 'You are authenticated',
    user: safeUser(req.user),
  });
});

export default router;
