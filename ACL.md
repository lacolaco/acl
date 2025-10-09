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

**PROJECT_INSTRUCTION_FILE**
: Project-level instruction file specific to the current project. Examples: `CLAUDE.md`, `GEMINI.md`, `AGENTS.md` (in project root or `.agents/` directory).

**ACL Method Definitions**
: Custom function and object definitions stored in INSTRUCTION_FILE using `obj` and `fn` keywords within an `acl` codeblock under the `# ACL Method Definitions` section.

**scope**
: The context where an action takes place (e.g., `project`, `ACL`, `session`). Can be omitted for global functions.

**action**
: What to do (e.g., `build()`, `test()`, `note()`).

**Agent**
: An AI assistant (e.g., Claude Code, Gemini CLI, GitHub Copilot) that interprets and executes ACL commands.

---

## 2. Core Concept: scope.action(details)

### Basic Structure

All ACL expressions follow a simple pattern:

```
scope.action(details)
```

**Components**:

- **scope**: Where the action takes place (optional for global functions)
- **action**: What to do
- **details**: Parameters or context (optional)

**Examples**:

```acl
fix("failing tests")           # Global function (no scope)
project.build()                # Object method
test("auth/**")                # Global with parameter
note("convention")             # Global with parameter
project.note("convention")     # Object method with parameter
```

### Variations

**Multiple parameters**:

```acl
refactor("UserService", "extract authentication")
```

**Chaining**:

```acl
project.build() && test() && project.deploy()
```

**Property access**:

```acl
fix(test().failures)
```

**Promise-like handling**:

```acl
project.deploy()
  .then("notify team")
  .catch("rollback")
  .finally("cleanup")
```

**Alert handling**:

```acl
alert("stop and analyze the issue")
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

fn think(issue): string {
  description: "Analyze issue with read-only operations; strictly forbidden to modify any files or execute commands"
  action: [
    "Use ONLY read-only tools (Read, Grep, Glob, WebFetch) to investigate",
    "Analyze the problem and provide detailed insights",
    "Present recommendations and potential solutions to user",
    "FORBIDDEN: Edit, Write, NotebookEdit, Bash, or any state-modifying operations",
    "FORBIDDEN: Making any changes to files, executing commands, or taking corrective actions",
    "REQUIRED: Wait for explicit user instruction (fix, refactor, begin, etc.) before any action"
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

fn review(target): string {
  description: "Code review; focus on analysis, never edit code"
  action: "Analyze code quality, patterns, architecture, and potential issues. Provide insights on maintainability, performance, security, and best practices. Never modify code."
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

# Read-only analysis (strictly no file modifications or command execution)
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

# Code review (analysis only, no edits)
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
    "Create PROJECT_INSTRUCTION_FILE if not exists",
    "Add '# ACL Method Definitions' section with ```acl codeblock",
    "Scan project structure for build tools (package.json scripts, Makefile, etc.)",
    "Generate initial obj and fn definitions based on detected tools",
    "Save definitions to PROJECT_INSTRUCTION_FILE's ACL Method Definitions section"
  ]
}

