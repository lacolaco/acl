# Agent Communication Language (ACL)
## Language Specification v1.0

---

## 1. Introduction

### 1.1 Purpose
Agent Communication Language (ACL) is a Domain-Specific Language (DSL) designed for concise, precise, and structured communication with AI agents. It provides a programming-oriented syntax for instructing agents to perform actions on objects and systems within a development environment.

### 1.2 Core Principle: Contextual Flexibility

**ACL embraces contextual interpretation over strict formalism.**

While ACL provides structured syntax and well-defined objects, it fundamentally prioritizes **user intent and contextual understanding**. When faced with undefined objects or methods, the agent must:

1. **Interpret from context first** - Leverage conversation history, project state, and domain knowledge
2. **Infer reasonable meanings** - Make intelligent assumptions based on available information
3. **Resort to errors last** - Only fail when context provides no interpretive pathway

This principle distinguishes ACL from traditional programming languages: **flexibility through context, not rigidity through definition**.

### 1.3 Design Goals
- **Brevity**: Minimize verbosity while maintaining clarity
- **Precision**: Unambiguous command specification
- **Composability**: Enable complex workflows through simple primitives
- **Persistence**: Support knowledge retention across sessions and projects
- **Discoverability**: Auto-generate project-specific commands
- **Flexibility**: Interpret undefined elements from context when possible

### 1.4 Scope
ACL is intended for:
- Development workflow automation
- Agent behavior control
- Knowledge management and persistence
- Project-specific command abstraction

---

## 2. Lexical Structure

### 2.1 Identifiers
- Object names: `[a-zA-Z_][a-zA-Z0-9_]*`
- Method names: `[a-zA-Z_][a-zA-Z0-9_]*`

### 2.2 Literals
- **String**: `"text"` or `'text'`
- **Number**: `123`, `3.14`
- **Boolean**: `true`, `false`
- **Array**: `[item1, item2, ...]`
- **Object**: `{ key: value, ... }`

### 2.3 Comments
```acl
# Single-line comment
```

### 2.4 Reserved Operators
- `:=` - Assignment/Declaration
- `&&` - Sequential execution (AND)
- `.` - Member access

---

## 3. Syntax

### 3.1 Method Invocation
```ebnf
method_call ::= object "." method "(" [arguments] ")"
arguments   ::= expression ("," expression)*
expression  ::= literal | identifier | method_call
```

**Example**:
```acl
app.serve()
chrome.inspect(app)
project.note("convention")
```

### 3.2 Object Declaration
```ebnf
declaration ::= identifier ":=" expression
```

**Example**:
```acl
api := server.new("http://localhost:3000")
postgres := db.connect("postgresql://localhost/mydb")
```

### 3.3 Method Definition
```ebnf
method_def ::= object_name ":" "{" method_list "}"
method_list ::= method_name ":" definition ("," method_name ":" definition)*
definition ::= exec_command | prompt_command | method_composition
exec_command ::= "exec" "(" shell_command ["," options] ")"
prompt_command ::= string | natural_language_instruction
method_composition ::= method_call ("&&" method_call)*
```

**Definition Types**:
1. **Shell Execution**: `exec("command")` - Execute shell command directly
2. **Prompt/Instruction**: Any string or natural language - Agent interprets and executes
3. **Method Composition**: Combine existing methods with `&&`

**Examples**:
```acl
project: {
  # Shell execution
  build: exec("pnpm run build")
  test: exec("pnpm test")
  dev: exec("pnpm run dev", { cwd: "./frontend" })

  # Prompt-based definition (flexible interpretation)
  fix: "Fix failed tests and run them again"
  optimize: "Analyze and optimize bundle size"

  # Method composition
  verify: project.build && project.test
  release: project.build && project.test && project.deploy
}
```

### 3.4 Command Chaining
```ebnf
chain ::= method_call ("&&" method_call)*
```

