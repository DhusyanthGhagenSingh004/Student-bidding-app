import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// ── Validate required environment ──────────────────────────────────────
if (!process.env.DATABASE_URL) {
  console.error(
    '[db] Fatal: DATABASE_URL is not set.\n' +
    '     Copy server/.env.example to server/.env and add your Supabase connection string.'
  );
  process.exit(1);
}

// ── Create connection pool ─────────────────────────────────────────────
// Uses the Supabase Session Pooler connection string from DATABASE_URL.
// SSL is required by Supabase; rejectUnauthorized is false because
// Supabase pooler connections use certificates that aren't in the
// default Node.js CA store.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ── Log pool-level errors (without exposing credentials) ───────────────
pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err.message);
});

// ── Graceful shutdown helper ───────────────────────────────────────────
/**
 * Drain all clients and close the pool.
 * Call this when the process is shutting down.
 */
export async function closePool() {
  try {
    await pool.end();
    console.log('[db] Connection pool closed.');
  } catch (err) {
    console.error('[db] Error closing pool:', err.message);
  }
}

export default pool;
