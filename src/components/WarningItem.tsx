import Link from "next/link";
import type { Warning } from "@/lib/types";
import SourceBadge from "./SourceBadge";

interface WarningItemProps {
  warning: Warning;
  scholarName: string;
  colorType: "warnedBy" | "hasWarned";
}

export default function WarningItem({ warning, scholarName, colorType }: WarningItemProps) {
  const isWarnedBy = colorType === "warnedBy";
  const nameColor = isWarnedBy
    ? "text-foreground dark:text-accent hover:text-foreground/80 dark:hover:text-accent/80"
    : "text-accent dark:text-foreground hover:text-accent/80 dark:hover:text-foreground/80";

  return (
    <div className="border-b border-border py-4 last:border-b-0">
      <Link
        href={`/scholar/${warning.scholarId}`}
        className={`text-base font-semibold transition-colors ${nameColor}`}
      >
        {scholarName}
      </Link>
      <p className="mt-1 text-sm text-muted">{warning.summary}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {warning.sources.map((source, index) => (
          <SourceBadge key={index} source={source} />
        ))}
      </div>
    </div>
  );
}
