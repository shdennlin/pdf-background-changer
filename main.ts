// convert-pdf-bg.ts
import { readFileSync, writeFileSync } from "fs";
import { PDFDocument, rgb, BlendMode } from "pdf-lib";

// Convert hex to rgb
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const bigint = parseInt(hex.replace("#", ""), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

async function changePdfBackground(inputPath: string, outputPath: string, colorHex: string) {
  const pdfBytes = readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const { r, g, b } = hexToRgb(colorHex);

  for (const page of pages) {
    const { width, height } = page.getSize();
    page.drawRectangle({
      x: 0,
      y: 0,
      width,
      height,
      color: rgb(r / 255, g / 255, b / 255),
      blendMode: BlendMode.Multiply,
    });
  }

  const modifiedPdf = await pdfDoc.save();
  writeFileSync(outputPath, modifiedPdf);
}

/**
 * CLI usage:
 *   bun run main.ts <input.pdf> <output.pdf> <backgroundColor>
 * Example:
 *   bun run main.ts input.pdf output.pdf "#B8C7AE"
 */

function printHelpAndExit() {
  console.log(`PDF Background Changer version 1.0.0

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
    console.log("v1.0.0");
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