/**
 * Image URL utility functions
 * TODO: Update IMAGE_BASE_URL to your image hosting service (e.g., Railway, Cloudflare, etc.)
 */

// TODO: Replace with your image hosting service base URL
// This can be an environment variable like: process.env.NEXT_PUBLIC_IMAGE_BASE_URL
const IMAGE_BASE_URL = '/images'; // Default to local images for now

/**
 * Get the full URL for an image
 * @param imagePath - The path to the image (relative to base URL)
 * @returns Full URL to the image
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return '/placeholder.png'; // Fallback image
  }
  
  // If imagePath is already a full URL, return it as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, construct URL from base URL
  const baseUrl = IMAGE_BASE_URL.endsWith('/') ? IMAGE_BASE_URL.slice(0, -1) : IMAGE_BASE_URL;
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${path}`;
}

/**
 * Get the full URL for the logo
 */
export function getLogoUrl(): string {
  return getImageUrl('logo1.png');
}

