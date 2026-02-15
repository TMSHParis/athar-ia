import { notFound } from "next/navigation";
import { getAllScholars, getScholarById } from "@/lib/data";
import { formatYears } from "@/lib/utils";
import WarningSection from "@/components/WarningSection";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const scholar = await getScholarById(id);
  if (!scholar) return { title: "Savant introuvable" };

  return {
    title: scholar.name,
    description: `${scholar.name} — Mis en garde par ${scholar.warnedBy.length} savant${scholar.warnedBy.length > 1 ? "s" : ""}, a mis en garde contre ${scholar.hasWarned.length} savant${scholar.hasWarned.length > 1 ? "s" : ""}.`,
  };
}

export default async function ScholarPage({ params }: PageProps) {
  const { id } = await params;
  const [scholar, allScholars] = await Promise.all([
    getScholarById(id),
    getAllScholars(),
  ]);

  if (!scholar) {
    notFound();
  }

  // Créer un map id → nom pour les composants enfants
  const scholarNames: Record<string, string> = {};
  for (const s of allScholars) {
    scholarNames[s.id] = s.name;
  }

  const years = formatYears(scholar.birthYear, scholar.deathYear);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        ← Retour à la recherche
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-bold text-foreground">{scholar.name}</h1>
        {scholar.nameArabic && (
          <p className="mt-1 font-arabic text-xl text-muted" dir="rtl">
            {scholar.nameArabic}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
          {years && <span>{years}</span>}
          {scholar.country && (
            <>
              {years && <span>·</span>}
              <span>{scholar.country}</span>
            </>
          )}
        </div>

        {scholar.bio && (
          <p className="mt-4 text-base leading-relaxed text-foreground/80">
            {scholar.bio}
          </p>
        )}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <WarningSection
          title="A été mis en garde par"
          warnings={scholar.warnedBy}
          scholarNames={scholarNames}
          icon="⚫"
        />
        <WarningSection
          title="A mis en garde contre"
          warnings={scholar.hasWarned}
          scholarNames={scholarNames}
          icon="⭐"
        />
      </div>
    </div>
  );
}
