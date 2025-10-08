import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findUp } from "find-up";

let cachedAclSpecification: string | null = null;

function getDirname() {
  // tsup shims `import.meta.url` for CJS output, so this works in both CJS and ESM.
  return path.dirname(fileURLToPath(import.meta.url));
}

export async function getAclSpecification(): Promise<string> {
  if (cachedAclSpecification !== null) {
    return cachedAclSpecification;
  }

  const aclPath = await findUp("ACL.md", { cwd: getDirname() });

  if (!aclPath) {
    throw new Error("ACL.md not found in directory tree");
  }

  cachedAclSpecification = await readFile(aclPath, "utf-8");
  return cachedAclSpecification;
}
