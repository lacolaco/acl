# Agent Communication Language (ACL)

## Version 1.1

---

## 1. Introduction

### Purpose

Agent Communication Language (ACL) is a Domain-Specific Language (DSL) for concise, structured communication with AI agents. It provides a simple syntax for instructing agents in development workflows.

### Core Principle: Context Over Formalism

**ACL prioritizes intent and context over strict syntax rules.**

This is not a language for static parsing—it's a communication protocol for LLMs. The agent should:

1. **Understand intent first** - Focus on what the user wants
2. **Interpret from context** - Use conversation history and project state
3. **Be flexible** - Adapt to variations in syntax and expression

### Design Goals

- **Simplicity**: Easy to learn and use
- **Brevity**: Minimal verbosity
- **Flexibility**: Context-aware interpretation
- **Composability**: Chain operations naturally
- **Persistence**: Retain knowledge across sessions

### Scope

ACL is for:

- Development workflow automation
- Agent behavior customization
- Knowledge management
- Error handling and recovery

### Glossary

**INSTRUCTION_FILE**
: The agent's instruction file used to store configurations and ACL method definitions. This is an agent-specific file (e.g., `CLAUDE.md` for Claude Code, `GEMINI.md` for Gemini CLI, or `AGENTS.md` for multi-agent projects).

**USER_INSTRUCTION_FILE**
: User-level instruction file that persists across all projects. Examples: `~/.claude/CLAUDE.md` (Claude Code), `~/.agents/AGENTS.md` (generic).

**.acl/config.md**
: Project-level configuration file for ACL method definitions. Located at `.acl/config.md` in the project root. This is the preferred location for project-specific ACL objects and functions.

**ACL Method Definitions**
: Custom function and object definitions stored in `.acl/config.md` using `obj` and `fn` keywords within an `<acl:definitions>` XML tag.

**scope**
: The context where an action takes place (e.g., `project`, `ACL`, `session`). Can be omitted for global functions.

**action**
: What to do (e.g., `build()`, `test()`, `note()`).

**readonly**
: Function modifier indicating the function performs only read-only operations. Readonly functions cannot modify files, execute commands, or change system state. They can only read data, analyze information, and return insights.

**Agent**
: An AI assistant (e.g., Claude Code, Gemini CLI, GitHub Copilot) that interprets and executes ACL commands.

---

## 2. Core Concept: scope.action(details)

### Basic Structure

All ACL expressions follow a simple pattern:

```
ACL:scope.action(details)
```

**Components**:

- **ACL**: Prefix indicating ACL protocol
- **scope**: Where the action takes place (optional for global functions)
- **action**: What to do
- **details**: Parameters or context (optional)

**Examples**:

```acl
ACL:fix("failing tests")           # Global function (no scope)
ACL:project.build()                # Object method
ACL:test("auth/**")                # Global with parameter
ACL:note("convention")             # Global with parameter
ACL:project.note("convention")     # Object method with parameter
```

### Variations

**Multiple parameters**:

```acl
ACL:refactor("UserService", "extract authentication")
```

**Chaining**:

```acl
ACL:project.build() && test() && project.deploy()
```

**Property access**:

```acl
ACL:fix(test().failures)
```

**Promise-like handling**:

```acl
ACL:project.deploy()
  .then("notify team")
  .catch("rollback")
  .finally("cleanup")
```

**Alert handling**:

```acl
ACL:alert("stop and analyze the issue")
```

### Interpretation Rules

The agent should interpret ACL expressions flexibly:

- Missing scope → assume global function or infer from context
- Unknown method → check for typos, aliases, or context clues
- Ambiguous syntax → prioritize user intent over strict parsing

---

## 3. Global Functions

### Overview

Global functions work across all projects and are called without a scope prefix. These are built-in functions defined by the ACL system.

### Built-in Function Definitions

