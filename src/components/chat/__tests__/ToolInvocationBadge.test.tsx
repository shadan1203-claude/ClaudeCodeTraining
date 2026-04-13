import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";
import type { ToolInvocation } from "ai";

function makeInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state: "call" | "result" = "result"
): ToolInvocation {
  if (state === "result") {
    return {
      state: "result",
      toolCallId: "test-id",
      toolName,
      args,
      result: "Success",
    };
  }
  return {
    state: "call",
    toolCallId: "test-id",
    toolName,
    args,
  };
}

test("shows 'Creating file' label for str_replace_editor create command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "create",
        path: "src/components/Card.tsx",
      })}
    />
  );

  expect(screen.getByText("Creating file: Card.tsx")).toBeDefined();
});

test("shows 'Editing file' label for str_replace_editor str_replace command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "str_replace",
        path: "src/components/Button.tsx",
      })}
    />
  );

  expect(screen.getByText("Editing file: Button.tsx")).toBeDefined();
});

test("shows 'Editing file' label for str_replace_editor insert command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "insert",
        path: "src/app/page.tsx",
      })}
    />
  );

  expect(screen.getByText("Editing file: page.tsx")).toBeDefined();
});

test("shows 'Reading file' label for str_replace_editor view command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "view",
        path: "src/lib/utils.ts",
      })}
    />
  );

  expect(screen.getByText("Reading file: utils.ts")).toBeDefined();
});

test("shows 'Undoing edit' label for str_replace_editor undo_edit command", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "undo_edit",
        path: "src/components/Form.tsx",
      })}
    />
  );

  expect(screen.getByText("Undoing edit: Form.tsx")).toBeDefined();
});

test("falls back to full path as filename when path has no slashes", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "create",
        path: "index.tsx",
      })}
    />
  );

  expect(screen.getByText("Creating file: index.tsx")).toBeDefined();
});

test("falls back to 'Processing file' when command is unknown", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "unknown_command",
        path: "src/components/Foo.tsx",
      })}
    />
  );

  expect(screen.getByText("Processing file: Foo.tsx")).toBeDefined();
});

test("shows tool name for non-str_replace_editor tools", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("web_search", { query: "react hooks" })}
    />
  );

  expect(screen.getByText("web_search")).toBeDefined();
});

test("shows green dot when state is result (complete)", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation(
        "str_replace_editor",
        { command: "create", path: "src/components/Card.tsx" },
        "result"
      )}
    />
  );

  const greenDot = container.querySelector(".bg-emerald-500");
  expect(greenDot).toBeDefined();
});

test("shows spinner when state is call (in progress)", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation(
        "str_replace_editor",
        { command: "create", path: "src/components/Card.tsx" },
        "call"
      )}
    />
  );

  const spinner = container.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
});

test("handles missing path gracefully", () => {
  render(
    <ToolInvocationBadge
      toolInvocation={makeInvocation("str_replace_editor", {
        command: "create",
      })}
    />
  );

  expect(screen.getByText("Creating file: file")).toBeDefined();
});
