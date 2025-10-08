import type { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAclSpecification } from "../utils/acl-path.js";

export const getAclSpecificationTool = {
  name: "get_acl_specification",
  config: {
    title: "Get ACL Specification",
    description: `
<Purpose>
Get the complete Agent Communication Language (ACL) specification document. ACL is a Domain-Specific Language (DSL) for concise, structured communication with AI agents in development workflows.
</Purpose>

<Use Cases>
- When the user asks about ACL syntax, commands, or usage (e.g., "How do I use ACL?", "What is begin()?")
- **When encountering ACL object methods like ACL.init(), ACL.load(), ACL.scan(), ACL.list()**
- When encountering ACL expressions like begin(), finish(), project.build(), spec.add(), session.summary()
- When questions involve CLAUDE.md, ACL Method Definitions, or project-specific command definitions
- When needing to understand workflow automation, knowledge management, or agent customization patterns
- When asked about obj, fn keywords, global functions, object methods, or chaining operators (&&, >, .then/.catch/.finally)
</Use Cases>

<Operational Notes>
- The specification includes: core syntax (scope.action(details)), global functions (begin, fix, test, etc.), built-in objects (ACL, project, session), declaration syntax (obj, fn), and common patterns
- **MUST** reference this when interpreting ACL commands to ensure correct behavior
- The specification is the authoritative source for ACL semantics and best practices
</Operational Notes>`,
    inputSchema: {},
  },
  callback: (async () => {
    const aclContent = await getAclSpecification();
    return {
      content: [{ type: "text", text: aclContent }],
    };
  }) satisfies ToolCallback,
} as const;