```acl
fn fix(issue): void {
  description: "Analyze and fix problems"
  action: [
    "Diagnose root cause of the issue",
    "Implement solution",
    "Verify fix works correctly"
  ]
}

fn refactor(targets, direction): void {
  description: "Refactor safely with tests"
  action: [
    test(),
    "Refactor code according to direction",
    test()
  ]
}

readonly fn think(issue): string {
  description: "Analyze issue with read-only operations"
  action: [
    "Investigate using read-only tools (Read, Grep, Glob, WebFetch)",
    "Analyze the problem and provide detailed insights",
    "Present recommendations and potential solutions to user",
    "Wait for explicit user instruction before taking any action"
  ]
  returns: "Analysis, insights, and recommendations as text output only"
}

fn test(pattern?): object {
  description: "Run tests"
  action: "Analyze test coverage first, generate minimal specs if insufficient, execute tests, report results with .failures (array), .errors (array), .passed (number)"
}

fn alert(message): void {
  description: "Alert agent about violations or mistakes"
  action: [
    "Immediately stop all current work",
    "Analyze the problem thoroughly",
    "Present detailed analysis to user",
    "Suggest preventive measures to avoid recurrence",
    "Await explicit user approval before taking any corrective action"
  ]
}

fn retry(): any {
  description: "Retry last failed task"
  action: "Detect last failed operation from context, retry it with same parameters"
}

fn fetch(url): object {
  description: "Fetch web resources"
  action: "HTTP GET request to URL, return content with .content (string), .status (number), .headers (object)"
}

fn note(message): void {
  description: "Save to USER_INSTRUCTION_FILE"
  action: "Append message to USER_INSTRUCTION_FILE, persist across all projects"
}

fn docs(targets): void {
  description: "Understand targets and enrich documentation"
  action: "Analyze specified modules/classes/APIs, understand their purpose and usage, add or improve documentation"
}

readonly fn review(target): string {
  description: "Code review with analysis only"
  action: "Analyze code quality, patterns, architecture, and potential issues. Provide insights on maintainability, performance, security, and best practices."
}

fn exec(command): number {
  description: "Execute shell command"
  action: "Run command synchronously in shell, return exit code. Throw error on non-zero exit."
}
```

### Usage

```acl
# Fix issues
fix("typescript errors")
fix("failing unit tests")

# Safe refactoring
refactor("auth module", "separate concerns")

# Read-only analysis
think("optimal caching strategy")

# Run tests
test()                    # All tests
test("integration/**")    # Pattern filter

# Agent feedback
alert("You violated the security policy")

# Retry after fixing
project.deploy()  # Fails
fix("credentials")
retry()           # Retries deploy

# Fetch external data
fetch("https://api.example.com/data")

# Save user-level notes
note("Use TypeScript strict mode")
note("Prefer composition over inheritance")

# Enrich documentation
docs("authentication module")
docs("API endpoints")
docs("UserService class")

# Code review (readonly)
review("src/main.ts")
review("authentication module")

# Execute shell command
exec("git status")
exec("npm test")
```

---

## 4. Objects

### ACL Object

```acl
obj ACL = "ACL system management; provides initialization, definition loading, scanning, and introspection capabilities for Agent Communication Language"

fn ACL.init(): void {
  description: "Initialize ACL for current project"
  action: [
    "Create .acl/config.md if not exists",
    "Add <acl:definitions> XML tag wrapper",
    "Scan project structure for build tools (package.json scripts, Makefile, etc.)",
    "Generate initial obj and fn definitions based on detected tools",
    "Save definitions inside <acl:definitions> tags in .acl/config.md"
  ]
}

fn ACL.load(): void {
  description: "Load project's ACL definitions into working context"
  action: [
    "Read .acl/config.md",
    "Parse content within <acl:definitions> tags",
    "Extract all obj declarations",
    "Extract all fn definitions (global functions and object methods)",
    "Load definitions into agent's working memory for command execution"
  ]
}

fn ACL.scan(): void {
  description: "Re-scan project and update ACL definitions"
  action: [
    "Scan current project structure",
    "Detect new or changed build tools and scripts",
    "Compare with existing definitions in .acl/config.md",
    "Update definitions within <acl:definitions> tags in .acl/config.md",
    "Reload definitions into context"
  ]
}

fn ACL.list(): void {
  description: "Display all available ACL definitions"
  action: [
    "Read loaded ACL definitions from context",
    "Format output showing objects, global functions, and object methods",
    "Display with signatures and return types",
    "Include session objects if available"
  ]
}
```

**Examples**:

```acl
ACL:ACL.init()                              # Setup project
ACL:ACL.load()                              # Load project ACL definitions
ACL:ACL.list()                              # See available methods
```

**ACL.list() Output Example**:

