#!/usr/bin/env node

/**
 * Simple test script to verify the MCP server can start and list tools
 * This uses the MCP SDK client to connect to the server
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { spawn } from "child_process";

async function testServer() {
  console.log("Starting MCP Website Helper Server test...\n");

  // Start the server process
  const serverProcess = spawn("node", ["dist/index.js"], {
    cwd: process.cwd(),
  });

  // Create a client to connect to the server
  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/index.js"],
  });

  const client = new Client(
    {
      name: "test-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  try {
    await client.connect(transport);
    console.log("✓ Successfully connected to server\n");

    // List available tools
    const toolsResponse = await client.listTools();
    console.log("Available tools:");
    toolsResponse.tools.forEach((tool) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log();

    console.log("✓ All tests passed!");
    await client.close();
    serverProcess.kill();
    process.exit(0);
  } catch (error) {
    console.error("✗ Test failed:", error);
    serverProcess.kill();
    process.exit(1);
  }
}

testServer();
