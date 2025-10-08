import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

function getDirname() {
  // tsup shims `import.meta.url` for CJS output, so this works in both CJS and ESM.
  return path.dirname(fileURLToPath(import.meta.url));
}

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
      const aclPath = path.join(getDirname(), "..", "..", "ACL.md");
      const text = await readFile(aclPath, "utf-8");
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