This example shows both built-in functions and user-defined functions from `.acl/config.md`.

```
Available ACL Definitions:

Objects:
  project = "MCP server implementation that provides ACL support"

Global Functions:
  # Built-in functions
  fix(issue): void
  refactor(targets, direction): void
  think(issue): string
  test(pattern?): object
  alert(message): void
  retry(): any
  fetch(url): object
  note(message): void
  docs(targets): void
  review(target): string
  exec(command): number

  # User-defined functions (from .acl/config.md)
  begin(goal): void
  finish(task): void

Object Methods:
  project.test(): void
  project.typecheck(): void
  project.start(): void
  project.build(): void
  project.format(): void
  project.inspect(): void
  project.inspectDist(): void

Session Objects:
  session.summary(): string
  session.insights(): string
```

### project Object

```acl
obj project = "Current project context; provides access to project-specific build tools, commands, and configurations"

fn project.note(message): void {
  description: "Save important information to INSTRUCTION_FILE"
  action: [
    "Read INSTRUCTION_FILE (CLAUDE.md, GEMINI.md, etc.)",
    "Append message to appropriate section or create new section",
    "Save file with formatted markdown",
    "Confirm save to user"
  ]
}
```

**Dynamic Methods** (generated by `ACL.init()` and `ACL.scan()`):

Methods are automatically generated based on detected build tools:
- From `package.json` scripts: `project.test()`, `project.build()`, `project.lint()`, etc.
- From `Makefile` targets: `project.make_target()`
- From `justfile` recipes: `project.recipe()`

Each generated method executes the corresponding command via `exec()`.

**Properties**:

- `project.name` - Project name from package.json or directory
- `project.root` - Project root directory path
- `project.config` - Project configuration object

**Examples**:

```acl
ACL:project.note("This project uses TypeScript strict mode")
ACL:project.build()
ACL:project.deploy()
```

**Scope**: Current project only

### session Object

```acl
obj session = "Current conversation context; provides analysis and insights about the ongoing session"

fn session.summary(): string {
  description: "Generate comprehensive summary of current session"
  action: [
    "Analyze conversation history from beginning to current point",
    "Identify key decisions, changes, and outcomes",
    "Extract important technical details and context",
    "Format as structured markdown summary",
    "Return summary string"
  ]
  returns: "Markdown-formatted summary of session including goals, actions taken, decisions made, and current state"
}

fn session.insights(): string {
  description: "Extract actionable insights from current session"
  action: [
    "Analyze patterns and problems encountered",
    "Identify lessons learned and best practices discovered",
    "Extract reusable knowledge and recommendations",
    "Format as bullet points or structured text",
    "Return insights string"
  ]
  returns: "Actionable insights and lessons learned that should be preserved for future reference"
}
```

**Properties**:

- `session.id` - Unique identifier for current session
- `session.duration` - Time elapsed since session start

**Examples**:

```acl
ACL:project.note(session.insights())  # Save to project
ACL:note(session.summary())            # Save to user-level
```

**Scope**: Current conversation only

---

## 5. Chaining & Handlers

### Sequential Execution

**Operator Chaining** - Use `&&` to chain operations:

```acl
ACL:project.build() && test() && project.deploy()
```

**Array Format** - Use array syntax for sequential steps:

```acl
action: [
  project.build(),
  test(),
  project.deploy()
]
```

**Semantics** (both formats):

- Evaluates operations sequentially from left-to-right (or top-to-bottom in arrays)
- Each operation must complete successfully before the next begins
- If any operation fails (throws error or returns non-zero), execution stops immediately
- Subsequent operations are not executed
- Returns the error/result of the failed operation

**Note**: Array format is preferred for multi-step actions in function definitions as it's more readable and allows mixing of expressions and natural language prompts.

### Promise-like Chains

Handle success, failure, and cleanup:

```acl
method()
  .then(action_on_success)
  .catch(action_on_failure)
  .finally(action_for_cleanup)
```

**Execution**:

- Success: method → then → finally
- Failure: method → catch → finally

**Examples**:

```acl
ACL:project.deploy()
  .then("send Slack notification")
  .catch("rollback and alert team")
  .finally("update deployment log")

ACL:project.build()
  .then(test())
  .then(project.deploy())
  .catch(fix("build or test failures"))
```

### Output Redirection

Use `>` to apply operation results to a target:

