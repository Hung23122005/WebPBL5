const SERVER_URL_KEY = "orchid_server_url";
const DEFAULT_URL = "http://127.0.0.1:8000";

export function getServerUrl(): string {
  if (typeof window === "undefined") return DEFAULT_URL;
  return localStorage.getItem(SERVER_URL_KEY) || DEFAULT_URL;
}

export function saveServerUrl(url: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SERVER_URL_KEY, url.trim().replace(/\/$/, ""));
}

export function resetServerUrl() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SERVER_URL_KEY);
}
