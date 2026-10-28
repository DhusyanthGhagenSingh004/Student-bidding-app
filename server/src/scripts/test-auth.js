/**
 * Auth API Integration Tests
 * Run: node src/scripts/test-auth.js
 */

const BASE = 'http://localhost:5000';

const TEST_USER = {
  name: 'Demo Student',
  email: `demo_${Date.now()}@campus.edu`, // unique per run
  password: 'SecurePass123!',
  campus_id: 'PRN1001',
};

let cookie = '';

async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (cookie) opts.headers['Cookie'] = cookie;
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);

  // Capture set-cookie
  const sc = res.headers.getSetCookie?.();
  if (sc && sc.length > 0) {
    cookie = sc.map((c) => c.split(';')[0]).join('; ');
  }

  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

let passed = 0;
let failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

async function run() {
  console.log('\n══════════════════════════════════════');
  console.log('  Auth Integration Tests');
  console.log('══════════════════════════════════════\n');

  // ── 1. Registration ──────────────────────────────────────────────
  console.log('[Registration]');

  const reg = await request('POST', '/api/auth/register', TEST_USER);
  assert('Status 201', reg.status === 201);
  assert('Returns user object', !!reg.data.user);
  assert('Has user id', !!reg.data.user?.id);
  assert('Name matches', reg.data.user?.name === TEST_USER.name);
  assert('Email matches', reg.data.user?.email === TEST_USER.email.toLowerCase());
  assert('No password_hash exposed', !reg.data.user?.password_hash);
  assert('Cookie was set', cookie.includes('token='));

  // ── 2. Duplicate registration ────────────────────────────────────
  console.log('\n[Duplicate Registration]');
  const dup = await request('POST', '/api/auth/register', TEST_USER);
  assert('Status 409', dup.status === 409);
  assert('Error message present', !!dup.data.error);

  // ── 3. GET /me with valid cookie ─────────────────────────────────
  console.log('\n[Session — /me]');
  const me = await request('GET', '/api/auth/me');
  assert('Status 200', me.status === 200);
  assert('Returns user', !!me.data.user);
  assert('User id matches registered', me.data.user?.id === reg.data.user?.id);

  // ── 4. Protected test route ──────────────────────────────────────
  console.log('\n[Protected Test Route]');
  const prot = await request('GET', '/api/auth/protected-test');
  assert('Status 200', prot.status === 200);
  assert('Message is authenticated', prot.data.message === 'You are authenticated');

  // ── 5. Logout ────────────────────────────────────────────────────
  console.log('\n[Logout]');
  const out = await request('POST', '/api/auth/logout');
  assert('Status 200', out.status === 200);

  // ── 6. /me after logout (no cookie) ──────────────────────────────
  console.log('\n[After Logout — /me]');
  cookie = ''; // simulate cleared cookie
  const meAfter = await request('GET', '/api/auth/me');
  assert('Status 401', meAfter.status === 401);

  // ── 7. Protected test without cookie ─────────────────────────────
  console.log('\n[Protected Test Without Cookie]');
  const protAfter = await request('GET', '/api/auth/protected-test');
  assert('Status 401', protAfter.status === 401);

  // ── 8. Login with registered account ─────────────────────────────
  console.log('\n[Login]');
  const login = await request('POST', '/api/auth/login', {
    email: TEST_USER.email,
    password: TEST_USER.password,
  });
  assert('Status 200', login.status === 200);
  assert('Returns user', !!login.data.user);
  assert('Cookie was set', cookie.includes('token='));

  // ── 9. /me after login ───────────────────────────────────────────
  console.log('\n[After Login — /me]');
  const meLogin = await request('GET', '/api/auth/me');
  assert('Status 200', meLogin.status === 200);
  assert('Email matches', meLogin.data.user?.email === TEST_USER.email.toLowerCase());

  // ── 10. Wrong password ───────────────────────────────────────────
  console.log('\n[Wrong Password]');
  const wrong = await request('POST', '/api/auth/login', {
    email: TEST_USER.email,
    password: 'wrong-password',
  });
  assert('Status 401', wrong.status === 401);
  assert('Generic error', wrong.data.error === 'Invalid email or password');

  // ── 11. Unknown email ────────────────────────────────────────────
  console.log('\n[Unknown Email]');
  const unknown = await request('POST', '/api/auth/login', {
    email: 'nobody@nowhere.edu',
    password: 'anything',
  });
  assert('Status 401', unknown.status === 401);
  assert('Same generic error', unknown.data.error === 'Invalid email or password');

  // ── 12. Missing fields ───────────────────────────────────────────
  console.log('\n[Validation — Missing Fields]');
  const missingReg = await request('POST', '/api/auth/register', { name: '' });
  assert('Register: Status 400', missingReg.status === 400);
  const missingLogin = await request('POST', '/api/auth/login', {});
  assert('Login: Status 400', missingLogin.status === 400);

  // ── 13. Short password ───────────────────────────────────────────
  console.log('\n[Validation — Short Password]');
  const shortPw = await request('POST', '/api/auth/register', {
    ...TEST_USER,
    email: 'short@campus.edu',
    password: '12345',
  });
  assert('Status 400', shortPw.status === 400);

  // ── Results ──────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════');
  console.log(`  ${passed} passed, ${failed} failed`);
  console.log('══════════════════════════════════════\n');

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Test runner failed:', err.message);
  process.exit(1);
});
