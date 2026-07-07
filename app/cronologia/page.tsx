// app/cronologia/page.tsx
import { MapPin, Landmark, CalendarDays, Filter } from "lucide-react";
// ⬇️ Ajustá este path según tu repo (p. ej. "@/app/src/data/statues" o "@/src/data/statues")
import { StatueDetailApi, listStatues } from "../src/data/statues";

// ===== Tipo liviano que usa la página (listado) =====
type Statue = {
  slug: string;
  titulo: string;
  anio?: number | null;
  material?: string | null;
  barrio?: string | null;
  autor?: { nombre?: string | null } | null;
  resumen_corto?: string | null;
};

// ===== Adapter: StatueDetailApi -> Statue =====
function fromDetailToList(s: StatueDetailApi): Statue {
  return {
    slug: s.slug,
    titulo: s.titulo,
    anio: s.anio ?? null,
    material: s.material ?? null,
    barrio: s.barrio ?? s.location?.barrio ?? null,
    autor: s.author ? { nombre: s.author.nombre } : null,
    resumen_corto: s.resumen_corto ?? null,
  };
}

// ===== Utilidades =====
function toDecade(year?: number | null) {
  if (!year || Number.isNaN(year)) return "Sin fecha";
  const base = Math.floor(year / 10) * 10;
  return `${base}s`;
}

function groupByDecade(items: Statue[]) {
  const map = new Map<string, Statue[]>();
  for (const it of items) {
    const key = toDecade(it.anio ?? null);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(it);
  }
  const entries = [...map.entries()].sort((a, b) => {
    if (a[0] === "Sin fecha") return 1;
    if (b[0] === "Sin fecha") return -1;
    return parseInt(a[0]) - parseInt(b[0]);
  });
  return entries;
}

// ===== Fetch con fallback (mapea si la API devuelve "detalle") =====
async function fetchStatues(): Promise<Statue[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const localStatues = await listStatues();

  if (!base) return localStatues.map(fromDetailToList);

  const url = `${base}/api/v1/statues/?page_size=200&ordering=anio`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Bad response");
    const data = await res.json();
    const raw = Array.isArray(data) ? data : data.results ?? [];
    if (!raw.length) return localStatues.map(fromDetailToList);

    const looksLikeDetail =
      typeof raw[0] === "object" &&
      raw[0] !== null &&
      ("author" in raw[0] || "location" in raw[0]);

    return looksLikeDetail
      ? (raw as StatueDetailApi[]).map(fromDetailToList)
      : (raw as Statue[]);
  } catch {
    return localStatues.map(fromDetailToList);
  }
}

// ===== Página (Server Component) =====
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cronología | StatuApp",
  description:
    "Recorrido histórico de las estatuas de Rosario, agrupadas por décadas, con filtros por barrio y autor.",
};

type Params = { barrio?: string; autor?: string };

export default async function CronologiaPage({
  searchParams,
}: {
  // 👇 Next 15 espera Promise<...> aquí
  searchParams?: Promise<Params>;
}) {
  // si viene undefined, resolvemos a {}
  const params = (await searchParams) ?? {};
  const barrioParam = (params.barrio ?? "").trim().toLowerCase();
  const autorParam = (params.autor ?? "").trim().toLowerCase();

  const all = await fetchStatues();

  const filtered = all.filter((s) => {
    const okBarrio = !barrioParam || (s.barrio ?? "").toLowerCase().includes(barrioParam);
    const okAutor = !autorParam || (s.autor?.nombre ?? "").toLowerCase().includes(autorParam);
    return okBarrio && okAutor;
  });

  const groups = groupByDecade(filtered);

  const barrios = [...new Set(all.map((s) => s.barrio).filter(Boolean))].sort() as string[];
  const autores = [...new Set(all.map((s) => s.autor?.nombre).filter(Boolean))].sort() as string[];

  return (
    <main className="px-4 md:px-8 lg:px-12 py-10 max-w-5xl mx-auto">
      <header className="text-center space-y-2 mb-8">
        <div className="flex items-center justify-center gap-3">
          <CalendarDays className="text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Cronología</h1>
        </div>
        <p className="text-muted-foreground">
          Recorrido histórico de las estatuas de Rosario, agrupadas por década.
        </p>
      </header>

      {/* Filtros (GET) */}
      <form
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-card border rounded-xl p-3 mb-8"
        method="GET"
        aria-label="Filtros de cronología"
      >
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filtrar</span>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Barrio</span>
          <select
            name="barrio"
            defaultValue={params.barrio ?? ""}
            className="h-10 rounded-md border bg-background px-3"
          >
            <option value="">Todos</option>
            {barrios.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">Autor</span>
          <select
            name="autor"
            defaultValue={params.autor ?? ""}
            className="h-10 rounded-md border bg-background px-3"
          >
            <option value="">Todos</option>
            {autores.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>

        <div className="sm:col-span-3 flex gap-3 justify-end">
          <a
            href="/cronologia"
            className="h-10 inline-flex items-center justify-center rounded-md border px-4"
          >
            Limpiar
          </a>
          <button
            type="submit"
            className="h-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4"
          >
            Aplicar
          </button>
        </div>
      </form>

      {/* Resultado vacío */}
      {filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-16">
          No hay resultados con esos filtros.
        </div>
      )}

      {/* Timeline por décadas */}
      <section className="space-y-10">
        {groups.map(([decade, items]) => (
          <div key={decade} className="space-y-4">
            <h2 className="text-2xl font-semibold">{decade}</h2>

            <ol className="relative border-s pl-6 space-y-6">
              {items
                .sort((a, b) => (a.anio ?? 0) - (b.anio ?? 0))
                .map((s) => (
                  <li key={s.slug} className="ms-4">
                    {/* Punto de la línea */}
                    <div className="absolute -start-1.5 size-3 rounded-full bg-primary" />

                    <article className="bg-card border rounded-xl p-4 hover:shadow-sm transition">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <Landmark className="text-accent" />
                          <h3 className="text-lg font-semibold">
                            <a href={`/estatuas/${s.slug}`} className="hover:underline">
                              {s.titulo}
                            </a>
                          </h3>
                        </div>
                        <span className="text-sm px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                          {s.anio ?? "s/f"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {s.resumen_corto ??
                          "Sin resumen disponible. Próximamente ampliaremos la información."}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        {s.autor?.nombre && (
                          <span className="inline-flex items-center gap-2">
                            <Landmark className="size-4 shrink-0 opacity-70" />
                            {s.autor.nombre}
                          </span>
                        )}
                        {s.barrio && (
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="size-4 shrink-0 opacity-70" />
                            {s.barrio}
                          </span>
                        )}
                        {s.material && (
                          <span className="text-muted-foreground">{s.material}</span>
                        )}
                      </div>
                    </article>
                  </li>
                ))}
            </ol>
          </div>
        ))}
      </section>

      {/* CTA al mapa */}
      <div className="mt-12 flex justify-center">
        <a
          href="/mapa"
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-3"
        >
          <MapPin />
          Ver mapa interactivo
        </a>
      </div>
    </main>
  );
}
