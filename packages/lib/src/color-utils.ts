/**
 * Color utility functions for PDF Background Changer
 */

import type { RGBColor, NormalizedRGBColor } from './types.js';

/**
 * Convert hex color string to RGB values (0-255 range)
 * 
 * @param hex - Color in hex format (e.g., "#B8C7AE")
 * @returns RGB color values in 0-255 range
 */
export function hexToRgb(hex: string): RGBColor {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Handle shorthand hex (e.g., #FFF)
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split('').map(x => x + x).join('');
  }
  
  const bigint = parseInt(fullHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return { r, g, b };
}

/**
 * Convert hex color string to normalized RGB values (0-1 range) for PDF-lib
 * 
 * @param hex - Color in hex format (e.g., "#B8C7AE")
 * @returns RGB color values in 0-1 range
 */
export function hexToNormalizedRgb(hex: string): NormalizedRGBColor {
  const { r, g, b } = hexToRgb(hex);
  return {
    r: r / 255,
    g: g / 255,
    b: b / 255
  };
}

/**
 * Convert RGB values to hex color string
 * 
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns Color in hex format (e.g., "#B8C7AE")
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}