/**
 * Database Connectivity Test
 *
 * Verifies:
 *  1. PostgreSQL connection via Supabase
 *  2. All six required tables exist in the public schema
 *
 * Usage:  npm run test:db   (from the server/ directory)
 * Exit 0 = success, Exit 1 = failure
 */

import pool, { closePool } from '../config/db.js';

const REQUIRED_TABLES = [
  'users',
  'auctions',
  'auction_images',
  'bids',
  'sales',
  'notifications',
];

async function run() {
  console.log('\n──────────────────────────────────────');
  console.log('  Campus Auction — Database Test');
  console.log('──────────────────────────────────────\n');

  // ── 1. Test basic connectivity ─────────────────────────────────────
  console.log('[1/2] Testing database connection...');

  let client;
  try {
    client = await pool.connect();
  } catch (err) {
    console.error('  ✗ Connection FAILED:', err.message);
    await closePool();
    process.exit(1);
  }

  try {
    const { rows } = await client.query(`
      SELECT
        current_database() AS database_name,
        current_user       AS database_user,
        NOW()              AS server_time
    `);

    const info = rows[0];
    console.log('  ✓ Connected successfully');
    console.log(`    Database : ${info.database_name}`);
    console.log(`    User     : ${info.database_user}`);
    console.log(`    Time     : ${info.server_time}`);
  } catch (err) {
    console.error('  ✗ Query FAILED:', err.message);
    client.release();
    await closePool();
    process.exit(1);
  }

  // ── 2. Verify required tables ──────────────────────────────────────
  console.log('\n[2/2] Verifying required tables...');

  try {
    const { rows } = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN (
            'users',
            'auctions',
            'auction_images',
            'bids',
            'sales',
            'notifications'
        )
      ORDER BY table_name
    `);

    const found = rows.map((r) => r.table_name);
    const missing = REQUIRED_TABLES.filter((t) => !found.includes(t));

    if (found.length > 0) {
      console.log(`  Found ${found.length} table(s):`);
      found.forEach((t) => console.log(`    ✓ ${t}`));
    }

    if (missing.length > 0) {
      console.log(`\n  Missing ${missing.length} table(s):`);
      missing.forEach((t) => console.log(`    ✗ ${t}`));
      console.log('\n──────────────────────────────────────');
      console.log('  RESULT: FAIL — missing tables');
      console.log('──────────────────────────────────────\n');
      client.release();
      await closePool();
      process.exit(1);
    }

    console.log('\n──────────────────────────────────────');
    console.log('  RESULT: ALL CHECKS PASSED ✓');
    console.log('──────────────────────────────────────\n');
  } catch (err) {
    console.error('  ✗ Table check FAILED:', err.message);
    client.release();
    await closePool();
    process.exit(1);
  }

  client.release();
  await closePool();
  process.exit(0);
}

run();
