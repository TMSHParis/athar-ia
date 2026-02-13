// Identifiant unique d'un savant, utilisé comme slug dans l'URL
export type ScholarId = string;

// Une source prouvant l'existence d'une mise en garde
export interface Source {
  type: "texte" | "audio" | "video" | "pdf";
  title: string;
  url?: string;
  description?: string;
}

// Une mise en garde entre deux savants
export interface Warning {
  scholarId: ScholarId;
  summary: string;
  sources: Source[];
}

// Profil d'un savant
export interface Scholar {
  id: ScholarId;
  name: string;
  nameArabic?: string;
  bio?: string;
  birthYear?: number;
  deathYear?: number;
  country?: string;
  warnedBy: Warning[];
  hasWarned: Warning[];
}

// Version allégée pour la recherche
export interface SearchableScholar {
  id: ScholarId;
  name: string;
  nameArabic?: string;
  warnedByCount: number;
  hasWarnedCount: number;
}
