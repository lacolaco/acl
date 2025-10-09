import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAclSpecificationTool } from "./tools/get-acl-specification.js";
import { registerInstructionsResource } from "./resources/acl-instructions.js";

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "acl-mcp-server",
    version: "1.0.0",
    capabilities: {
      tools: true,
      resources: true,
    },
    instructions: `
<General Purpose>
This server provides tools and resources for working with Agent Communication Language (ACL), a Domain-Specific Language for concise, structured communication with AI agents in development workflows.

Your primary goal is to help users understand, write, and execute ACL commands for workflow automation, knowledge management, and agent customization.
</General Purpose>

<Core Workflows & Tool Guide>
Understanding ACL:
1. **ALWAYS** start by reading the \`instructions://acl-specification\` resource to understand ACL syntax and semantics
2. Use \`get_acl_specification\` tool when you need to reference specific ACL features during execution

Working with ACL Commands:
* When users write ACL expressions like \`begin()\`, \`finish()\`, \`ACL.init()\`, \`ACL.load()\`, reference the specification
* ACL follows \`scope.action(details)\` pattern: e.g., \`project.build()\`, \`spec.add()\`, \`session.summary()\`
* Support chaining operators: \`&&\` (sequential), \`>\` (output redirection), \`.then/.catch/.finally\` (promise-like)

Important Notes:
* The ACL specification (\`instructions://acl-specification\`) is the authoritative source for all ACL semantics
* **MUST** consult the specification when interpreting ACL commands to ensure correct behavior
</Core Workflows & Tool Guide>

<Key Concepts>
ACL Objects:
* \`ACL\`: System management (init, load, scan, list)
* \`project\`: Current project context with build/test/deploy methods
* \`session\`: Current conversation (summary, insights)
* \`spec\`: ACL specification file (add, remove methods)

Global Functions (Built-in):
* \`fix\`, \`refactor\`, \`test\`: Code quality operations
* \`think\`, \`review\`: Read-only analysis operations
* \`note\`, \`docs\`: Knowledge management
* \`alert\`, \`retry\`: Error handling
* \`fetch\`: Fetch web resources
* \`exec\`: Execute shell commands

Note: Functions like \`begin\`, \`finish\` are examples of user-defined functions in INSTRUCTION_FILE, not built-in functions.

Declaration Syntax:
* \`obj objectName = "description"\`: Declare an object
* \`fn functionName(params): returnType { ... }\`: Define a function
* \`readonly fn functionName(params): returnType { ... }\`: Define a read-only function
* INSTRUCTION_FILE: Project-specific ACL method definitions stored in \`acl\` codeblock under "# ACL Method Definitions" section
</Key Concepts>`,
  });

  server.registerTool(
    getAclSpecificationTool.name,
    getAclSpecificationTool.config,
    getAclSpecificationTool.callback,
  );

  registerInstructionsResource(server);

  return server;
}