```acl
operation > target
```

**Semantics**:

1. Evaluate left-side operation completely
2. Pass the result (return value or output) as input to the right-side target
3. If target is a function, call it with the result as argument
4. If target is a property or identifier, apply changes to that target

**Examples**:

```acl
fix("type errors") > project.note()
# 1. Execute fix("type errors"), producing a summary
# 2. Call project.note() with that summary

session.insights() > note()
# 1. Execute session.insights(), returning insights string
# 2. Call note() with insights string as argument
```

**Target Types**:

- **Function call**: `result > functionName()` - calls function with result
- **Property access**: `result > object.property` - sets property value

### Alert System

The `alert()` function provides a mechanism for users to notify the agent of violations or mistakes.

**Behavior**:
1. Agent immediately stops all current work
2. Agent analyzes the alert and the problem
3. Agent presents problem analysis to user
4. Agent **awaits explicit approval** of the analysis before taking any corrective action
5. After approval, agent proceeds with fixes or follows user instruction

**Critical Rule**: The agent must NOT attempt to fix problems or modify anything before receiving user approval of the problem analysis.

**Examples**:

```acl
ACL:alert("You modified the wrong file")
# → Agent immediately halts current work
# → Agent analyzes what was modified and why it's wrong
# → Agent presents analysis: "I modified config.prod.yml instead of config.dev.yml because..."
# → Agent waits for approval
# → After approval: Agent proceeds to revert/fix

ACL:alert("You don't understand the requirements")
# → Agent stops
# → Agent analyzes: "I misunderstood requirement X to mean Y, but it actually means Z"
# → Agent waits for confirmation
# → After confirmation: Agent proceeds with correct understanding
```

**Use Cases**:
- Notify agent of policy violations
- Catch agent mistakes or misunderstandings early
- Halt problematic operations immediately
- Ensure agent understanding before corrective action

### Error Handling Semantics

**Failure Conditions**:

- Function returns non-zero exit code
- Function throws an error/exception
- Function explicitly fails (e.g., tests fail, build fails)

**Agent Behavior on Failure**:

1. **With `&&`**: Stop chain, report error, await user instruction
2. **With `.catch()`**: Execute catch handler, continue to `.finally()` if present
3. **With `alert()`**: Stop all current work, analyze problem, present analysis, await approval before corrective action
4. **Standalone**: Report error with context, suggest fixes, await user instruction

**Example**:

```acl
ACL:project.build() && test()
# If build fails: agent stops, reports build error, does not run tests

ACL:project.build()
  .then(test())
  .catch(fix("build failure"))
# If build fails: agent executes fix("build failure")
```

---

## 6. Knowledge Management

### Hierarchy

```
User Level (USER_INSTRUCTION_FILE)
  ↓ Personal preferences, coding standards
  Managed via: note()

Project Level (INSTRUCTION_FILE)
  ↓ Project conventions, notes
  Managed via: project.note()

Project Level (.acl/config.md)
  ↓ ACL method definitions (obj/fn)
  Managed via: ACL.init(), ACL.scan()

Session Level (temporary)
  ↓ Current conversation insights
  Analyzed via: session.insights(), session.summary()
```

### Persistence

| Method               | File Examples                                | Scope           | Use Case             |
| -------------------- | -------------------------------------------- | --------------- | -------------------- |
| `note()`             | `~/.claude/CLAUDE.md`, `~/.agents/AGENTS.md` | All projects    | Personal preferences |
| `project.note()`     | `CLAUDE.md`, `GEMINI.md`, `AGENTS.md`        | Current project | Project conventions  |
| `session.insights()` | Return value                                 | Temporary       | Extract learnings    |

### Method Definitions

`.acl/config.md` contains project-specific ACL method definitions within an `<acl:definitions>` tag:

```xml
<acl:definitions>
obj project = "Current project context"

fn project.build(): void {
  description: "Build the project"
  action: exec("pnpm run build")
}

fn project.lint(): void {
  description: "Lint the project"
  action: exec("pnpm run lint")
}

fn project.deploy(): void {
  description: "Deploy the project"
  action: exec("pnpm run deploy")
}
</acl:definitions>
```

**Format Requirements**:

- Must be wrapped in `<acl:definitions>` XML tags

**Management**:

