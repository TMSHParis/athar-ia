// Icône selon le type de source
export function getSourceIcon(type: string): string {
  switch (type) {
    case "texte":
      return "📄";
    case "audio":
      return "🎧";
    case "video":
      return "🎬";
    case "pdf":
      return "📕";
    default:
      return "📎";
  }
}

// Couleur CSS selon le type de source (compatible dark mode)
export function getSourceColor(type: string): string {
  switch (type) {
    case "texte":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    case "audio":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "video":
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    case "pdf":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
  }
}

// Formater les années (naissance - décès)
export function formatYears(birthYear?: number, deathYear?: number): string {
  if (!birthYear) return "";
  if (deathYear) return `${birthYear} - ${deathYear}`;
  return `Né en ${birthYear}`;
}
