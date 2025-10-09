<acl:definitions>
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
</acl:definitions>
