# ACL MCP Server

[![npm version](https://badge.fury.io/js/@lacolaco%2Facl.svg)](https://www.npmjs.com/package/@lacolaco/acl)

A Model Context Protocol (MCP) server that provides Agent Communication Language (ACL) support for AI agents. This server enables AI assistants to understand and execute structured ACL commands for development workflows, knowledge management, and agent customization.

## What is ACL?

**Agent Communication Language (ACL)** is a Domain-Specific Language (DSL) designed for concise, structured communication with AI agents. It provides:

- **Simple syntax**: Easy-to-learn `scope.action(details)` pattern
- **Development workflow automation**: Streamline common development tasks
- **Knowledge management**: Persist information across sessions
- **Agent customization**: Define project-specific behaviors and commands

Example ACL commands:
```acl
fix("failing tests")                    # Fix issues
refactor("auth module", "extract logic") # Refactor code
test("integration/**")                   # Run tests
project.build()                          # Build project
```

## Features

This MCP server provides:

- **`get_acl_specification` tool**: Retrieve the complete ACL specification document
- **`instructions://acl-specification` resource**: Access ACL documentation for agent context
- **Comprehensive ACL support**: Full implementation of ACL v1.1 specification
- **Built-in caching**: Optimized performance for repeated ACL specification access

## Installation

### As an MCP Server

Add to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "acl": {
      "command": "npx",
      "args": ["-y", "@lacolaco/acl@latest"]
    }
  }
}
```

## Available Tools and Resources

### Tools

#### `get_acl_specification`

Retrieves the complete ACL specification document.

**Use cases:**
- When users ask about ACL syntax or commands
- When encountering ACL expressions like `begin()`, `finish()`, `project.build()`
- When working with ACL object methods like `ACL.init()`, `ACL.load()`
- Understanding workflow automation patterns

**Example:**
```javascript
// Tool returns the full ACL.md specification
{
  "content": [
    {
      "type": "text",
      "text": "# Agent Communication Language (ACL)\n\n## Version 1.1..."
    }
  ]
}
```

### Resources

#### `instructions://acl-specification`

Provides the ACL specification as an instruction resource for agent context.

**Properties:**
- **Name**: "ACL Specification for AI Agents"
- **MIME Type**: `text/markdown`
- **Content**: Complete ACL specification document

This resource is automatically loaded by MCP clients to provide agents with ACL knowledge.

## ACL Specification Highlights

The server provides access to the complete ACL v1.1 specification, which includes:

### Core Syntax
```acl
scope.action(details)
```

### Global Functions
- `fix(issue)` - Analyze and fix problems
- `refactor(targets, direction)` - Refactor code safely
- `think(issue)` - Read-only analysis (no file modifications)
- `test(pattern?)` - Run tests
- `alert(message)` - Alert about violations
- `note(message)` - Save to USER_INSTRUCTION_FILE
- `docs(targets)` - Enhance documentation

### Built-in Objects
- `ACL` - System management (init, load, scan, list)
- `project` - Current project context
- `session` - Current conversation

### Declaration Syntax
- `obj objectName = "description"` - Declare objects
- `fn functionName(params): returnType { ... }` - Define functions

For complete details, see the [ACL.md](./ACL.md) specification.

## Development

### Prerequisites

- Node.js 18+
- pnpm 10+

### Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Run tests
pnpm test

# Build for production
pnpm build

# Format code
pnpm format

# Inspect MCP server (with MCP Inspector)
pnpm inspect

# Inspect built server
pnpm inspect:dist
```

### Project Structure

```
acl-mcp-server/
├── src/
│   ├── main.ts              # Entry point
│   ├── mcp-server.ts        # MCP server factory
│   ├── tools/               # Tool definitions
│   │   └── get-acl-specification.ts
│   ├── resources/           # Resource definitions
│   │   └── acl-instructions.ts
│   └── utils/               # Shared utilities
│       └── acl-path.ts      # ACL specification loader
├── ACL.md                   # ACL specification
├── CLAUDE.md                # Project instructions for Claude
└── dist/                    # Build output
```

### Testing

The project uses Vitest for testing:

```bash
# Run all tests
pnpm test

# Type check only
pnpm run typecheck
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests to the [GitHub repository](https://github.com/lacolaco/acl).

## License

MIT

## Links

- [npm Package](https://www.npmjs.com/package/@lacolaco/acl)
- [GitHub Repository](https://github.com/lacolaco/acl)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [ACL Specification](./ACL.md)
