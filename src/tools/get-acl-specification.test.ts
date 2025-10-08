import { describe, it, expect } from "vitest";
import { getAclSpecificationTool } from "./get-acl-specification.js";

describe("getAclSpecificationTool", () => {
  it("should have correct tool definition", () => {
    expect(getAclSpecificationTool.name).toBe("get_acl_specification");
    expect(getAclSpecificationTool.config.title).toBe("Get ACL Specification");
    expect(getAclSpecificationTool.config.description).toContain(
      "Agent Communication Language",
    );
    expect(getAclSpecificationTool.config.inputSchema).toEqual({});
  });

  it("should return ACL specification content", async () => {
    const result = await getAclSpecificationTool.callback();

    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toHaveProperty("type", "text");
    expect(result.content[0]).toHaveProperty("text");

    if (result.content[0].type === "text") {
      const text = result.content[0].text;
      expect(text).toContain("Agent Communication Language (ACL)");
      expect(text).toContain("Language Specification");
      expect(text).toContain("## 1. Introduction");
    }
  });

  it("should read ACL.md from project root", async () => {
    const result = await getAclSpecificationTool.callback();

    if (result.content[0].type === "text") {
      // Verify it contains typical ACL spec sections
      const text = result.content[0].text;
      expect(text).toContain("Built-in Objects");
      expect(text).toContain("agent");
      expect(text).toContain("project");
      expect(text).toContain("session");
    }
  });
});
