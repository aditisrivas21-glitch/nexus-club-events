// In production set VITE_API_URL (e.g. https://nexus-api.onrender.com). In dev the Vite proxy handles /api.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '') + '/api';
export const TOKEN_KEY = 'nexus_token';

export async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem(TOKEN_KEY);
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Cannot reach the server. Check your connection and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) window.dispatchEvent(new Event('nexus-logout'));
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}
