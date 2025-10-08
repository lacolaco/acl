import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { helloTool } from "./tools/hello.js";
import { getAclSpecificationTool } from "./tools/get-acl-specification.js";

const server = new McpServer({
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

const transport = new StdioServerTransport();
server.connect(transport);
