import Link from "next/link";
import type { SearchableScholar } from "@/lib/types";

interface ScholarCardProps {
  scholar: SearchableScholar;
}

export default function ScholarCard({ scholar }: ScholarCardProps) {
  return (
    <Link
      href={`/scholar/${scholar.id}`}
      className="block rounded-lg border border-border bg-surface p-4 transition-all hover:border-primary-light hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">{scholar.name}</h3>
          {scholar.nameArabic && (
            <p className="mt-0.5 font-arabic text-sm text-muted" dir="rtl">
              {scholar.nameArabic}
            </p>
          )}
        </div>
        <div className="flex shrink-0 gap-2 text-xs">
          {scholar.warnedByCount > 0 && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-red-700">
              {scholar.warnedByCount} reçue{scholar.warnedByCount > 1 ? "s" : ""}
            </span>
          )}
          {scholar.hasWarnedCount > 0 && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">
              {scholar.hasWarnedCount} émise{scholar.hasWarnedCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
