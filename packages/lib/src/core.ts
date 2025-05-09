/**
 * Core PDF functionality for PDF Background Changer
 */

import { PDFDocument, rgb, BlendMode } from 'pdf-lib';
import type { PDFProcessingOptions, ProgressCallback } from './types.js';
import { hexToNormalizedRgb } from './color-utils.js';
import { DEFAULT_BLEND_MODE } from './constants.js';

/**
 * Change the background color of a PDF document
 * 
 * @param pdfBytes - The binary data of the PDF file
 * @param options - PDF processing options
 * @returns Promise with the modified PDF binary data
 */
export async function changePdfBackgroundColor(
  pdfBytes: Uint8Array, 
  options: PDFProcessingOptions
): Promise<Uint8Array> {
  // Load the PDF document
  const pdfDoc = await PDFDocument.load(pdfBytes);
  
  // Get all pages
  const pages = pdfDoc.getPages();
  
  // Get RGB color from hex
  const rgbColor = hexToNormalizedRgb(options.colorHex);
  
  // Set blend mode
  const blendMode = options.blendMode 
    ? getBlendModeFromString(options.blendMode) 
    : BlendMode.Multiply;
  
  // Set opacity
  const opacity = options.opacity !== undefined ? options.opacity : 1;
  
  // Apply background color to each page
  for (const page of pages) {
    const { width, height } = page.getSize();
    
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
      opacity,
      blendMode,
    });
  }
  
  // Save the modified PDF
  return await pdfDoc.save();
}

/**
 * Process a PDF file from disk, change its background color, and save it
 * 
 * @param inputBytes - The input PDF file bytes
 * @param options - PDF processing options
 * @param progressCallback - Optional callback for progress reporting
 * @returns Promise with the modified PDF binary data
 */
export async function processPdfWithProgress(
  inputBytes: Uint8Array,
  options: PDFProcessingOptions,
  progressCallback?: ProgressCallback
): Promise<Uint8Array> {
  try {
    // Report start progress
    if (progressCallback) {
      progressCallback(0, 100);
    }
    
    // Process the PDF
    const modifiedPdfBytes = await changePdfBackgroundColor(inputBytes, options);
    
    // Report completion
    if (progressCallback) {
      progressCallback(100, 100);
    }
    
    return modifiedPdfBytes;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
}

/**
 * Convert string blend mode to pdf-lib BlendMode enum
 * 
 * @param blendModeStr - Blend mode as string
 * @returns BlendMode enum value
 */
function getBlendModeFromString(blendModeStr: string): BlendMode {
  const blendModeMap: Record<string, BlendMode> = {
    'Normal': BlendMode.Normal,
    'Multiply': BlendMode.Multiply,
    'Screen': BlendMode.Screen,
    'Overlay': BlendMode.Overlay,
    'Darken': BlendMode.Darken,
    'Lighten': BlendMode.Lighten,
    'ColorDodge': BlendMode.ColorDodge,
    'ColorBurn': BlendMode.ColorBurn,
    'HardLight': BlendMode.HardLight,
    'SoftLight': BlendMode.SoftLight,
    'Difference': BlendMode.Difference,
    'Exclusion': BlendMode.Exclusion
  };
  
  return blendModeMap[blendModeStr] || BlendMode.Multiply;
}