import { readJSON, writeJSON } from "@/lib/storage/blobStore";

const STORE_NAME = "statuapp-data";
const KEY = "visitas";

type VisitStats = {
  total: number;
  porDia: Record<string, number>;
  porRuta: Record<string, number>;
  porEstatua: Record<string, number>;
};

const VACIO: VisitStats = { total: 0, porDia: {}, porRuta: {}, porEstatua: {} };

function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function slugDesdeRuta(pathname: string): string | null {
  const match = pathname.match(/^\/estatuas\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

/** Registra una visita a una ruta pública. */
export async function registrarVisita(pathname: string): Promise<void> {
  const stats = await readJSON<VisitStats>(STORE_NAME, KEY, VACIO);
  const dia = hoyISO();

  stats.total += 1;
  stats.porDia[dia] = (stats.porDia[dia] ?? 0) + 1;
  stats.porRuta[pathname] = (stats.porRuta[pathname] ?? 0) + 1;

  const slug = slugDesdeRuta(pathname);
  if (slug) stats.porEstatua[slug] = (stats.porEstatua[slug] ?? 0) + 1;

  await writeJSON(STORE_NAME, KEY, stats);
}

export async function obtenerEstadisticasDeVisitas(): Promise<VisitStats> {
  return readJSON<VisitStats>(STORE_NAME, KEY, VACIO);
}