- Created by `ACL.init()`
- Updated by `ACL.scan()`
- Listed by `ACL.list()`

---

## 7. Common Patterns

### Starting Tasks

```acl
ACL:begin("implement user login feature")
ACL:begin("add email validation")
ACL:begin("create order processing workflow")
```

### Quick Fixes

```acl
ACL:fix("failing tests")
ACL:fix("typescript errors")
ACL:fix(lint().errors)
```

### Safe Refactoring

```acl
ACL:refactor("auth module", "extract logic")
ACL:refactor("API routes", "consolidate error handling")
```

### Build Pipelines

```acl
ACL:project.build() && test() && project.deploy()

ACL:project.build()
  .then(test())
  .then(project.deploy())
  .catch(fix("pipeline failure"))
```

### Error Handling

```acl
ACL:project.deploy()
  .then("notify team")
  .catch("rollback")
  .finally("cleanup resources")
```

### Knowledge Capture

```acl
ACL:note("Use TypeScript strict mode")
ACL:note("Prefer composition over inheritance")
ACL:project.note("This project uses feature-based folders")
ACL:project.note(session.insights())
```

### Web Resources

```acl
ACL:fetch("https://api.github.com/repos/owner/repo")
ACL:obj apiData = fetch("https://api.example.com/metrics")
ACL:think(apiData.content)
```

### Method Composition

```acl
ACL:fix(test().failures)
ACL:refactor(lint().errors, "improve code quality")
ACL:think(project.analyze().bottlenecks)
```

### Documentation

```acl
ACL:docs("authentication module")
ACL:docs("UserService class")
ACL:docs("REST API endpoints")
```

### Custom Workflows

Define custom workflows:

```acl
fn finish(task): void {
  description: "Complete task with cleanup, tests, commit, and PR"
  action: tidyUp() && test() && git.branch(task) && git.commit(task).push() && github.pr(task)
}

# Usage
ACL:finish("add user authentication")
ACL:finish("fix login bug")
```

---

## 8. Best Practices

### When to Use ACL

- ✅ Quick workflows
- ✅ Build pipelines
- ✅ Error handling
- ✅ Knowledge persistence
- ✅ Agent customization

### When to Use Natural Language

- ✅ Complex explanations
- ✅ Exploratory questions
- ✅ Unclear mappings

### Naming

- Use camelCase: `buildAndTest()`
- Be descriptive but concise
- Follow project conventions

### Knowledge Management

- `note()` for personal preferences (user-level)
- `project.note()` for project-specific rules
- `ACL.scan()` after changing build scripts
- `session.insights()` at end of work

### Error Handling

- Use `.then/.catch/.finally` for critical operations
- Use `alert()` to immediately halt agent on violations or mistakes

### Method Safety

- Remove dangerous method definitions from INSTRUCTION_FILE
- Common: disable production deploys, destructive operations

---

## 9. Declaration Syntax

### Object and Function Definitions

ACL provides keywords for declaring objects and functions:

#### 1. Object Declaration

Define an object with the `obj` keyword:

**Syntax**:

```acl
obj objectName = "description"
```

**Examples**:

```acl
obj api = "API server instance"

obj project = "Current project context with build and deployment methods"
```

**Stored in .acl/config.md:**
```acl
obj objectName = "description"
```

#### 2. Object Method Definition

Define methods on an object using `fn` with object scope:

**Syntax**:

```acl
fn objectName.methodName(parameters): returnType {
  description: "Human-readable description"
  action: implementation
}
```

**Examples**:

```acl
fn project.build(): void {
  description: "Build the project"
  action: exec("pnpm run build")
}

fn project.deploy(env): void {
  description: "Deploy to specified environment"
  action: [
    project.build(),
    test(),
    server.deploy(env)
  ]
}

fn project.verify(): void {
  description: "Verify project integrity"
  action: project.build() && test()
}
```

**Stored in .acl/config.md:**
```acl
fn objectName.methodName(parameters): returnType {
  description: "..."
  action: ...
}
```

#### 3. Global Function Definition

Define a global function using the `fn` keyword with return type annotation:

**Syntax**:

```acl
fn functionName(parameters): returnType {
  description: "Human-readable description"
  action: implementation
}
```

