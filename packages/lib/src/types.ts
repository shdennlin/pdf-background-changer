/**
 * Type definitions for the PDF Background Changer library
 */

/**
 * RGB color values in 0-255 range
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * RGB color values in 0-1 range (for PDF-lib)
 */
export interface NormalizedRGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * PDF Processing options
 */
export interface PDFProcessingOptions {
  colorHex: string;
  blendMode?: string;
  opacity?: number;
}

/**
 * Progress callback function type
 */
export type ProgressCallback = (current: number, total: number, filename?: string) => void;