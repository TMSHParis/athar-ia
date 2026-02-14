"use client";

import { useState, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import type { SearchableScholar } from "@/lib/types";
import ScholarCard from "./ScholarCard";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [scholars, setScholars] = useState<SearchableScholar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/scholars")
      .then((res) => res.json())
      .then((data: SearchableScholar[]) => {
        setScholars(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(scholars, {
        keys: ["name", "nameArabic"],
        threshold: 0.3,
        minMatchCharLength: 2,
      }),
    [scholars]
  );

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return fuse.search(query).map((result) => result.item);
  }, [fuse, query]);

  const showAllScholars = query.length < 2;

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un savant..."
          className="w-full rounded-xl border border-border bg-surface px-5 py-4 text-lg text-foreground shadow-sm outline-none transition-all placeholder:text-muted focus:border-primary-light focus:ring-2 focus:ring-primary-light/20"
          autoFocus
        />
        {query.length > 0 && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-center text-sm text-muted">Chargement...</p>
        ) : showAllScholars ? (
          <>
            <p className="text-sm text-muted">
              {scholars.length} savants enregistrés
            </p>
            {scholars.map((scholar) => (
              <ScholarCard key={scholar.id} scholar={scholar} />
            ))}
          </>
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-muted">
              {results.length} résultat{results.length > 1 ? "s" : ""}
            </p>
            {results.map((scholar) => (
              <ScholarCard key={scholar.id} scholar={scholar} />
            ))}
          </>
        ) : (
          <p className="text-center text-sm text-muted">
            Aucun savant trouvé pour « {query} »
          </p>
        )}
      </div>
    </div>
  );
}
