"use client";

import { useMemo, useState, useDeferredValue } from "react";
import Image from "next/image";
import Link from "next/link";
import type { StatueDetail } from "@/app/src/types/statue";

type Props = { initialData: StatueDetail[] };

// normaliza acentos y pasa a lower
const norm = (s: string) =>
  s?.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "") ?? "";

// resalta coincidencia simple en el título
function Highlight({ text, term }: { text: string; term: string }) {
  if (!term) return <>{text}</>;
  const base = norm(text);
  const i = base.indexOf(term);
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="bg-primary/20 rounded px-0.5">
        {text.slice(i, i + term.length)}
      </mark>
      {text.slice(i + term.length)}
    </>
  );
}

// toma la primera foto disponible de medias, o null
const getCover = (s: StatueDetail) =>
  s.medias?.find(m => m.kind === "foto")?.url ?? null;

export default function StatuesExplorer({ initialData }: Props) {
  const [q, setQ] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const qDeferred = useDeferredValue(q);
  const term = norm(qDeferred.trim());

  // tags únicos
  const allTags = useMemo(() => {
    const set = new Set<string>();
    initialData.forEach(s => (s.tags ?? []).forEach(t => set.add(t)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [initialData]);

  const results = useMemo(() => {
    return initialData.filter((s) => {
      const byText =
        !term ||
        norm(s.title ?? "").includes(term) ||
        (s.tags ?? []).some((t) => norm(t).includes(term));

      const byTag = !activeTag || (s.tags ?? []).includes(activeTag);

      return byText && byTag;
    });
  }, [initialData, term, activeTag]);

  return (
    <section className="space-y-6">
      {/* Buscador */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          className="input input-bordered w-full sm:max-w-md"
          placeholder="Buscar por título o tag…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Buscar estatuas por título o tag"
        />
        {activeTag && (
          <button
            onClick={() => setActiveTag(null)}
            className="btn btn-ghost btn-sm"
            title="Limpiar filtro por tag"
          >
            Limpiar tag
          </button>
        )}
      </div>

      {/* Nube de tags (si existen) */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((t) => {
            const active = t === activeTag;
            return (
              <button
                key={t}
                onClick={() => setActiveTag(active ? null : t)}
                className={active ? "badge badge-primary gap-1" : "badge badge-outline hover:badge-ghost gap-1"}
                aria-pressed={active}
              >
                #{t}
              </button>
            );
          })}
        </div>
      )}

      {/* Resultados */}
      {results.length === 0 ? (
        <div className="alert">
          <span>
            Sin resultados para <strong>{q || activeTag}</strong>. Probá con otro término o limpiá los filtros.
          </span>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => {
            const cover = getCover(s) ?? "/api/placeholder";
            return (
              <li key={s.slug} className="card bg-base-100 shadow">
                <figure className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={cover}
                    alt={s.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    <Highlight text={s.title ?? ""} term={term} />
                  </h2>

                  {s.shortSummary && (
                    <p className="text-sm text-base-content/70 line-clamp-3">
                      {s.shortSummary}
                    </p>
                  )}

                  {(s.tags?.length ?? 0) > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.tags!.map((t) => (
                        <button
                          key={t}
                          onClick={() => setActiveTag(t)}
                          className="badge badge-outline hover:badge-ghost"
                          title={`Filtrar por ${t}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="card-actions justify-end mt-4">
<Link href={`/estatuas/${s.slug}`} className="btn btn-primary">
  Ver ficha
</Link>

                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
