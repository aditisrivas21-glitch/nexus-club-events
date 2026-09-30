const BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "") + "/api";

export const TOKEN_KEY = "nexus_token";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const token = localStorage.getItem(TOKEN_KEY);

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // GET requests are safe to retry if Render is waking up.
  // POST/PUT/DELETE are attempted only once to avoid duplicate actions.
  const maxAttempts = method === "GET" ? 5 : 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let res;

    try {
      res = await fetch(BASE + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      if (attempt < maxAttempts) {
        await sleep(attempt * 2000);
        continue;
      }

      throw new Error(
        "Cannot reach the server. Please wait a moment and try again.",
      );
    }

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return data;
    }

    // Render may return a temporary 5xx while waking up.
    if (res.status >= 500 && attempt < maxAttempts) {
      await sleep(attempt * 2000);
      continue;
    }

    if (res.status === 401 && auth) {
      window.dispatchEvent(new Event("nexus-logout"));
    }

    throw new Error(data.message || `Request failed (${res.status})`);
  }

  throw new Error("Cannot reach the server. Please try again.");
}
