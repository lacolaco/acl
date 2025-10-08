import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";

function getDirname() {
  // tsup shims `import.meta.url` for CJS output, so this works in both CJS and ESM.
  return path.dirname(fileURLToPath(import.meta.url));
}

export const getAclSpecificationTool = {
  name: "get_acl_specification",
  config: {
    title: "Get ACL Specification",
    description:
      "Returns the Agent Communication Language (ACL) specification from ACL.md",
    inputSchema: {},
  },
  callback: (async () => {
    const aclPath = path.join(getDirname(), "..", "..", "ACL.md");
    const aclContent = await readFile(aclPath, "utf-8");
    return {
      content: [{ type: "text", text: aclContent }],
    };
  }) satisfies ToolCallback,
} as const;
