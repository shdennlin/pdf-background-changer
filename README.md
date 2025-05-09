# PDF Background Changer

A toolkit to change the background color of PDF files without altering any other content. Useful for updating the background of scanned documents, forms, or any PDF while preserving all text, images, and formatting.

This project provides both a command-line interface (CLI) and a web-based interface.

## Project Structure

This is a monorepo containing:

- `packages/lib` - Shared library with core PDF processing functionality
- `packages/cli` - Command-line interface for batch processing
- `packages/frontend` - Web interface for in-browser PDF processing

## Prerequisites

- [Bun](https://bun.sh/) (version 1.0 or higher recommended)

## Installation

Clone the repository and install dependencies:

```sh
bun install
```

## Command Line Interface

### Usage

Run the CLI with the following parameters:

```sh
bun run start <input.pdf> <output.pdf> <backgroundColor>
```

- **input.pdf**: Path to the source PDF file.
- **output.pdf**: Path for the output PDF with the new background.
- **backgroundColor**: Background color in hex format (e.g., `#B8C7AE`).

### Example

```sh
bun run start fileName.pdf fileName-bg.pdf "#B8C7AE"
```

This command will create `fileName-bg.pdf` with the specified background color.

### Help

Show usage and options:

```sh
bun run start -h
bun run start --help
```

## Web Interface

### Starting the Web Interface

To start the web server:

```sh
bun run dev:frontend
```

The web interface provides a user-friendly way to:
- Upload multiple PDF files
- Choose a background color from presets or a custom color picker
- Process PDFs in your browser (no server upload required)
- Download the modified PDFs with new backgrounds

### Building for Production

To build both CLI and web interface:

```sh
bun run build
```

## Features

- **Privacy-focused**: All PDF processing happens locally, no files are uploaded to any server
- **Bulk processing**: Process multiple files at once via the web interface
- **Color presets**: Quickly choose from popular background colors
- **Preservation**: Only the background color is changed; all PDF content remains intact

## How It Works

The tool uses [`pdf-lib`](https://pdf-lib.js.org/) to:
1. Load the PDF document
2. Add a colored rectangle to each page as the bottom-most layer
3. Save the modified PDF without changing any other content

## Development

### Scripts

- `bun run build:lib` - Build the shared library
- `bun run build:cli` - Build the CLI
- `bun run build:frontend` - Build the web interface
- `bun run build` - Build everything
- `bun run dev:frontend` - Start frontend in development mode

## License

[MIT license](LICENSE)
