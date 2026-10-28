import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { validateEnv, env } from './config/env.js';
import pool, { closePool } from './config/db.js';
import authRoutes from './routes/auth.js';

// ── Validate environment before anything else ──────────────────────────
validateEnv();

const app = express();

// ── 1. CORS — exact origin, credentials allowed ───────────────────────
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));

// ── 2. Body parsing ───────────────────────────────────────────────────
app.use(express.json());

// ── 3. Cookie parsing ─────────────────────────────────────────────────
app.use(cookieParser());

// ── 4. Auth routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── 5. Health endpoint (preserved) ────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// ── 6. Centralized error handler ──────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start server ──────────────────────────────────────────────────────
const PORT = env.PORT;
const server = app.listen(PORT, () => {
  console.log(`[server] Campus Auction API running on http://localhost:${PORT}`);
  console.log(`[server] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[server] CORS origin:  ${env.CLIENT_URL}`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────
async function shutdown(signal) {
  console.log(`\n[server] ${signal} received — shutting down...`);
  server.close(async () => {
    await closePool();
    console.log('[server] Goodbye.');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 5_000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default app;
