import { readJSON, writeJSON } from "@/lib/storage/blobStore";
import { seedStatues, type Media, type StatueDetailApi } from "@/app/src/data/statues/seed";

export type { Media, StatueDetailApi };

const STORE_NAME = "statuapp-data";
const KEY = "estatuas";

function dedupeBySlug(items: StatueDetailApi[]): StatueDetailApi[] {
  const bySlug = new Map<string, StatueDetailApi>();
  for (const item of items) bySlug.set(item.slug, item);
  return Array.from(bySlug.values());
}

async function loadAll(): Promise<StatueDetailApi[]> {
  const stored = await readJSON<StatueDetailApi[] | null>(STORE_NAME, KEY, null);
  if (stored) return stored;
  const seeded = dedupeBySlug(seedStatues);
  await writeJSON(STORE_NAME, KEY, seeded);
  return seeded;
}

async function saveAll(items: StatueDetailApi[]): Promise<void> {
  await writeJSON(STORE_NAME, KEY, items);
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Lista todas las estatuas cargadas. */
export async function listStatues(): Promise<StatueDetailApi[]> {
  return loadAll();
}

/** Busca una estatua por slug. */
export async function getStatue(slug: string): Promise<StatueDetailApi | null> {
  const all = await loadAll();
  return all.find((s) => s.slug === slug) ?? null;
}

export class SlugTakenError extends Error {
  constructor(slug: string) {
    super(`Ya existe una estatua con el slug "${slug}".`);
    this.name = "SlugTakenError";
  }
}

/** Crea una estatua nueva. Si no se pasa slug, se genera a partir del título. */
export async function createStatue(
  input: Omit<StatueDetailApi, "slug"> & { slug?: string }
): Promise<StatueDetailApi> {
  const all = await loadAll();
  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.titulo);
  if (all.some((s) => s.slug === slug)) throw new SlugTakenError(slug);

  const nextId = Math.max(0, ...all.flatMap((s) => (s.author?.id ? [s.author.id] : []))) + 1;
  const statue: StatueDetailApi = {
    ...input,
    slug,
    author: input.author ? { id: input.author.id ?? nextId, nombre: input.author.nombre } : null,
    medias: (input.medias ?? []).map((m, i) => ({ ...m, id: m.id ?? i + 1 })),
  };

  all.push(statue);
  await saveAll(all);
  return statue;
}

/** Actualiza una estatua existente. Permite renombrar el slug. */
export async function updateStatue(
  currentSlug: string,
  input: Partial<StatueDetailApi> & { slug?: string }
): Promise<StatueDetailApi> {
  const all = await loadAll();
  const index = all.findIndex((s) => s.slug === currentSlug);
  if (index === -1) throw new Error(`No existe una estatua con el slug "${currentSlug}".`);

  const nextSlug = input.slug?.trim() ? slugify(input.slug) : currentSlug;
  if (nextSlug !== currentSlug && all.some((s) => s.slug === nextSlug)) {
    throw new SlugTakenError(nextSlug);
  }

  const updated: StatueDetailApi = {
    ...all[index],
    ...input,
    slug: nextSlug,
    medias: (input.medias ?? all[index].medias ?? []).map((m, i) => ({ ...m, id: m.id ?? i + 1 })),
  };

  all[index] = updated;
  await saveAll(all);
  return updated;
}

/** Elimina una estatua por slug. */
export async function deleteStatue(slug: string): Promise<void> {
  const all = await loadAll();
  const filtered = all.filter((s) => s.slug !== slug);
  if (filtered.length === all.length) return;
  await saveAll(filtered);
}
