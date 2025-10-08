import { describe, it, expect } from "vitest";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Client as McpClient } from "@modelcontextprotocol/sdk/client/index.js";
import { registerInstructionsResource } from "./acl-instructions.js";

describe("registerInstructionsResource", () => {
  it("should register the ACL instructions resource", async () => {
    const server = new McpServer({
      name: "test-server",
      version: "1.0.0",
      capabilities: { resources: true },
    });

    registerInstructionsResource(server);

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    server.connect(serverTransport);

    const client = new McpClient({
      name: "test-client",
      version: "1.0.0",
    });
    client.connect(clientTransport);

    const response = await client.listResources();

    expect(response.resources).toHaveLength(1);
    expect(response.resources[0]).toMatchObject({
      uri: "instructions://acl-specification",
      name: "ACL Specification for AI Agents",
      description:
        "Comprehensive specification for understanding and using Agent Communication Language (ACL) in development workflows",
      mimeType: "text/markdown",
    });
  });

  it("should return ACL.md content when reading the resource", async () => {
    const server = new McpServer({
      name: "test-server",
      version: "1.0.0",
      capabilities: { resources: true },
    });

    registerInstructionsResource(server);

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    server.connect(serverTransport);

    const client = new McpClient({
      name: "test-client",
      version: "1.0.0",
    });
    client.connect(clientTransport);

    const response = await client.readResource({
      uri: "instructions://acl-specification",
    });

    expect(response.contents).toHaveLength(1);
    expect(response.contents[0].uri).toBe("instructions://acl-specification");
    if (response.contents[0].mimeType === "text/markdown") {
      expect(response.contents[0].text).toContain(
        "Agent Communication Language (ACL)",
      );
      expect(response.contents[0].text).toContain("## 1. Introduction");
    }
  });
});
