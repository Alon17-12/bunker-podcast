/**
 * Bunny Stream API wrapper.
 * Server-side only — uses the API key.
 *
 * Bunny Stream API reference:
 * https://docs.bunny.net/reference/video_list
 */

const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID;
const API_KEY = process.env.BUNNY_API_KEY;

const STREAM_API = 'https://video.bunnycdn.com/library';

function headers() {
  if (!API_KEY) throw new Error('BUNNY_API_KEY missing');
  return {
    AccessKey: API_KEY,
    'Content-Type': 'application/json',
    accept: 'application/json',
  };
}

export type BunnyVideo = {
  guid: string;
  title: string;
  length: number;          // seconds
  status: number;          // 0=Queued, 1=Processing, 2=Encoding, 3=Finished, 4=Resolution finished, 5=Failed
  thumbnailFileName: string;
  storageSize: number;
  width: number;
  height: number;
  framerate: number;
  dateUploaded: string;
};

export async function getVideo(videoId: string): Promise<BunnyVideo> {
  if (!LIBRARY_ID) throw new Error('BUNNY_LIBRARY_ID missing');
  const res = await fetch(`${STREAM_API}/${LIBRARY_ID}/videos/${videoId}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`Bunny API error: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function createVideo(title: string): Promise<{ guid: string }> {
  if (!LIBRARY_ID) throw new Error('BUNNY_LIBRARY_ID missing');
  const res = await fetch(`${STREAM_API}/${LIBRARY_ID}/videos`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error(`Bunny API error: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function deleteVideo(videoId: string): Promise<void> {
  if (!LIBRARY_ID) throw new Error('BUNNY_LIBRARY_ID missing');
  const res = await fetch(`${STREAM_API}/${LIBRARY_ID}/videos/${videoId}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok) throw new Error(`Bunny API error: ${res.status}`);
}

/**
 * Get TUS upload metadata for client-side resumable uploads.
 * Returns the AuthorizationSignature + expiration time required to upload via TUS.
 */
export function getTusUploadSignature(videoId: string, expiresAt: number) {
  const securityKey = process.env.BUNNY_SECURITY_KEY;
  if (!LIBRARY_ID || !securityKey) {
    throw new Error('BUNNY_LIBRARY_ID and BUNNY_SECURITY_KEY required');
  }
  const crypto = require('crypto');
  const signature = crypto
    .createHash('sha256')
    .update(`${LIBRARY_ID}${securityKey}${expiresAt}${videoId}`)
    .digest('hex');
  return {
    libraryId: LIBRARY_ID,
    videoId,
    signature,
    expiresAt,
    endpoint: 'https://video.bunnycdn.com/tusupload',
  };
}
