import axios, { type AxiosResponse } from 'axios';
import { auth } from './firebase';

/**
 * Resolves API base URL.
 * - Honors `VITE_API_URL`; appends `/api` if you only pass the host (e.g. http://localhost:3001).
 * - In Vite dev, defaults to same-origin `/api` so the dev proxy can reach the Express server.
 */
function resolveApiBaseUrl(): string {
  const env = import.meta.env.VITE_API_URL?.trim();
  if (env) {
    const base = env.replace(/\/$/, '');
    return base.endsWith('/api') ? base : `${base}/api`;
  }
  if (import.meta.env.DEV) return '/api';
  return 'https://volunteer-backend-hpo8.onrender.com';
}

export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

/** Normalizes list payloads whether or not the response interceptor has run. */
export function getResponseList<T = unknown>(response: AxiosResponse): T[] {
  const d = response.data as unknown;
  if (Array.isArray(d)) return d as T[];
  if (d && typeof d === 'object' && Array.isArray((d as { data?: unknown }).data)) {
    return (d as { data: T[] }).data;
  }
  return [];
}

api.interceptors.request.use(async (config) => {
  if (typeof auth.authStateReady === 'function') {
    await auth.authStateReady();
  }
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      console.warn('[api] Failed to get ID token', e);
    }
  }
  return config;
});

/** Lets both `response.data` and `response.data.data` work after `{ success, data }` envelopes. */
function attachDataAlias(inner: unknown) {
  if (Array.isArray(inner)) {
    const arr = inner.slice();
    Object.defineProperty(arr, 'data', {
      value: arr,
      enumerable: false,
      configurable: true,
    });
    return arr;
  }
  if (inner !== null && typeof inner === 'object') {
    const obj = { ...(inner as Record<string, unknown>) };
    Object.defineProperty(obj, 'data', {
      value: inner,
      enumerable: false,
      configurable: true,
    });
    return obj;
  }
  return inner;
}

api.interceptors.response.use((response) => {
  const payload = response.data;
  if (
    payload &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    (payload as { success?: boolean }).success === true &&
    'data' in payload
  ) {
    const inner = (payload as { data: unknown }).data;
    response.data = attachDataAlias(inner) as typeof response.data;
  }
  return response;
});
