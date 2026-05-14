/**
 * Generate signed Bunny Stream URLs that expire.
 * Used for client portal video access — token-based, time-limited.
 *
 * Bunny security signing reference:
 * https://docs.bunny.net/docs/stream-token-authentication
 */
import { createHash } from 'crypto';

const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;
const SECURITY_KEY = process.env.BUNNY_SECURITY_KEY;

function requireEnv() {
  if (!LIBRARY_ID || !SECURITY_KEY) {
    throw new Error(
      'BUNNY_LIBRARY_ID and BUNNY_SECURITY_KEY must be set in environment variables.'
    );
  }
  return { libraryId: LIBRARY_ID, securityKey: SECURITY_KEY };
}

/**
 * Generate a signed embed URL for the Bunny iframe player.
 *
 * @param videoId   Bunny video GUID
 * @param expiresInSeconds  How long the URL is valid (default: 1 hour)
 * @returns Full embed URL with token + expires query params
 */
export function getSignedEmbedUrl(
  videoId: string,
  expiresInSeconds: number = 3600
): string {
  const { libraryId, securityKey } = requireEnv();
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const hash = createHash('sha256')
    .update(securityKey + videoId + expires)
    .digest('hex');

  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${hash}&expires=${expires}`;
}

/**
 * Generate a signed direct video URL (for custom players via HLS/MP4).
 * Use when you need the raw stream URL, not the iframe embed.
 *
 * @param videoId   Bunny video GUID
 * @param path      Path within the video (e.g., 'playlist.m3u8' or 'play_720p.mp4')
 * @param expiresInSeconds  How long the URL is valid
 */
export function getSignedDirectUrl(
  videoId: string,
  path: string,
  expiresInSeconds: number = 3600
): string {
  const cdnHostname = process.env.BUNNY_CDN_HOSTNAME;
  const { securityKey } = requireEnv();
  if (!cdnHostname) {
    throw new Error('BUNNY_CDN_HOSTNAME must be set for direct URLs.');
  }
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const urlPath = `/${videoId}/${path}`;
  const hash = createHash('sha256')
    .update(securityKey + urlPath + expires)
    .digest('hex');

  return `https://${cdnHostname}${urlPath}?token=${hash}&expires=${expires}`;
}
