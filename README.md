# MCP Website Helper

An MCP (Model Context Protocol) server that provides tools for working with websites.

## Features

This MCP server provides the following tools:

- **fetch_website**: Fetch and return the content of a website
- **extract_metadata**: Extract metadata (title, description, Open Graph tags, etc.) from a website
- **check_status**: Check the HTTP status and basic information of a website

## Installation

```bash
npm install
npm run build
```

## Usage

### Running the Server

```bash
npm start
```

Or for development:

```bash
npm run dev
```

### Configuring with Claude Desktop

Add this to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "website-helper": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-website-helper/dist/index.js"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "website-helper": {
      "command": "mcp-website-helper"
    }
  }
}
```

## Tools

### fetch_website

Fetches the complete HTML content of a website.

**Parameters:**
- `url` (string): The URL of the website to fetch

**Example:**
```json
{
  "url": "https://example.com"
}
```

### extract_metadata

Extracts metadata from a website including title, description, Open Graph tags, and more.

**Parameters:**
- `url` (string): The URL of the website to analyze

**Returns:**
- `title`: Page title
- `description`: Meta description
- `ogTitle`: Open Graph title
- `ogDescription`: Open Graph description
- `ogImage`: Open Graph image
- `keywords`: Meta keywords
- `author`: Page author
- `canonical`: Canonical URL

**Example:**
```json
{
  "url": "https://example.com"
}
```

### check_status

Checks the HTTP status and response information for a website.

**Parameters:**
- `url` (string): The URL of the website to check

**Returns:**
- `statusCode`: HTTP status code
- `statusText`: HTTP status text
- `responseTime`: Time taken to respond
- `contentType`: Content-Type header
- `server`: Server header
- `lastModified`: Last-Modified header

**Example:**
```json
{
  "url": "https://example.com"
}
```

## Development

Build the project:
```bash
npm run build
```

Run in development mode:
```bash
npm run dev
```

## License

ISC