fn ACL.load(): void {
  description: "Load project's ACL definitions into working context"
  action: [
    "Read PROJECT_INSTRUCTION_FILE",
    "Parse ACL Method Definitions section",
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
    "Compare with existing definitions in PROJECT_INSTRUCTION_FILE",
    "Update PROJECT_INSTRUCTION_FILE's ACL Method Definitions section with changes",
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
ACL.init()                              # Setup project
ACL.load()                              # Load project ACL definitions
ACL.list()                              # See available methods
```

**ACL.list() Output Example**:

```
Available ACL Definitions:

Objects:
  project = "MCP server implementation that provides ACL support"

Global Functions:
  begin(goal): void
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
  description: "Save important information to PROJECT_INSTRUCTION_FILE"
  action: [
    "Read PROJECT_INSTRUCTION_FILE",
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
project.note("This project uses TypeScript strict mode")
project.build()
project.deploy()
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
project.note(session.insights())  # Save to project
note(session.summary())            # Save to user-level
```

**Scope**: Current conversation only

---

## 5. Chaining & Handlers

### Sequential Execution

**Operator Chaining** - Use `&&` to chain operations:

```acl
project.build() && test() && project.deploy()
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
project.deploy()
  .then("send Slack notification")
  .catch("rollback and alert team")
  .finally("update deployment log")

project.build()
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
alert("You modified the wrong file")
# → Agent immediately halts current work
# → Agent analyzes what was modified and why it's wrong
# → Agent presents analysis: "I modified config.prod.yml instead of config.dev.yml because..."
# → Agent waits for approval
# → After approval: Agent proceeds to revert/fix

alert("You don't understand the requirements")
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
project.build() && test()
# If build fails: agent stops, reports build error, does not run tests

project.build()
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

Project Level (PROJECT_INSTRUCTION_FILE)
  ↓ Project conventions, architecture
  Managed via: project.note()

Session Level (temporary)
  ↓ Current conversation insights
  Analyzed via: session.insights(), session.summary()
```

### Persistence

| Method               | File Examples                                   | Scope           | Use Case             |
| -------------------- | ----------------------------------------------- | --------------- | -------------------- |
| `note()`             | `CLAUDE.md`, `GEMINI.md`, `AGENTS.md` (user)    | All projects    | Personal preferences |
| `project.note()`     | `CLAUDE.md`, `GEMINI.md`, `AGENTS.md` (project) | Current project | Project conventions  |
| `session.insights()` | Return value                                    | Temporary       | Extract learnings    |

### Method Definitions

PROJECT_INSTRUCTION_FILE contains ACL method definitions within an `acl` codeblock:

````markdown
# ACL Method Definitions

```acl
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
```
````

**Format Requirements**:

- Must be wrapped in ` ```acl ` codeblock
- Section header: `# ACL Method Definitions`

**Management**:

- Created by `ACL.init()`
- Updated by `ACL.scan()`
- Listed by `ACL.list()`

---

## 7. Common Patterns

### Starting Tasks

```acl
begin("implement user login feature")
begin("add email validation")
begin("create order processing workflow")
```

### Quick Fixes

```acl
fix("failing tests")
fix("typescript errors")
fix(lint().errors)
```

### Safe Refactoring

```acl
refactor("auth module", "extract logic")
refactor("API routes", "consolidate error handling")
```

### Build Pipelines

```acl
project.build() && test() && project.deploy()

project.build()
  .then(test())
  .then(project.deploy())
  .catch(fix("pipeline failure"))
```

### Error Handling

```acl
project.deploy()
  .then("notify team")
  .catch("rollback")
  .finally("cleanup resources")
```

### Knowledge Capture

```acl
note("Use TypeScript strict mode")
note("Prefer composition over inheritance")
project.note("This project uses feature-based folders")
project.note(session.insights())
```

### Web Resources

```acl
fetch("https://api.github.com/repos/owner/repo")
obj apiData = fetch("https://api.example.com/metrics")
think(apiData.content)
```

### Method Composition

```acl
fix(test().failures)
refactor(lint().errors, "improve code quality")
think(project.analyze().bottlenecks)
```

### Documentation

```acl
docs("authentication module")
docs("UserService class")
docs("REST API endpoints")
```

### Custom Workflows

Define custom workflows:

```acl
fn finish(task): void {
  description: "Complete task with cleanup, tests, commit, and PR"
  action: tidyUp() && test() && git.branch(task) && git.commit(task).push() && github.pr(task)
}

# Usage
finish("add user authentication")
finish("fix login bug")
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

**Stored in INSTRUCTION_FILE:**
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

**Stored in INSTRUCTION_FILE:**
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
fn review(target): string {
  description: "Comprehensive code review with quality metrics"
  action: "Analyze code quality, patterns, architecture, and potential issues. Focus on analysis only, never edit code. Provide detailed insights on maintainability, performance, and best practices."
}
```

**Stored in INSTRUCTION_FILE:**

```acl
fn functionName(parameters): returnType {
  description: "Human-readable description"
  action: implementation
}
```

**Note**: The `obj` and `fn` keywords are the standard syntax for ACL definitions.

### INSTRUCTION_FILE Format

All definitions are stored in the ACL Method Definitions section of INSTRUCTION_FILE:

````markdown
# ACL Method Definitions

```acl
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
```
````

**Behavior**:

All definitions using `obj` and `fn` keywords are stored in INSTRUCTION_FILE's ACL Method Definitions section.

---

## 10. Operators & Keywords

### Operators

- `>` - Output redirection (apply result to target)
- `&&` - Sequential chaining (stop on failure)
- `.` - Method chaining and property access

### Reserved Keywords

- `obj` - Object declaration keyword
- `fn` - Function definition keyword
- `then(action)` - Promise success handler
- `catch(action)` - Promise error handler
- `finally(action)` - Promise cleanup handler
- `void` - Return type indicating no return value
- `any` - Return type for dynamic values
- `string`, `number`, `object`, `array` - Return type annotations

---

## 11. File Locations

| File                      | Example Locations                     | Purpose                 |
| ------------------------- | ------------------------------------- | ----------------------- |
| USER_INSTRUCTION_FILE     | `CLAUDE.md`, `GEMINI.md`, `AGENTS.md` | User-wide configuration |
| PROJECT_INSTRUCTION_FILE  | `CLAUDE.md`, `GEMINI.md`, `AGENTS.md` | Project configuration   |
| ACL definitions           | Within INSTRUCTION_FILE               | Method definitions      |

---

**Version**: 3.8
**Last Updated**: 2025-10-07
