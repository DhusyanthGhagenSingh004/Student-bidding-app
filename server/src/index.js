import express from 'express';
import 'dotenv/config';
import pool, { closePool } from './config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────
app.use(express.json());

// ── Health endpoint ────────────────────────────────────────────────────
// GET /api/health — lightweight DB connectivity check
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res
      .status(503)
      .json({ status: 'error', database: 'disconnected' });
  }
});

// ── Start server ───────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`[server] Campus Auction API running on http://localhost:${PORT}`);
  console.log(`[server] Health check: http://localhost:${PORT}/api/health`);
});

// ── Graceful shutdown ──────────────────────────────────────────────────
async function shutdown(signal) {
  console.log(`\n[server] ${signal} received — shutting down...`);
  server.close(async () => {
    await closePool();
    console.log('[server] Goodbye.');
    process.exit(0);
  });
  // Force exit after 5 s if server.close() hangs
  setTimeout(() => process.exit(1), 5_000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default app;
