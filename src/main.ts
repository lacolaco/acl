import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "acl-mcp-server",
  version: "1.0.0",
  capabilities: {
    tools: true,
  },
});

server.registerTool(
  "hello",
  {
    title: "Hello Tool",
    description: "Says hello",
    inputSchema: {
      name: z.string().describe("The name to say hello to"),
    },
  },
  async ({ name }) => {
    return {
      content: [{ type: "text", text: `Hello, ${name}!` }],
    };
  },
);

const transport = new StdioServerTransport();
server.connect(transport);
