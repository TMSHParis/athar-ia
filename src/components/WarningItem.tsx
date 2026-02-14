import Link from "next/link";
import type { Warning } from "@/lib/types";
import SourceBadge from "./SourceBadge";

interface WarningItemProps {
  warning: Warning;
  scholarName: string;
}

export default function WarningItem({ warning, scholarName }: WarningItemProps) {
  return (
    <div className="border-b border-border py-4 last:border-b-0">
      <Link
        href={`/scholar/${warning.scholarId}`}
        className="text-base font-semibold text-primary-light transition-colors hover:text-primary"
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
