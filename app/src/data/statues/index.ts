// Punto de entrada público de los datos de estatuas.
// La fuente de verdad ahora vive en lib/storage/statues.ts (respaldada por
// Netlify Blobs en producción, o un JSON local en desarrollo), sembrada a
// partir de ./seed.ts la primera vez que se lee.
export type { Media, StatueDetailApi } from "@/app/src/data/statues/seed";
export { listStatues, getStatue as getStatueBySlug } from "@/lib/storage/statues";
