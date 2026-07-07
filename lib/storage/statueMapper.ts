import type { StatueFormValues } from "@/lib/validation/statue";
import type { StatueDetailApi } from "@/lib/storage/statues";

/** Convierte los valores del formulario admin al modelo que persiste el store. */
export function formValuesToStatuePayload(
  values: StatueFormValues,
  existingAuthorId?: number,
  existingLocationId?: number
): Omit<StatueDetailApi, "slug"> & { slug?: string } {
  const primeraFoto = values.medias.find((m) => m.tipo === "foto");

  return {
    slug: values.slug,
    titulo: values.titulo,
    barrio: values.barrio,
    anio: values.anio,
    material: values.material,
    resumen_corto: values.resumen_corto,
    resumen_extenso: values.resumen_extenso,
    dato_curioso: values.dato_curioso,
    lat: values.lat,
    lng: values.lng,
    author: values.autorNombre
      ? { id: existingAuthorId ?? 0, nombre: values.autorNombre }
      : null,
    location:
      values.ubicacionNombre || values.ubicacionDireccion || values.barrio
        ? {
            id: existingLocationId ?? 0,
            nombre: values.ubicacionNombre ?? values.titulo,
            direccion: values.ubicacionDireccion,
            barrio: values.barrio,
            lat: values.lat,
            lng: values.lng,
          }
        : null,
    medias: values.medias.map((m, i) => ({ ...m, id: m.id ?? i + 1 })),
    imagen_url: primeraFoto?.url ?? null,
  };
}

/** Convierte una estatua persistida al formato plano que consume el formulario. */
export function statueToFormValues(statue: StatueDetailApi): StatueFormValues {
  return {
    slug: statue.slug,
    titulo: statue.titulo,
    barrio: statue.barrio ?? null,
    anio: statue.anio ?? null,
    material: statue.material ?? null,
    resumen_corto: statue.resumen_corto ?? null,
    resumen_extenso: statue.resumen_extenso ?? null,
    dato_curioso: statue.dato_curioso ?? null,
    autorNombre: statue.author?.nombre ?? null,
    ubicacionNombre: statue.location?.nombre ?? null,
    ubicacionDireccion: statue.location?.direccion ?? null,
    lat: statue.lat ?? statue.location?.lat ?? null,
    lng: statue.lng ?? statue.location?.lng ?? null,
    medias: (statue.medias ?? []).map((m) => ({
      id: m.id,
      tipo: m.tipo,
      url: m.url,
      pie: m.pie ?? null,
      credito: m.credito ?? null,
    })),
  };
}