**Example**:
```acl
app.serve() && chrome.inspect(app)
project.build() && project.test() && project.deploy()
```

### 3.5 Method Composition
```ebnf
composition ::= method_call "(" method_call ")"
```

**Example**:
```acl
project.note(session.insights())
agent.note(session.insights())
```

---

## 4. Type System

### 4.1 Built-in Types
- `String`: Text data
- `Number`: Numeric values
- `Boolean`: `true` or `false`
- `Array`: Ordered collection
- `Object`: Key-value pairs
- `Void`: No return value

### 4.2 Object Types

#### 4.2.1 Special Objects (Always Available)
- `agent` - Agent control and user-level knowledge management
- `project` - Project context and project-level knowledge management
- `session` - Session context and analysis

#### 4.2.2 Standard Objects (Context-Dependent)
- `app` - Application control
- `chrome`/`browser` - Browser and DevTools
- `server` - Server operations
- `db` - Database operations
- `test` - Testing operations

#### 4.2.3 User-Defined Objects
Objects declared via `:=` operator

---

## 5. Built-in Objects

### 5.1 `agent` Object

**Type**: Special (Always Available)

**Purpose**: Control AI agent behavior and manage user-level persistent knowledge

**Methods**:
| Method | Signature | Description |
|--------|-----------|-------------|
| `retry()` | `() -> Void` | Retry last failed or interrupted operation |
| `note(message)` | `(String) -> Void` | Save to user-level CLAUDE.md (`~/.claude/CLAUDE.md`) |

**Properties**:
| Property | Type | Description |
|----------|------|-------------|
| `state` | `String` | Current state: `running`, `paused`, `idle` |
| `context` | `Object` | Current conversation context |

**Persistence**:
- `agent.note(message)` → `~/.claude/CLAUDE.md`
- Scope: All projects for current user
- Use for: Personal preferences, coding standards

### 5.2 `project` Object

**Type**: Special (Always Available)

**Purpose**: Manage project context and project-level persistent knowledge

**Core Methods**:
| Method | Signature | Description |
|--------|-----------|-------------|
| `init()` | `() -> Void` | Initialize project, scan build system, generate methods |
| `update()` | `() -> Void` | Re-scan and update method definitions |
| `note(message)` | `(String) -> Void` | Save to project-level CLAUDE.md (`.claude/CLAUDE.md`) |

**Dynamic Methods** (Generated by `init()`/`update()`):
- `build()` - Execute build command
- `test()` - Execute test command
- `lint()` - Execute lint command
- `dev()` - Execute dev server
- `deploy()` - Execute deployment
- And more... (project-specific)

**Properties**:
| Property | Type | Description |
|----------|------|-------------|
| `name` | `String` | Project name |
| `root` | `String` | Project root directory |
| `config` | `Object` | Project configuration |
| `methods` | `Array<String>` | Available method names |

**Persistence**:
- `project.note(message)` → `.claude/CLAUDE.md`
- Scope: Current project only
- Use for: Project conventions, architecture decisions

**Method Generation**:
1. `project.init()` initializes `.claude/CLAUDE.md`:
   - Creates file if it doesn't exist
   - Adds ACL definition section with placeholder:
     ```acl
     # ACL Method Definitions
     project: {}
     ```

2. Scans project for commands:
   - `package.json` scripts
   - `Makefile` targets
   - `justfile` recipes
   - `Taskfile.yml` tasks

3. Populates method definitions in `.claude/CLAUDE.md`:
   ```acl
   # ACL Method Definitions
   project: {
     build: exec("pnpm run build")
     test: exec("pnpm test")
     lint: exec("pnpm run lint")
   }
   ```

4. Methods become available: `project.build()`, `project.test()`, etc.

**ACL Definition Area**:
The `# ACL Method Definitions` section in `.claude/CLAUDE.md` serves as the designated area for method definitions. This area is:
- Created by `project.init()`
- Updated by `project.update()`
- Reserved for ACL syntax (not Markdown)
- Starts with placeholder `project: {}`
- Expanded as methods are discovered

