// Ưu tiên env var, fallback về localhost
export const SERVER_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function getServerUrl(): string {
  return SERVER_URL;
}
