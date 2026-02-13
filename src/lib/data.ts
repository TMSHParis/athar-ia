import scholarsData from "@/data/scholars.json";
import type { Scholar, SearchableScholar } from "./types";

// Charger tous les savants
export function getAllScholars(): Scholar[] {
  return scholarsData as Scholar[];
}

// Trouver un savant par son identifiant
export function getScholarById(id: string): Scholar | undefined {
  return getAllScholars().find((s) => s.id === id);
}

// Obtenir le nom d'un savant par son identifiant
export function getScholarName(id: string): string {
  const scholar = getScholarById(id);
  return scholar?.name ?? id;
}

// Version allégée pour la recherche côté client
export function getScholarsForSearch(): SearchableScholar[] {
  return getAllScholars().map((s) => ({
    id: s.id,
    name: s.name,
    nameArabic: s.nameArabic,
    warnedByCount: s.warnedBy.length,
    hasWarnedCount: s.hasWarned.length,
  }));
}
