import { z } from "zod";
import type { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";

const inputSchema = {
  name: z.string().describe("The name to say hello to"),
};

export const helloTool = {
  name: "hello",
  config: {
    title: "Hello Tool",
    description: "Says hello",
    inputSchema,
  },
  callback: (async ({ name }) => {
    return {
      content: [{ type: "text", text: `Hello, ${name}!` }],
    };
  }) satisfies ToolCallback<typeof inputSchema>,
} as const;