**Components**:
- `fn` - Function definition keyword
- `functionName(parameters)` - Function signature
- `: returnType` - Return type annotation (void, string, object, etc.)
- `description` - Human-readable explanation of what the function does
- `action` - Implementation in one of these formats:
  - Single expression: `action: expression`
  - Natural language: `action: "prompt text"`
  - Sequential steps (array): `action: [step1, step2, step3]`

**Examples**:

```acl
# Single expression action
fn quickTest(): void {
  description: "Run tests quickly"
  action: test()
}

# Sequential chain action (&&)
fn finish(task): void {
  description: "Complete task with cleanup and PR creation"
  action: tidyUp() && test() && git.commit(task).push() && github.pr(task)
}

# Array format for multi-step action
fn deploy(env): void {
  description: "Deploy with comprehensive checks"
  action: [
    project.build(),
    test(),
    "Verify environment configuration",
    server.deploy(env),
    "Notify team of deployment"
  ]
}

# Natural language action
readonly fn review(target): string {
  description: "Comprehensive code review with quality metrics"
  action: "Analyze code quality, patterns, architecture, and potential issues. Provide detailed insights on maintainability, performance, and best practices."
}
```

**Stored in .acl/config.md:**

```acl
fn functionName(parameters): returnType {
  description: "Human-readable description"
  action: implementation
}
```

#### 4. Readonly Modifier

The `readonly` modifier indicates that a function performs only read-only operations and cannot modify files, execute commands, or change system state.

**Syntax**:

```acl
readonly fn functionName(parameters): returnType {
  description: "Human-readable description"
  action: implementation
}
```

**Constraints**:

- **ALLOWED**: Read, Grep, Glob, WebFetch, data analysis, returning information
- **FORBIDDEN**: Edit, Write, NotebookEdit, Bash (except read-only commands), exec, state modification

**Examples**:

```acl
# Read-only analysis function
readonly fn think(issue): string {
  description: "Analyze issue with read-only operations"
  action: [
    "Investigate using read-only tools",
    "Analyze the problem and provide insights",
    "Present recommendations to user"
  ]
  returns: "Analysis and recommendations"
}

# Read-only code review
readonly fn review(target): string {
  description: "Code review with analysis only"
  action: "Analyze code quality, patterns, and architecture. Provide insights on maintainability and best practices."
  returns: "Review insights and recommendations"
}
```

**Note**: The `obj`, `fn`, and `readonly` keywords are the standard syntax for ACL definitions.

### .acl/config.md Format

Project-specific ACL definitions are stored in `.acl/config.md` using the `<acl:definitions>` XML tag:

```xml
<acl:definitions>
# Objects
obj project = "Current project context"

# Object methods
fn project.test(): void {
  description: "Run project tests"
  action: exec("pnpm test")
}

fn project.build(): void {
  description: "Build the project"
  action: exec("pnpm run build")
}

# Global functions
fn finish(task): void {
  description: "Complete task with cleanup and PR"
  action: tidyUp() && test() && git.commit(task).push() && github.pr(task)
}
</acl:definitions>
```

**Behavior**:

All project-specific definitions using `obj` and `fn` keywords are wrapped in `<acl:definitions>` tags in `.acl/config.md`.

---

## 10. Operators & Keywords

### Operators

- `>` - Output redirection (apply result to target)
- `&&` - Sequential chaining (stop on failure)
- `.` - Method chaining and property access

### Reserved Keywords

- `obj` - Object declaration keyword
- `fn` - Function definition keyword
- `readonly` - Function modifier for read-only operations
- `then(action)` - Promise success handler
- `catch(action)` - Promise error handler
- `finally(action)` - Promise cleanup handler
- `void` - Return type indicating no return value
- `any` - Return type for dynamic values
- `string`, `number`, `object`, `array` - Return type annotations

---

## 11. File Locations

| File                  | Example Locations                                    | Purpose                     |
| --------------------- | ---------------------------------------------------- | --------------------------- |
| USER_INSTRUCTION_FILE | `~/.claude/CLAUDE.md`, `~/.agents/AGENTS.md`         | User-wide preferences       |
| INSTRUCTION_FILE      | `CLAUDE.md`, `GEMINI.md`, `AGENTS.md` (project root) | Agent-specific instructions |
| .acl/config.md        | `.acl/config.md` (project root)                      | Project ACL definitions     |

---

**Version**: 3.8
**Last Updated**: 2025-10-07
