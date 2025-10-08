import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Client as McpClient } from "@modelcontextprotocol/sdk/client/index.js";
import { helloTool } from "./tools/hello.js";
import { getAclSpecificationTool } from "./tools/get-acl-specification.js";

describe("MCP Server Integration", () => {
  let server: McpServer;

  beforeEach(() => {
    server = new McpServer({
      name: "acl-mcp-server",
      version: "1.0.0",
      capabilities: {
        tools: true,
      },
    });

    server.registerTool(helloTool.name, helloTool.config, helloTool.callback);
    server.registerTool(
      getAclSpecificationTool.name,
      getAclSpecificationTool.config,
      getAclSpecificationTool.callback,
    );
  });
  it("should call hello tool via MCP protocol", async () => {
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

  it("should call get_acl_specification tool via MCP protocol", async () => {
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    server.connect(serverTransport);

    const client = new McpClient({
      name: "test-client",
      version: "1.0.0",
    });
    client.connect(clientTransport);

    const result = await client.callTool({
      name: "get_acl_specification",
      arguments: {},
    });

    if (!Array.isArray(result.content)) {
      throw new Error("Expected content to be an array");
    }

    expect(result.content).toHaveLength(1);
    const firstContent = result.content[0];
    expect(firstContent).toHaveProperty("type", "text");
    if (firstContent.type === "text") {
      expect(firstContent.text).toContain("Agent Communication Language (ACL)");
      expect(firstContent.text).toContain("## 1. Introduction");
    }
  });
});
