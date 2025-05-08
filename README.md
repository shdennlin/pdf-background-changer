# PDF Background Changer

A CLI tool to change the background color of a PDF file **without altering any other content**. Useful for updating the background of scanned documents, forms, or any PDF while preserving all text, images, and formatting.

## Prerequisites

- [Bun](https://bun.sh/) (version 1.0 or higher recommended)

## Installation

Clone the repository and install dependencies:

```sh
bun install
```

## Usage

Run the CLI with the following parameters:

```sh
bun run main.ts <input.pdf> <output.pdf> <backgroundColor>
```

- **input.pdf**: Path to the source PDF file.
- **output.pdf**: Path for the output PDF with the new background.
- **backgroundColor**: Background color in hex format (e.g., `#B8C7AE`).

### Example

```sh
bun run main.ts fileName.pdf fileName-bg.pdf "#B8C7AE"
```

This command will create `fileName-bg.pdf` with the specified background color.

### Help

Show usage and options:

```sh
bun run main.ts -h
bun run main.ts --help
```

## Notes

- Only the background color is changed; all other content remains untouched.
- The tool uses [`pdf-lib`](https://pdf-lib.js.org/) for PDF manipulation.
