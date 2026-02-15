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

// Couleur CSS selon le type de source (compatible dark mode, theme-aware)
export function getSourceColor(type: string): string {
  switch (type) {
    case "texte":
      return "bg-accent/20 text-accent dark:bg-accent/20 dark:text-accent border-accent/30";
    case "audio":
      return "bg-accent/15 text-accent dark:bg-accent/15 dark:text-accent border-accent/25";
    case "video":
      return "bg-foreground/10 text-foreground dark:bg-accent/20 dark:text-accent border-foreground/20 dark:border-accent/30";
    case "pdf":
      return "bg-accent/20 text-accent dark:bg-foreground/10 dark:text-foreground border-accent/30 dark:border-foreground/20";
    default:
      return "bg-accent/10 text-accent dark:bg-accent/10 dark:text-accent border-accent/20";
  }
}

// Formater les années (naissance - décès)
export function formatYears(birthYear?: number, deathYear?: number): string {
  if (!birthYear) return "";
  if (deathYear) return `${birthYear} - ${deathYear}`;
  return `Né en ${birthYear}`;
}
