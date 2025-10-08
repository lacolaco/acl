import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAclSpecification } from "../utils/acl-path.js";

export function registerInstructionsResource(server: McpServer): void {
  server.registerResource(
    "instructions",
    "instructions://acl-specification",
    {
      name: "ACL Specification for AI Agents",
      description:
        "Comprehensive specification for understanding and using Agent Communication Language (ACL) in development workflows",
      mimeType: "text/markdown",
    },
    async () => {
      const text = await getAclSpecification();
      return {
        contents: [
          {
            uri: "instructions://acl-specification",
            text,
          },
        ],
      };
    },
  );
}
