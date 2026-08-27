import { AlertTriangle } from "lucide-react";

export function ResponsibleAINotice({ className }: { className?: string }) {
  return (
    <div
      className={
        "rounded-xl border border-border bg-surface p-4 text-surface-foreground " + (className ?? "")
      }
    >
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide">Responsible AI Notice</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            AI-generated content may contain errors or incomplete information. Always review and verify
            AI-generated information before using it for important workplace decisions or communication. Do
            not enter confidential, sensitive, or personal information.
          </p>
        </div>
      </div>
    </div>
  );
}
