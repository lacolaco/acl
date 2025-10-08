import { describe, it, expect } from "vitest";
import { helloTool } from "./hello.js";

describe("helloTool", () => {
  it("should have correct tool definition", () => {
    expect(helloTool.name).toBe("hello");
    expect(helloTool.config.title).toBe("Hello Tool");
    expect(helloTool.config.description).toBe("Says hello");
    expect(helloTool.config.inputSchema).toBeDefined();
  });

  it("should return greeting message", async () => {
    const result = await helloTool.callback({ name: "World" });

    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toEqual({
      type: "text",
      text: "Hello, World!",
    });
  });

  it("should handle different names", async () => {
    const result = await helloTool.callback({ name: "Alice" });

    expect(result.content[0]).toEqual({
      type: "text",
      text: "Hello, Alice!",
    });
  });
});
