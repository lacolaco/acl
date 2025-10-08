import { readFile } from "node:fs/promises";
import { findUp } from "find-up";

let cachedAclSpecification: string | null = null;

export async function getAclSpecification(): Promise<string> {
  if (cachedAclSpecification !== null) {
    return cachedAclSpecification;
  }

  const aclPath = await findUp("ACL.md");

  if (!aclPath) {
    throw new Error("ACL.md not found in directory tree");
  }

  cachedAclSpecification = await readFile(aclPath, "utf-8");
  return cachedAclSpecification;
}