### 5.3 `session` Object

**Type**: Special (Always Available)

**Purpose**: Analyze and extract information from current conversation session

**Methods**:
| Method | Signature | Description |
|--------|-----------|-------------|
| `summary()` | `() -> String` | Generate session summary |
| `insights()` | `() -> String` | Extract actionable insights from session |

**Properties**:
| Property | Type | Description |
|----------|------|-------------|
| `id` | `String` | Unique session identifier |
| `duration` | `Number` | Session duration (seconds) |
| `objects` | `Array<String>` | Declared object names |

---

## 6. Standard Objects

### 6.1 `app` Object
**Purpose**: Application control

**Methods**:
- `serve()` - Start application server
- `setupRoutes(routes)` - Configure routing
- `build()` - Build application
- `test()` - Run tests

### 6.2 `chrome`/`browser` Object
**Purpose**: Browser and DevTools operations

**Methods**:
- `inspect(target)` - Open DevTools
- `open(url)` - Open URL in browser

### 6.3 `server` Object
**Purpose**: Server operations

**Methods**:
- `start(port?)` - Start server
- `stop()` - Stop server
- `restart()` - Restart server

### 6.4 `db` Object
**Purpose**: Database operations

**Methods**:
- `connect(config?)` - Connect to database
- `migrate()` - Run migrations
- `seed()` - Seed database

### 6.5 `test` Object
**Purpose**: Testing operations

**Methods**:
- `run(pattern?)` - Run tests
- `watch()` - Watch mode
- `coverage()` - Generate coverage

---

## 7. Execution Model

### 7.1 Execution Order
1. **Parse**: Tokenize and parse ACL command
2. **Validate**: Check object/method existence
3. **Resolve**: Resolve undefined objects from context
4. **Execute**: Execute command(s) sequentially (if chained)
5. **Return**: Return result or void

### 7.2 Sequential Execution
Commands chained with `&&` execute left-to-right:
```acl
project.build() && project.test() && project.deploy()
# Executes: build → test → deploy
```

### 7.3 Context Preservation
- Object references maintain state across chains
- Declared objects persist within session
- Method definitions persist in CLAUDE.md files

### 7.4 Object Resolution

**Principle of Contextual Interpretation**:
ACL prioritizes flexibility and user intent over strict definitions. When an object or method is undefined, the agent **MUST** attempt contextual interpretation before raising errors.

**Resolution Process**:
1. **Context Inference** (Primary):
   - Analyze conversation history for object/method meaning
   - Check for implicit definitions or references
   - Infer from project structure and environment
   - Consider domain-specific conventions

2. **Similarity Matching** (Secondary):
   - Check for typos and near-matches
   - Suggest closest defined objects/methods
   - Consider common aliases (e.g., `browser` ↔ `chrome`)

3. **Error Handling** (Last Resort):
   - Only raise error if context provides no clues
   - Provide helpful suggestions based on available objects
   - Guide user toward correction or clarification

**Examples of Contextual Interpretation**:

```acl
# User mentions "I'm working on the frontend app"
frontend.build()
# → Agent infers: frontend := app.new("./frontend")
#    Executes build for frontend context

# User has been discussing database migrations
db.run()
# → Agent infers: db.run() likely means db.migrate()
#    Based on conversation context

# User added "deploy" script to package.json
project.deploy()
# → Agent infers: Even without project.init(), recognizes new script
#    Auto-generates: project.deploy := exec("npm run deploy")
```

**Contextual Clues**:
- Recent conversation topics
- Files/directories mentioned
- Commands executed in session
- Project configuration changes
- Domain-specific terminology

---

## 8. Error Handling

### 8.1 Undefined Object Error

