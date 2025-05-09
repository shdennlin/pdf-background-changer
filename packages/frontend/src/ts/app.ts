/**
 * PDF Background Changer - Frontend Application
 */

// Define the pdf-lib types for the global PDFLib object loaded from CDN
declare const PDFLib: {
  PDFDocument: {
    load: (data: Uint8Array) => Promise<any>;
  };
  rgb: (r: number, g: number, b: number) => any;
  BlendMode: {
    Normal: string;
    Multiply: string;
    Screen: string;
    Overlay: string;
    Darken: string;
    Lighten: string;
    ColorDodge: string;
    ColorBurn: string;
    HardLight: string;
    SoftLight: string;
    Difference: string;
    Exclusion: string;
  };
};

import type { NormalizedRGBColor } from "@pdf-background-changer/lib";
import { COLOR_PRESETS, DEFAULT_BACKGROUND_COLOR } from "@pdf-background-changer/lib";

// DOM Elements
let form: HTMLFormElement;
let statusDiv: HTMLElement;
let progressContainer: HTMLElement;
let totalProgress: HTMLElement;
let fileStatusList: HTMLElement;
let fileInput: HTMLInputElement;
let colorInput: HTMLInputElement;
let selectedFilesDiv: HTMLElement;
let filesList: HTMLElement;
let allFiles: File[] = []; // Store all selected files

/**
 * Initialize the application once the DOM is loaded
 */
function initApp() {
  // Initialize DOM references
  form = document.getElementById('pdfForm') as HTMLFormElement;
  statusDiv = document.getElementById('status') as HTMLElement;
  progressContainer = document.getElementById('progressContainer') as HTMLElement;
  totalProgress = document.getElementById('totalProgress') as HTMLElement;
  fileStatusList = document.getElementById('fileStatusList') as HTMLElement;
  fileInput = document.getElementById('inputPdf') as HTMLInputElement;
  colorInput = document.getElementById('bgColor') as HTMLInputElement;
  selectedFilesDiv = document.getElementById('selectedFiles') as HTMLElement;
  filesList = document.getElementById('filesList') as HTMLElement;
  
  // Set default color from constants
  colorInput.value = DEFAULT_BACKGROUND_COLOR;
  
  // Initialize event listeners
  initializeEventListeners();
  initializeColorPresets();
}

/**
 * Set up event listeners
 */
function initializeEventListeners() {
  // Form submission
  form.addEventListener('submit', handleFormSubmit);
  
  // File input change
  fileInput.addEventListener('change', handleFileInputChange);
}

/**
 * Initialize color presets from constants
 */
function initializeColorPresets() {
  const presetBtns = document.querySelectorAll('.preset-btn');
  
  // Handle color preset buttons
  presetBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const hex = (btn as HTMLElement).getAttribute('data-hex') || DEFAULT_BACKGROUND_COLOR;
      colorInput.value = hex;
      colorInput.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e: Event) {
  e.preventDefault();
  statusDiv.innerHTML = '';
  const files = fileInput.files;
  
  if (!files || files.length === 0) {
    statusDiv.innerHTML = '<div class="alert alert-danger">Please select at least one PDF file.</div>';
    return;
  }
  
  // Show progress container
  progressContainer.classList.remove('d-none');
  fileStatusList.innerHTML = '';
  
  // Create status elements for each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileItem = document.createElement('div');
    fileItem.className = 'mb-1';
    fileItem.innerHTML = `
      <span class="font-semibold">${file.name}</span>
      <span id="status-${i}" class="badge bg-secondary ms-2">Waiting</span>
    `;
    fileStatusList.appendChild(fileItem);
  }
  
  let completedCount = 0;
  const hexColor = colorInput.value;
  
  // Process each file
  for (let i = 0; i < files.length; i++) {
    await processFile(files[i], i, hexColor);
    
    // Update progress
    completedCount++;
    const progressPercentage = Math.round((completedCount / files.length) * 100);
    totalProgress.style.width = progressPercentage + '%';
    totalProgress.setAttribute('aria-valuenow', progressPercentage.toString());
  }
  
  // Show final status message
  if (completedCount === files.length) {
    statusDiv.innerHTML = `<div class="alert alert-success">All ${files.length} PDFs processed! Downloads should begin automatically.</div>`;
  } else {
    statusDiv.innerHTML = `<div class="alert alert-warning">Processed ${completedCount} out of ${files.length} PDFs. Check console for errors.</div>`;
  }
}

