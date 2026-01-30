import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = "todo" | "in_progress" | "review" | "done" | "active" | "archived";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  todo: {
    label: "To Do",
    className: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-900/50 dark:text-slate-300 dark:border-slate-800",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  },
  review: {
    label: "Review",
    className: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  },
  done: {
    label: "Done",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
  },
  active: {
    label: "Active",
    className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
  },
  archived: {
    label: "Archived",
    className: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200",
  },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  // Normalize string to match key
  const key = status.toLowerCase() as StatusType;
  const config = statusConfig[key] || statusConfig.todo;

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium px-2.5 py-0.5 rounded-lg border", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
