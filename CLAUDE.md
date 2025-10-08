# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server implementation that provides ACL (Agent Communication Language) support. The server is built using the `@modelcontextprotocol/sdk` and exposes tools for AI agents to communicate using structured ACL syntax.

## Development Commands

```bash
# Run tests (using Vitest)
pnpm test

# Start development server (uses tsx for TypeScript execution)
pnpm start

# Build for production (creates ESM and CJS bundles with type definitions)
pnpm build

# Format code (using Prettier)
pnpm format

# Inspect MCP server in development mode
pnpm inspect

# Inspect built MCP server
pnpm inspect:dist
```

## Architecture

### MCP Server Structure

- **Entry point**: `src/main.ts` - Configures and starts the MCP server with stdio transport
- **Tools directory**: `src/tools/` - Modular tool definitions
  - Each tool is defined as a pure object with `name`, `config`, and `callback`
  - Tools export constants (e.g., `helloTool`, `getAclSpecificationTool`)
- **Test files**:
  - `src/main.test.ts` - Integration tests using InMemoryTransport
  - `src/tools/*.test.ts` - Unit tests for individual tools
- **Build output**: `dist/` directory contains:
  - `main.js` - Executable CJS bundle (bin entry point)
  - `main.mjs` - ESM bundle
  - `main.d.ts` and `main.d.mts` - TypeScript declarations

### Tool Definition Pattern

Tools are defined as pure objects in `src/tools/`:

```typescript
import type { ToolCallback } from "@modelcontextprotocol/sdk/server/mcp.js";

const inputSchema = {
  name: z.string().describe("Parameter description"),
};

export const myTool = {
  name: "tool_name",
  config: {
    title: "Tool Title",
    description: "Tool description",
    inputSchema,
  },
  callback: (async ({ name }) => {
    return {
      content: [{ type: "text", text: `Result: ${name}` }],
    };
  }) satisfies ToolCallback<typeof inputSchema>,
} as const;
```

Then registered in `main.ts`:

```typescript
server.registerTool(myTool.name, myTool.config, myTool.callback);
```

### Testing Pattern

- **Unit tests** (`src/tools/*.test.ts`): Test tool logic directly by calling the callback function
- **Integration tests** (`src/main.test.ts`): Test MCP protocol communication using `InMemoryTransport.createLinkedPair()`
- **Type checking**: `pnpm test` runs `tsc --noEmit` before tests to catch type errors

**Test Adaptation Pattern**: When modifying ACL.md specification:

1. Identify tests that validate spec content (e.g., `get-acl-specification.test.ts`)
2. Update test assertions to match new spec structure
3. Replace removed sections with new equivalent sections (e.g., "Language Specification" → "## 1. Introduction", "Built-in Objects" → "## 4. Objects")
4. Run tests to verify changes are complete

## Build System

- **TypeScript**: Configured for NodeNext module system targeting ES2022
- **Build tool**: tsup for bundling
  - Creates both ESM (`.mjs`) and CJS (`.cjs`) outputs
  - `shims: true` in tsup config enables `import.meta.url` in CJS
  - `clean: true` cleans dist directory before build
- **Package manager**: pnpm (v10.14.0)
- **Package type**: `"type": "module"` - ESM by default

## ACL Integration

This project implements the Agent Communication Language (ACL) specification defined in `ACL.md`. The MCP server acts as a bridge between AI agents and ACL commands, enabling structured agent communication.

## Publishing

This package uses **automated releases** with release-please and **npm Trusted Publishing** with OIDC authentication.

**Note**: pnpm version is specified in `package.json` (`packageManager` field), so it should not be duplicated in workflow files. The `pnpm/action-setup` action automatically reads this field.

### Publishing Process

1. **Commit with Conventional Commits**:
   - Use conventional commit format: `feat:`, `fix:`, `docs:`, etc.
   - Push commits to main branch

2. **Automatic Release PR**:
   - release-please automatically creates/updates a release PR
   - The PR includes version bump and CHANGELOG updates

3. **Publish**:
   - Merge the release PR
   - GitHub Actions automatically publishes to npm with provenance
   - Uses OIDC authentication (no secrets required)

### npm Trusted Publisher Setup

Configure on npmjs.com package settings → "Trusted Publisher":

- Organization: `lacolaco`
- Repository: `acl`
- Workflow: `.github/workflows/publish.yml`

### Technical Requirements

- npm 11.5.1+ (automatically upgraded in workflow)
- `id-token: write` permission for OIDC
- `publishConfig.provenance: true` in package.json

## Key Dependencies

- `@modelcontextprotocol/sdk`: Core MCP server/client implementation
- `zod`: Runtime type validation for tool inputs
- `vitest`: Testing framework
- `tsx`: TypeScript execution for development
- `tsup`: TypeScript bundler

# ACL Method Definitions

```acl
obj spec = "ACL spec file; ACL.md"

fn spec.remove(identifiers): void {
  description: "Remove definitions from ACL.md"
  action: [
    "Read ACL.md to locate all references to identifiers",
    "Remove method definitions, examples, and documentation",
    "Update related sections (ACL.list() output, etc.)",
    "Verify consistency across entire spec"
  ]
}

fn spec.add(identifier, description): void {
  description: "Add new definition to ACL.md"
  action: [
    "Determine appropriate section in ACL.md",
    "Add method definition with description",
    "Update examples section",
    "Update ACL.list() output if applicable",
    "Verify consistency"
  ]
}

obj project = "MCP server implementation that provides ACL support"

fn project.test(): void {
  description: "Run tests using Vitest"
  action: exec("pnpm test")
}

fn project.typecheck(): void {
  description: "Type check using TypeScript"
  action: exec("pnpm run typecheck")
}

fn project.start(): void {
  description: "Start development server using tsx"
  action: exec("pnpm start")
}

fn project.build(): void {
  description: "Build for production (ESM and CJS bundles)"
  action: exec("pnpm run build")
}

fn project.format(): void {
  description: "Format code using Prettier"
  action: exec("pnpm format")
}

fn project.inspect(): void {
  description: "Inspect MCP server in development mode"
  action: exec("pnpm inspect")
}

fn project.inspectDist(): void {
  description: "Inspect built MCP server"
  action: exec("pnpm inspect:dist")
}

fn begin(goal): task {
  description: "Begin working on task with git branch and TODO planning; ALWAYS starts from up-to-date origin/main; pairs with finish(task)"
  action: [
    "Switch to main branch with git checkout main",
    "Fetch latest changes with git fetch origin",
    "Update local main with git pull origin main",
    "Create dedicated git branch for the task",
    "Draft initial TODO list based on goal",
    "Request user agreement on approach"
  ]
  returns: "Task object that can be passed to finish(task)"
}

fn finish(task): void {
  description: "Complete task with cleanup, tests, commit, and PR"
  action: [
    "Clean up and verify all changes are correct",
    "Run pnpm test to ensure all tests pass",
    "Stage all relevant files with git add",
    "Create conventional commit with detailed message using git commit",
    "Push to remote branch with git push",
    "Create pull request with gh pr create (include summary and test plan)",
    "Rebase on main if requested with git rebase origin/main",
    "Force push rebased branch if needed with git push -f"
  ]
}

fn object.detail(): void {
  description: "Add detailed definitions to object"
  action: [
    "Read current object definition in ACL.md",
    "Expand description with comprehensive details",
    "Convert action to multi-step array format",
    "Add returns field with detailed description"
  ]
}
```
