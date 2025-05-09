/**
 * PDF Background Changer CLI tool
 */
import { readFileSync, writeFileSync } from "fs";
import type { PDFProcessingOptions } from "../../lib/src/index.ts";
import {
  processPdfWithProgress,
  APP_NAME,
  APP_VERSION
} from "../../lib/src/index.ts";

/**
 * Process a PDF file from the filesystem
 */
async function changePdfBackground(inputPath: string, outputPath: string, colorHex: string) {
  // Read the input file
  const pdfBytes = readFileSync(inputPath);
  
  // Process the PDF with our shared library
  const options: PDFProcessingOptions = {
    colorHex: colorHex
  };
  
  const modifiedPdf = await processPdfWithProgress(pdfBytes, options);
  
  // Write the output file
  writeFileSync(outputPath, modifiedPdf);
}

/**
 * CLI usage:
 *   bun run main.ts <input.pdf> <output.pdf> <backgroundColor>
 * Example:
 *   bun run main.ts input.pdf output.pdf "#B8C7AE"
 */

/**
 * Print help information and exit
 */
function printHelpAndExit() {
  console.log(`${APP_NAME} ${APP_VERSION}

Usage: bun run main.ts <input.pdf> <output.pdf> <backgroundColor>
Example:
  bun run main.ts input.pdf output.pdf "#B8C7AE"

Parameters:
  <input.pdf>         Path to the input PDF file
  <output.pdf>        Path to the output PDF file
  <backgroundColor>   Background color in hex format (e.g., "#B8C7AE")

Flags:
  -h, --help          Show this help message and exit
  -v, --version       Show version information and exit
`);
  process.exit(0);
}

if (require.main === module) {
  if (process.argv.includes("-h") || process.argv.includes("--help")) {
    printHelpAndExit();
  }
  if (process.argv.includes("-v") || process.argv.includes("--version")) {
    console.log(APP_VERSION);
    process.exit(0);
  }
  const [,, inputPath, outputPath, colorHex] = process.argv;
  if (!inputPath || !outputPath || !colorHex) {
    console.error("Usage: bun run main.ts <input.pdf> <output.pdf> <backgroundColor>");
    process.exit(1);
  }
  changePdfBackground(inputPath, outputPath, colorHex)
    .then(() => console.log("✅ Background updated"))
    .catch(err => {
      console.error("❌ Error:", err.message);
      process.exit(1);
    });
}