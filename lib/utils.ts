import { customAlphabet } from 'nanoid';

/**
 * Generate a URL-safe share token for episode portal links.
 * 32 chars from a 50-char alphabet → ~190 bits of entropy.
 */
const tokenAlphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX';
const generateTokenInternal = customAlphabet(tokenAlphabet, 32);

export function generateShareToken(): string {
  return generateTokenInternal();
}

/**
 * Format seconds as HH:MM:SS (or MM:SS if under an hour).
 */
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/**
 * Build a share URL for the client portal.
 */
export function getShareUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return `${baseUrl}/p/${token}`;
}

/**
 * Calculate expiry date for a share token (30 days by default).
 */
export function getDefaultShareExpiry(): Date {
  const ttlDays = Number(process.env.NEXT_PUBLIC_SHARE_TOKEN_TTL_DAYS ?? 30);
  const d = new Date();
  d.setDate(d.getDate() + ttlDays);
  return d;
}

/**
 * Sort reels by start_time and assign sequential order_num (1-based).
 */
export function assignReelOrder<T extends { start_time_seconds: number }>(
  reels: T[]
): (T & { order_num: number })[] {
  return [...reels]
    .sort((a, b) => a.start_time_seconds - b.start_time_seconds)
    .map((r, i) => ({ ...r, order_num: i + 1 }));
}