**Format**:
```
ACL Error: Undefined object '<object_name>'

The object '<object_name>' is not defined in the current context.

Built-in objects (always available):
- agent (Agent control - special)
- project (Project context - special)
- session (Session context - special)

Standard objects:
- app (Application control)
- chrome/browser (Browser operations)
- server (Server operations)
- db (Database operations)
- test (Testing operations)

Did you mean: [suggestions based on similarity]
```

**Resolution**:
1. Agent attempts context inference
2. Agent checks for similar names
3. If unable to resolve, return error with suggestions
4. User corrects object name or uses natural language

**Example**:
```acl
deployment.start()
→ ACL Error: Undefined object 'deployment'
  Available objects: app, agent, chrome, server, db, test
  Did you mean: server.start() or app.start()?
```

---

## 9. Common Patterns

### 9.1 Start and Inspect
```acl
app.serve() && chrome.inspect(app)
```
Launch application and open debugging tools

### 9.2 Configure and Execute
```acl
app.setupRoutes([root, admin]) && app.serve()
```
Apply configuration before execution

### 9.3 Knowledge Persistence (User-Level)
```acl
agent.note("Components don't need the -component suffix")
```
Save user-wide preferences to `~/.claude/CLAUDE.md`

### 9.4 Knowledge Persistence (Project-Level)
```acl
project.note("This project uses feature-based folder structure")
```
Save project-specific conventions to `.claude/CLAUDE.md`

### 9.5 Session Insights to Knowledge Base
```acl
project.note(session.insights())  # Project-specific learnings
agent.note(session.insights())    # User-wide learnings
```
Extract and persist session learnings

### 9.6 Project Initialization
```acl
project.init()
project.build() && project.test()
```
Auto-generate and use project methods

### 9.7 Update Project Methods
```acl
project.update()
project.e2e()  # Newly added method
```
Refresh methods after build system changes

---

## 10. Knowledge Management

### 10.1 Knowledge Hierarchy

```
User Level (~/.claude/CLAUDE.md)
  ↓ applies to all projects
  Personal preferences, coding standards
  Managed via: agent.note()

Project Level (.claude/CLAUDE.md)
  ↓ applies to current project
  Project conventions, architecture
  Managed via: project.note()

Session Level (temporary)
  ↓ current conversation only
  Analyzed via: session.insights(), session.summary()
```

### 10.2 Persistence Rules

| Method | Target File | Scope | Use Case |
|--------|-------------|-------|----------|
| `agent.note()` | `~/.claude/CLAUDE.md` | All projects | Personal preferences |
| `project.note()` | `.claude/CLAUDE.md` | Current project | Project conventions |
| `session.insights()` | Return value | Temporary | Extract learnings |
| `session.summary()` | Return value | Temporary | Session overview |

### 10.3 Method Definition Storage

**File Structure**:
`.claude/CLAUDE.md` contains both human-readable documentation and ACL definitions:

```markdown
# Project Context

[Human-readable project documentation, conventions, etc.]

# ACL Method Definitions
project: {
  build: exec("pnpm run build")
  test: exec("pnpm test")
  lint: exec("pnpm run lint", { cwd: "./src" })
}
```

**ACL Definition Area Rules**:
1. **Initialization**: `project.init()` creates:
   ```acl
   # ACL Method Definitions
   project: {}
   ```

2. **Expansion**: Methods are added as discovered:
   ```acl
   # ACL Method Definitions
   project: {
     build: exec("pnpm run build")
     test: exec("pnpm test")
   }
   ```

3. **Updates**: `project.update()` modifies this section, preserving structure

4. **Separation**: ACL syntax section is distinct from Markdown documentation

---

## 11. Object Lifecycle

### 11.1 Declaration
```acl
objectName := <definition>
```

### 11.2 Method Definition
```acl
objectName: {
  methodName: exec("command")
}
```

### 11.3 Usage
```acl
objectName.methodName()
```

### 11.4 Scope
- Objects persist within current session
- Methods persist in CLAUDE.md files
- Built-in objects always available

---

