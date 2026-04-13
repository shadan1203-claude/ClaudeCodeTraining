import { Loader2, FilePlus, FilePen, FileSearch, Undo2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface StrReplaceEditorArgs {
  command?: "view" | "create" | "str_replace" | "insert" | "undo_edit";
  path?: string;
}

function getFileName(path: string): string {
  return path.split("/").pop() || path;
}

function getStrReplaceLabel(args: StrReplaceEditorArgs): {
  label: string;
  icon: React.ReactNode;
} {
  const fileName = args.path ? getFileName(args.path) : "file";

  switch (args.command) {
    case "create":
      return {
        label: `Creating file: ${fileName}`,
        icon: <FilePlus className="w-3 h-3" />,
      };
    case "str_replace":
    case "insert":
      return {
        label: `Editing file: ${fileName}`,
        icon: <FilePen className="w-3 h-3" />,
      };
    case "view":
      return {
        label: `Reading file: ${fileName}`,
        icon: <FileSearch className="w-3 h-3" />,
      };
    case "undo_edit":
      return {
        label: `Undoing edit: ${fileName}`,
        icon: <Undo2 className="w-3 h-3" />,
      };
    default:
      return {
        label: `Processing file: ${fileName}`,
        icon: <FilePen className="w-3 h-3" />,
      };
  }
}

interface ToolInvocationBadgeProps {
  toolInvocation: ToolInvocation;
}

export function ToolInvocationBadge({ toolInvocation }: ToolInvocationBadgeProps) {
  const isComplete = toolInvocation.state === "result";

  let label: string;
  let icon: React.ReactNode;

  if (toolInvocation.toolName === "str_replace_editor") {
    const result = getStrReplaceLabel(toolInvocation.args as StrReplaceEditorArgs);
    label = result.label;
    icon = result.icon;
  } else {
    label = toolInvocation.toolName;
    icon = null;
  }

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      {icon && (
        <span className="text-neutral-500 flex-shrink-0">{icon}</span>
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
