import type { Scholar, SearchableScholar, Source } from "./types";

const SHEET_ID = "16cM8b0aMSnxxbDx1C3ZRS-k2Z9jvfZE9FOQZ2jAIgR0";
// Lire uniquement l'onglet "Savant qui met en garde"
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&gid=985214318`;

// Générer un ID slug à partir d'un nom
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Parser une ligne CSV (gère les guillemets)
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Récupérer les données brutes du Google Sheet
async function fetchSheetData(): Promise<string[][]> {
  const response = await fetch(SHEET_CSV_URL, { next: { revalidate: 60 } });
  const text = await response.text();
  const lines = text.split("\n").filter((line) => line.trim());

  // Ignorer la première ligne (en-têtes)
  return lines.slice(1).map(parseCSVLine);
}

// Construire les savants à partir des lignes du Sheet
function buildScholarsFromRows(rows: string[][]): Scholar[] {
  const scholarsMap = new Map<string, Scholar>();

  for (const row of rows) {
    const [
      , // date (col A) — ignorée
      scholarFromName, // col B
      scholarToName, // col C
      summary, // col D
      sourceType, // col E
      sourceTitle, // col F
      sourceUrl, // col G
      sourceDescription, // col H
    ] = row;

    if (!scholarFromName || !scholarToName) continue;

    const cleanFrom = scholarFromName.replace(/^"|"$/g, "").trim();
    const cleanTo = scholarToName.replace(/^"|"$/g, "").trim();
    const fromId = toSlug(cleanFrom);
    const toId = toSlug(cleanTo);

    if (!fromId || !toId) continue;

    // Créer les savants s'ils n'existent pas
    if (!scholarsMap.has(fromId)) {
      scholarsMap.set(fromId, {
        id: fromId,
        name: cleanFrom,
        warnedBy: [],
        hasWarned: [],
      });
    }
    if (!scholarsMap.has(toId)) {
      scholarsMap.set(toId, {
        id: toId,
        name: cleanTo,
        warnedBy: [],
        hasWarned: [],
      });
    }

    // Construire la source
    const cleanType = (sourceType || "").replace(/^"|"$/g, "").trim().toLowerCase();
    const validTypes = ["texte", "audio", "video", "pdf"];
    const source: Source = {
      type: validTypes.includes(cleanType) ? (cleanType as Source["type"]) : "texte",
      title: (sourceTitle || "Source").replace(/^"|"$/g, "").trim(),
      url: sourceUrl?.replace(/^"|"$/g, "").trim() || undefined,
      description: sourceDescription?.replace(/^"|"$/g, "").trim() || undefined,
    };

    const cleanSummary = (summary || "").replace(/^"|"$/g, "").trim();
    const fromScholar = scholarsMap.get(fromId)!;
    const toScholar = scholarsMap.get(toId)!;

    // fromScholar met en garde toScholar
    const existingFrom = fromScholar.hasWarned.find((w) => w.scholarId === toId);
    if (existingFrom) {
      existingFrom.sources.push(source);
    } else {
      fromScholar.hasWarned.push({
        scholarId: toId,
        summary: cleanSummary,
        sources: [source],
      });
    }

    // toScholar a été mis en garde par fromScholar
    const existingTo = toScholar.warnedBy.find((w) => w.scholarId === fromId);
    if (existingTo) {
      existingTo.sources.push(source);
    } else {
      toScholar.warnedBy.push({
        scholarId: fromId,
        summary: cleanSummary,
        sources: [source],
      });
    }
  }

  return Array.from(scholarsMap.values());
}

// --- Fonctions publiques (toutes async) ---

export async function getAllScholars(): Promise<Scholar[]> {
  const rows = await fetchSheetData();
  return buildScholarsFromRows(rows);
}

export async function getScholarById(id: string): Promise<Scholar | undefined> {
  const scholars = await getAllScholars();
  return scholars.find((s) => s.id === id);
}

export async function getScholarName(id: string): Promise<string> {
  const scholar = await getScholarById(id);
  return scholar?.name ?? id;
}

export async function getScholarsForSearch(): Promise<SearchableScholar[]> {
  const scholars = await getAllScholars();
  return scholars.map((s) => ({
    id: s.id,
    name: s.name,
    nameArabic: s.nameArabic,
    warnedByCount: s.warnedBy.length,
    hasWarnedCount: s.hasWarned.length,
  }));
}
