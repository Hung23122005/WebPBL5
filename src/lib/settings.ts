export const SERVER_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://orchid.huynhthai.xyz";

export function getServerUrl(): string {
  return SERVER_URL;
}
