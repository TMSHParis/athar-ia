import type { Source } from "@/lib/types";
import { getSourceIcon, getSourceColor } from "@/lib/utils";

interface SourceBadgeProps {
  source: Source;
}

export default function SourceBadge({ source }: SourceBadgeProps) {
  const icon = getSourceIcon(source.type);
  const colorClasses = getSourceColor(source.type);

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${colorClasses}`}
      title={source.description}
    >
      <span>{icon}</span>
      <span>{source.title}</span>
    </span>
  );

  if (source.url) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-opacity hover:opacity-80"
      >
        {content}
      </a>
    );
  }

  return content;
}
