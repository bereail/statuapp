import { z } from "zod";

const nullableString = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v && v.length > 0 ? v : null))
  .nullable();

const nullableNumber = z
  .union([z.number(), z.nan(), z.literal(""), z.undefined(), z.null()])
  .transform((v) => (typeof v === "number" && !Number.isNaN(v) ? v : null));

export const mediaSchema = z.object({
  id: z.number().optional(),
  tipo: z.enum(["foto", "audio", "doc"]),
  url: z.string().min(1, "La URL de la imagen es obligatoria."),
  pie: nullableString,
  credito: nullableString,
});

export const statueFormSchema = z.object({
  slug: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
  titulo: z.string().trim().min(1, "El título es obligatorio."),
  barrio: nullableString,
  anio: nullableNumber,
  material: nullableString,
  resumen_corto: nullableString,
  resumen_extenso: nullableString,
  dato_curioso: nullableString,
  autorNombre: nullableString,
  ubicacionNombre: nullableString,
  ubicacionDireccion: nullableString,
  lat: nullableNumber,
  lng: nullableNumber,
  medias: z.array(mediaSchema).default([]),
});

export type StatueFormInput = z.input<typeof statueFormSchema>;
export type StatueFormValues = z.output<typeof statueFormSchema>;
