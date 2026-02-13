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

// Couleur CSS selon le type de source
export function getSourceColor(type: string): string {
  switch (type) {
    case "texte":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "audio":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "video":
      return "bg-red-50 text-red-700 border-red-200";
    case "pdf":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

// Formater les années (naissance - décès)
export function formatYears(birthYear?: number, deathYear?: number): string {
  if (!birthYear) return "";
  if (deathYear) return `${birthYear} - ${deathYear}`;
  return `Né en ${birthYear}`;
}
