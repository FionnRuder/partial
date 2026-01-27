import { describe, it, expect } from 'vitest';
import { getImageUrl, getLogoUrl } from '../imageUtils';

describe('getImageUrl', () => {
  it('should return placeholder for null or undefined', () => {
    expect(getImageUrl(null)).toBe('/placeholder.png');
    expect(getImageUrl(undefined)).toBe('/placeholder.png');
  });

  it('should return full URL as-is if it starts with http:// or https://', () => {
    expect(getImageUrl('https://example.com/image.png')).toBe(
      'https://example.com/image.png'
    );
    expect(getImageUrl('http://example.com/image.png')).toBe(
      'http://example.com/image.png'
    );
  });

  it('should construct URL from base URL for relative paths', () => {
    const result = getImageUrl('logo.png');
    expect(result).toContain('/images');
    expect(result).toContain('logo.png');
  });

  it('should handle paths that already start with /', () => {
    const result = getImageUrl('/logo.png');
    expect(result).toContain('/images');
    expect(result).toContain('/logo.png');
  });
});

describe('getLogoUrl', () => {
  it('should return logo URL', () => {
    const result = getLogoUrl();
    expect(result).toContain('logo1.png');
  });
});
