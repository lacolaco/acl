import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { describe, it, expect } from "vitest";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Client as McpClient } from "@modelcontextprotocol/sdk/client/index.js";

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

describe("server", () => {
  it("should say hello", async () => {
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    server.connect(serverTransport);

    const client = new McpClient({
      name: "test-client",
      version: "1.0.0",
    });
    client.connect(clientTransport);

    const result = await client.callTool({
      name: "hello",
      arguments: {
        name: "world",
      },
    });
    expect(result.content).toEqual([{ type: "text", text: "Hello, world!" }]);
  });
});