## 12. Advanced Features

### 12.1 Method Options

**Working Directory**:
```acl
project: {
  dev: exec("pnpm run dev", { cwd: "./frontend" })
}
```

**Environment Variables**:
```acl
myApp: {
  deploy: exec("./deploy.sh", { env: { ENV: "production" } })
}
```

### 12.2 Method Composition
```acl
# Pass method results as arguments
project.note(session.insights())
agent.note(session.summary())

# Store results
insights := session.insights()
project.note(insights)
```

### 12.3 Conditional Workflows
```acl
project.build() && project.test() && project.deploy()
# deploy only executes if build and test succeed
```

---

## 13. Best Practices

### 13.1 When to Use ACL
- ✅ Quick workflow execution
- ✅ Combining multiple operations
- ✅ Saving persistent preferences
- ✅ Controlling agent behavior
- ✅ Project-specific automation

### 13.2 When to Use Natural Language
- ✅ Complex explanations
- ✅ Exploratory questions
- ✅ Tasks requiring judgment
- ✅ Unclear command mapping

### 13.3 Naming Conventions
- Use camelCase for method names: `buildAndTest()`
- Use lowercase for object names: `myapp`, `postgres`
- Be descriptive but concise

### 13.4 Knowledge Management
- Use `agent.note()` for universal preferences
- Use `project.note()` for project-specific rules
- Call `project.update()` after changing build scripts
- Extract insights with `session.insights()` at end of work

---

## 14. Comparison with Natural Language

| Aspect | ACL | Natural Language |
|--------|-----|------------------|
| **Verbosity** | Low | High |
| **Precision** | High | Variable |
| **Learning Curve** | Medium | Low |
| **Flexibility** | Structured | Open-ended |
| **Execution Speed** | Fast | Slower |
| **Best For** | Automation | Communication |
| **Ambiguity** | None | Possible |
| **Composability** | High | Low |

---

## 15. Future Extensions (Proposed)

- **Conditional execution**: `if condition then command`
- **Variable binding**: `result := command()`
- **Loops**: `for item in items do command`
- **Pipelines**: `command1 | command2`
- **Error handling**: `try command catch handler`
- **Object destruction**: `destroy objectName`
- **Object inspection**: `inspect objectName`
- **Async execution**: `async command`

---

## Appendix A: Grammar (EBNF)

```ebnf
program        ::= statement*
statement      ::= declaration | method_call | method_def | chain
declaration    ::= identifier ":=" expression
method_call    ::= object "." method "(" [arguments] ")"
method_def     ::= identifier ":" "{" method_list "}"
method_list    ::= method_name ":" definition ("," method_name ":" definition)*
definition     ::= "exec" "(" string ["," options] ")"
chain          ::= method_call ("&&" method_call)*
arguments      ::= expression ("," expression)*
expression     ::= literal | identifier | method_call
literal        ::= string | number | boolean | array | object
options        ::= "{" key_value ("," key_value)* "}"
key_value      ::= identifier ":" expression
identifier     ::= [a-zA-Z_][a-zA-Z0-9_]*
string         ::= '"' .* '"' | "'" .* "'"
number         ::= [0-9]+ ("." [0-9]+)?
boolean        ::= "true" | "false"
array          ::= "[" [expression ("," expression)*] "]"
object         ::= "{" [key_value ("," key_value)*] "}"
```

---

## Appendix B: Reserved Keywords

- `exec` - Command execution
- `true` - Boolean true
- `false` - Boolean false

---

## Appendix C: File Locations

| File | Location | Purpose |
|------|----------|---------|
| User-level CLAUDE.md | `~/.claude/CLAUDE.md` | User-wide agent configuration |
| Project-level CLAUDE.md | `.claude/CLAUDE.md` | Project-specific agent configuration |
| ACL definitions | Within CLAUDE.md files | Method definitions |

---

**Version**: 1.0
**Last Updated**: 2025-10-05
