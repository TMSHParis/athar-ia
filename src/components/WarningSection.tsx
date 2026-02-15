import type { Warning } from "@/lib/types";
import WarningItem from "./WarningItem";

interface WarningSectionProps {
  title: string;
  warnings: Warning[];
  scholarNames: Record<string, string>;
  colorType: "warnedBy" | "hasWarned";
}

export default function WarningSection({
  title,
  warnings,
  scholarNames,
  colorType,
}: WarningSectionProps) {
  const isWarnedBy = colorType === "warnedBy";
  const titleColor = isWarnedBy
    ? "text-foreground dark:text-accent"
    : "text-accent dark:text-foreground";
  const bgColor = isWarnedBy
    ? "bg-foreground/10 dark:bg-accent/20"
    : "bg-accent/20 dark:bg-foreground/10";

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h2 className={`flex items-center gap-2 text-lg font-bold ${titleColor}`}>
        <span>{title}</span>
        <span className={`ml-auto rounded-full ${bgColor} px-2.5 py-0.5 text-sm font-medium`}>
          {warnings.length}
        </span>
      </h2>
      {warnings.length > 0 ? (
        <div className="mt-4">
          {warnings.map((warning, index) => (
            <WarningItem
              key={index}
              warning={warning}
              scholarName={scholarNames[warning.scholarId] ?? warning.scholarId}
              colorType={colorType}
            />
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