/**
 * Process a single PDF file
 */
async function processFile(file: File, index: number, hexColor: string): Promise<void> {
  const statusBadge = document.getElementById(`status-${index}`) as HTMLElement;
  statusBadge.className = 'badge bg-primary ms-2';
  statusBadge.textContent = 'Processing';
  
  try {
    // Read the file
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Load the PDF
    const pdfDoc = await PDFLib.PDFDocument.load(uint8Array);
    const pages = pdfDoc.getPages();
    
    const rgb = hexToRgb01(hexColor);
    
    // Apply background to each page
    for (const page of pages) {
      const { width, height } = page.getSize();
      const rectOptions = {
        x: 0,
        y: 0,
        width,
        height,
        color: PDFLib.rgb(rgb.r, rgb.g, rgb.b),
        opacity: 1,
        borderWidth: 0,
        // Draw below all content
        blendMode: PDFLib.BlendMode.Multiply,
      };
      page.drawRectangle(rectOptions);
    }
    
    // Save and download the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, '') + '-bg.pdf';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    
    statusBadge.className = 'badge bg-success ms-2';
    statusBadge.textContent = 'Completed';
  } catch (err) {
    statusBadge.className = 'badge bg-danger ms-2';
    statusBadge.textContent = 'Failed';
    console.error(`Error processing ${file.name}:`, err);
  }
}

/**
 * Handle file input change
 */
function handleFileInputChange() {
  const files = fileInput.files;
  
  if (files && files.length > 0) {
    selectedFilesDiv.classList.remove('d-none');
    
    // Append new files to the existing list
    Array.from(files).forEach(file => {
      if (!allFiles.some(f => f.name === file.name && f.size === file.size)) {
        allFiles.push(file);
      }
    });
    
    // Update the file input with all files
    updateFileInput();
    
    // Refresh the displayed list
    refreshFileList();
  } else {
    selectedFilesDiv.classList.add('d-none');
  }
}

/**
 * Update the file input with the current list of files
 */
function updateFileInput() {
  const dataTransfer = new DataTransfer();
  allFiles.forEach(file => dataTransfer.items.add(file));
  fileInput.files = dataTransfer.files;
}

/**
 * Refresh the displayed list of files
 */
function refreshFileList() {
  filesList.innerHTML = '';
  
  if (allFiles.length > 0) {
    allFiles.forEach((file, index) => {
      const fileSize = formatFileSize(file.size);
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
      listItem.innerHTML = `
        <div>
          <span class="badge bg-primary rounded-pill me-2">${index + 1}</span>
          ${file.name}
        </div>
        <div>
          <span class="badge bg-secondary me-2">${fileSize}</span>
          <button type="button" class="btn btn-danger btn-sm delete-btn" data-index="${index}">Delete</button>
        </div>
      `;
      filesList.appendChild(listItem);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', handleDeleteFile);
    });
  } else {
    selectedFilesDiv.classList.add('d-none');
  }
}

/**
 * Handle file deletion
 */
function handleDeleteFile(e: Event) {
  const button = e.target as HTMLElement;
  const index = parseInt(button.getAttribute('data-index') || '-1', 10);
  
  if (index >= 0 && index < allFiles.length) {
    allFiles.splice(index, 1);
    updateFileInput();
    refreshFileList();
  }
}

/**
 * Read file as ArrayBuffer
 */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => resolve(ev.target?.result as ArrayBuffer);
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Convert hex color to RGB values in 0-1 range for PDF-lib
 */
function hexToRgb01(hex: string): NormalizedRGBColor {
  // Convert #RRGGBB to {r,g,b} in [0,1]
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255
  };
}

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);