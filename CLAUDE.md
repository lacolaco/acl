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
- **Test file**: `src/main.test.ts` - Uses InMemoryTransport for testing MCP client-server communication
- **Build output**: `dist/` directory contains:
  - `main.js` - Executable CJS bundle (bin entry point)
  - `main.mjs` - ESM bundle
  - `main.d.ts` and `main.d.mts` - TypeScript declarations

### Tool Registration Pattern

Tools are registered using `server.registerTool()` with:
1. Tool name (string identifier)
2. Configuration object with:
   - `title`: Human-readable name
   - `description`: Tool description
   - `inputSchema`: Zod schema for input validation
3. Handler function that returns `{ content: [{ type: "text", text: string }] }`

### Testing Pattern

Tests use `InMemoryTransport.createLinkedPair()` to create connected client-server transports without requiring stdio communication. This allows for synchronous testing of MCP server behavior.

## Build System

- **TypeScript**: Configured for NodeNext module system targeting ES2022
- **Build tool**: tsup for bundling (creates both ESM and CJS outputs)
- **Package manager**: pnpm (v10.8.1)

## ACL Integration

This project implements the Agent Communication Language (ACL) specification defined in `ACL.md`. The MCP server acts as a bridge between AI agents and ACL commands, enabling structured agent communication.

## Publishing

This package uses **automated releases** with release-please and **npm Trusted Publishing** with OIDC authentication.

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

project: {
  test: exec("pnpm test"),
  start: exec("pnpm start"),
  build: exec("pnpm run build"),
  format: exec("pnpm format"),
  inspect: exec("pnpm inspect"),
  inspectDist: exec("pnpm inspect:dist")
}
