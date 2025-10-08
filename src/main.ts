#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./mcp-server.js";

const server = createMcpServer();
const transport = new StdioServerTransport();
server.connect(transport);
