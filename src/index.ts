#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import { z } from "zod";

// Tool input schemas
const FetchWebsiteSchema = z.object({
  url: z.string().url(),
});

const ExtractMetadataSchema = z.object({
  url: z.string().url(),
});

const CheckStatusSchema = z.object({
  url: z.string().url(),
});

// MCP Server implementation
class WebsiteHelperServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "mcp-website-helper",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        {
          name: "fetch_website",
          description: "Fetch and return the content of a website",
          inputSchema: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description: "The URL of the website to fetch",
              },
            },
            required: ["url"],
          },
        },
        {
          name: "extract_metadata",
          description: "Extract metadata (title, description, etc.) from a website",
          inputSchema: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description: "The URL of the website to analyze",
              },
            },
            required: ["url"],
          },
        },
        {
          name: "check_status",
          description: "Check the HTTP status and basic information of a website",
          inputSchema: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description: "The URL of the website to check",
              },
            },
            required: ["url"],
          },
        },
      ];

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "fetch_website":
            return await this.handleFetchWebsite(args);
          case "extract_metadata":
            return await this.handleExtractMetadata(args);
          case "check_status":
            return await this.handleCheckStatus(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${errorMessage}`,
            },
          ],
        };
      }
    });
  }

  private async handleFetchWebsite(args: unknown) {
    const { url } = FetchWebsiteSchema.parse(args);
    
    const response = await fetch(url);
    const html = await response.text();
    
    return {
      content: [
        {
          type: "text",
          text: `Website content from ${url}:\n\n${html}`,
        },
      ],
    };
  }

  private async handleExtractMetadata(args: unknown) {
    const { url } = ExtractMetadataSchema.parse(args);
    
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const metadata = {
      url,
      title: $("title").text() || "",
      description: $('meta[name="description"]').attr("content") || "",
      ogTitle: $('meta[property="og:title"]').attr("content") || "",
      ogDescription: $('meta[property="og:description"]').attr("content") || "",
      ogImage: $('meta[property="og:image"]').attr("content") || "",
      keywords: $('meta[name="keywords"]').attr("content") || "",
      author: $('meta[name="author"]').attr("content") || "",
      canonical: $('link[rel="canonical"]').attr("href") || "",
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(metadata, null, 2),
        },
      ],
    };
  }

  private async handleCheckStatus(args: unknown) {
    const { url } = CheckStatusSchema.parse(args);
    
    const startTime = Date.now();
    const response = await fetch(url, { method: "HEAD" });
    const responseTime = Date.now() - startTime;

    const status = {
      url,
      statusCode: response.status,
      statusText: response.statusText,
      responseTime: `${responseTime}ms`,
      contentType: response.headers.get("content-type") || "",
      server: response.headers.get("server") || "",
      lastModified: response.headers.get("last-modified") || "",
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(status, null, 2),
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("MCP Website Helper Server running on stdio");
  }
}

// Start the server
const server = new WebsiteHelperServer();
server.run().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
