/**
 * Centralized API client.
 * In dev mode, Vite proxies /api/* to the Express backend.
 * In production, set VITE_API_URL to the backend origin.
 */
const BASE = import.meta.env.VITE_API_URL ?? '';

interface ApiOptions extends RequestInit {
  json?: unknown;
}

class ApiError extends Error {
  status: number;
  data: Record<string, unknown>;

  constructor(status: number, data: Record<string, unknown>) {
    super((data.error as string) || `Request failed (${status})`);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  const { json, headers: extraHeaders, ...rest } = opts;

  const headers: Record<string, string> = {
    ...(extraHeaders as Record<string, string>),
  };

  let body = rest.body;
  if (json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(json);
  }

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers,
    body,
    credentials: 'include', // send HttpOnly cookies
  });

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }

  return data as T;
}

// ── Auth API ───────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  campusId: string;
}

interface RawAuthResponse {
  user: { id: string; name: string; email: string; campus_id: string };
}

interface AuthResponse {
  user: AuthUser;
}

/** Map snake_case DB fields to camelCase frontend fields */
function mapUser(raw: RawAuthResponse): AuthResponse {
  return {
    user: {
      id: raw.user.id,
      name: raw.user.name,
      email: raw.user.email,
      campusId: raw.user.campus_id,
    },
  };
}

export const authApi = {
  async register(data: { name: string; email: string; password: string; campus_id: string }) {
    const raw = await request<RawAuthResponse>('/api/auth/register', {
      method: 'POST',
      json: data,
    });
    return mapUser(raw);
  },

  async login(data: { email: string; password: string }) {
    const raw = await request<RawAuthResponse>('/api/auth/login', {
      method: 'POST',
      json: data,
    });
    return mapUser(raw);
  },

  logout() {
    return request('/api/auth/logout', { method: 'POST' });
  },

  async me() {
    const raw = await request<RawAuthResponse>('/api/auth/me');
    return mapUser(raw);
  },
};

export { ApiError };
export default request;
