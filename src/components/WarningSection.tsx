import type { Warning } from "@/lib/types";
import WarningItem from "./WarningItem";

interface WarningSectionProps {
  title: string;
  warnings: Warning[];
  icon: string;
}

export default function WarningSection({
  title,
  warnings,
  icon,
}: WarningSectionProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
        <span>{icon}</span>
        <span>{title}</span>
        <span className="ml-auto rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
          {warnings.length}
        </span>
      </h2>
      {warnings.length > 0 ? (
        <div className="mt-4">
          {warnings.map((warning, index) => (
            <WarningItem key={index} warning={warning} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">
          Aucune mise en garde enregistrée.
        </p>
      )}
    </div>
  );
}
