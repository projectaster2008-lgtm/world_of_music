/**
 * Clint & Maica's Personal Photo Memories Collection
 * 39 high-resolution images stored on Google Drive.
 * Served directly via high-speed, CORS-friendly Google CDN endpoint.
 */

export interface DriveMemoryPhoto {
  id: string;
  driveFileId: string;
  imageUrl: string;
  thumbnailUrl: string;
  label?: string;
}

export const DRIVE_FILE_IDS: string[] = [
  '17OZuhFtTgWzZ7ISpXgiMbEEb-G4Fygfo',
  '1aKH4a8_k4BNH0S4936RhHiBJOBDnZMmH',
  '1Vb7v67Cg_MKikNX6El5nUZs-95d4T1oW',
  '1Na4jOwBrd-HCZnG7jhvSEbkdJhFLvR-V',
  '1XZUnyBcE7bznrPCFtHYLn4-90n3x9P11',
  '1OSvnthmqrczuAFJmb1AFzc_E-JI8VHEY',
  '1wC9T6ha5ybfK-KfHWHsqSpkbNh4Pj4bg',
  '1t8ueud7Yf8gKO74jE1JGl9f9iz71e2dp',
  '1sQWYDLQrLAuixAsneUONvJyu7RhhBwIg',
  '16XDns3DGZWOq0MXJKNIrvQa7QXMbQsuy',
  '1UCk5VEDNkVplKFMS5ENkjjTQU5PiDAye',
  '1KVoUvIVNBONYIXqHgb_5elq2P5y-br7i',
  '1G0Zf5Oo-1nGTaqq2mk1AuzacDHgRhXeO',
  '1AL2moEzDdiq9copDDKmTs2t9oYH92PuZ',
  '11MvgDj4bivz2nHLZTT6HaEk0TYTNjWG_',
  '1wswHlReQ7X-2DW1yKRG-NjqzPWg3p1eq',
  '1Twl4-NPLQ845GwwcakEtMVNuSJxZozuv',
  '1K_H3ItoqSis2dV7-tDHYFdUKaIaU6OyL',
  '15PY1oiQOZCsj_ji0NlC17FYEZ9Wvy_27',
  '1j1lRJRHhCTGe2F1z0rYGF96H-_7FmA2M',
  '1jehmZJD-ZLvCNuFxf1L1hV6yf-7PbeA8',
  '1zHdV2uQzfbb1v64Qby0VRMkpQdZHxgsq',
  '1UdJgaGOlRzyw3oRccvOs3xy3dCSCJY8M',
  '1vKLad_BoPdOCs7buS7KFnOyrCD3NCg1S',
  '1vdbwPFCjfntbBIsXFMQ4VLwFaQCvP3eu',
  '1cg7CFRhJlCJY1C9csPoBGQji2BnMTneX',
  '15qa2PyIanE-c680IdCDo0fUKwjgd7fBT',
  '1zeWGd2nnTeaUjy1KB0h6nLLYlDCS6MqS',
  '10sP1Qmc6TqUbS2R3KLmBU8m6IZaep0Tf',
  '1qtyzGh5LP7YJOiKnPYk8bYID8jbtQqol',
  '1Lc9dOj5EKzFjtO1Yf0vUf0QEFC_9BkY0',
  '17CmnfpTyf37daQGpTJx5egsOWNBoxuYs',
  '1NFvjCnB-JQut88nD7gKe5tdyvMcYXbY3',
  '1VepSI-NLip_Db2N0jEfD2NXfmlx3HJ-v',
  '1Bbekg6FM5PyNt_-1aCJ2J_Ph5KSUGgin',
  '1qKOrj36KRWqABxRg6dPKPY2UuNMvp_Ap',
  '1JgJLs_uhaLIFKaJ6GekkWc07Xx4PzQR9',
  '1EKEf6YEKzvKjtAo6gnM-olEMTeaYMWZS',
  '1n_X73GgRwepXtp03alZD3Zrg8GxvJ3RG',
];

/**
 * Generates direct Google CDN URLs from Drive File IDs.
 * Direct content URL: https://lh3.googleusercontent.com/d/{fileId}
 * Fallback preview URL: https://drive.google.com/thumbnail?id={fileId}&sz=w1920
 */
export function getDriveDirectUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

export function getDriveThumbnailUrl(fileId: string, width = 1920): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
}

export const MEMORY_PHOTOS: DriveMemoryPhoto[] = DRIVE_FILE_IDS.map((driveFileId, index) => ({
  id: `memory-${index + 1}`,
  driveFileId,
  imageUrl: getDriveDirectUrl(driveFileId),
  thumbnailUrl: getDriveThumbnailUrl(driveFileId),
  label: `Memory #${index + 1}`,
}));

/**
 * Returns a random photo from the collection, avoiding picking the same one consecutively.
 */
export function getRandomMemoryPhoto(currentPhotoId?: string): DriveMemoryPhoto {
  const filtered = currentPhotoId
    ? MEMORY_PHOTOS.filter((p) => p.id !== currentPhotoId)
    : MEMORY_PHOTOS;
  const pool = filtered.length > 0 ? filtered : MEMORY_PHOTOS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
