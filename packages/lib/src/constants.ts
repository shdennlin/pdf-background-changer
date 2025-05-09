/**
 * Shared constants for PDF Background Changer
 */

/**
 * Default background color for PDFs
 */
export const DEFAULT_BACKGROUND_COLOR = '#B8C7AE';

/**
 * Available color presets with descriptions
 */
export const COLOR_PRESETS = [
  {
    name: 'Soft Warm White',
    hex: '#F5F5DC',
    rgb: '245, 245, 220',
    description: 'Like aged paper, good for daylight'
  },
  {
    name: 'Light Beige',
    hex: '#FAF3E0',
    rgb: '250, 243, 224',
    description: 'Gentle tone, Kindle-like feeling'
  },
  {
    name: 'Light Gray',
    hex: '#ECECEC',
    rgb: '236, 236, 236',
    description: 'Clean, neutral, low contrast'
  },
  {
    name: 'Sepia',
    hex: '#F4ECD8',
    rgb: '244, 236, 216',
    description: 'Warm, relaxing — popular in eBook readers'
  },
  {
    name: 'Dark Gray (Dark Mode)',
    hex: '#2E2E2E',
    rgb: '46, 46, 46',
    description: 'Great for night reading with light text'
  },
  {
    name: 'True Black',
    hex: '#000000',
    rgb: '0, 0, 0',
    description: 'Best for OLED screens to save battery (with white text)'
  },
  {
    name: 'Sage Green',
    hex: '#B8C7AE',
    rgb: '184, 199, 174',
    description: 'Soft, muted sage green'
  }
];

/**
 * Application version
 */
export const APP_VERSION = 'v1.0.0';

/**
 * Application name
 */
export const APP_NAME = 'PDF Background Changer';

/**
 * Default blend mode for PDF changes
 */
export const DEFAULT_BLEND_MODE = 'Multiply';