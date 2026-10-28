import 'dotenv/config';

const REQUIRED = ['DATABASE_URL', 'JWT_SECRET'];

/**
 * Validate that all required environment variables are set.
 * Exits the process with a helpful message if any are missing.
 */
export function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(
      `[env] Fatal: missing required environment variable(s): ${missing.join(', ')}\n` +
      '     Copy server/.env.example to server/.env and fill in real values.'
    );
    process.exit(1);
  }
}

export const env = {
  get PORT() { return Number(process.env.PORT) || 5000; },
  get NODE_ENV() { return process.env.NODE_ENV || 'development'; },
  get isProd() { return this.NODE_ENV === 'production'; },
  get DATABASE_URL() { return process.env.DATABASE_URL; },
  get JWT_SECRET() { return process.env.JWT_SECRET; },
  get JWT_EXPIRES_IN() { return process.env.JWT_EXPIRES_IN || '1d'; },
  get CLIENT_URL() { return process.env.CLIENT_URL || 'http://localhost:5173'; },
};
