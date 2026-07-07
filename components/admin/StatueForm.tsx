"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageOff, ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  statueFormSchema,
  type StatueFormInput,
  type StatueFormValues,
} from "@/lib/validation/statue";

const selectClassName =
  "border-input dark:bg-input/30 flex h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

const valoresVacios: StatueFormInput = {
  slug: undefined,
  titulo: "",
  barrio: undefined,
  anio: undefined,
  material: undefined,
  resumen_corto: undefined,
  resumen_extenso: undefined,
  dato_curioso: undefined,
  autorNombre: undefined,
  ubicacionNombre: undefined,
  ubicacionDireccion: undefined,
  lat: undefined,
  lng: undefined,
  medias: [],
};

type Props = {
  modo: "crear" | "editar";
  slugOriginal?: string;
  valoresIniciales?: StatueFormValues;
};

export default function StatueForm({ modo, slugOriginal, valoresIniciales }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [subiendoIndex, setSubiendoIndex] = useState<number | null>(null);

  const form = useForm<StatueFormInput, unknown, StatueFormValues>({
    resolver: zodResolver(statueFormSchema),
    defaultValues: valoresIniciales ?? valoresVacios,
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "medias" });

  async function subirFoto(index: number, file: File) {
    setError(null);
    setSubiendoIndex(index);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("hint", form.getValues("titulo") || "estatua");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo subir la imagen.");
        return;
      }
      form.setValue(`medias.${index}.url`, data.url, { shouldValidate: true, shouldDirty: true });
    } catch {
      setError("Error de conexión al subir la imagen.");
    } finally {
      setSubiendoIndex(null);
    }
  }

  async function onSubmit(values: StatueFormValues) {
    setError(null);
    setGuardando(true);
    try {
      const url = modo === "crear" ? "/api/admin/estatuas" : `/api/admin/estatuas/${slugOriginal}`;
      const method = modo === "crear" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo guardar la estatua.");
        return;
      }
      router.push("/admin/estatuas");
      router.refresh();
    } catch {
      setError("Error de conexión. Probá de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-semibold">Datos generales</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="se genera automáticamente" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="barrio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barrio</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="anio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? null : Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-semibold">Textos</h2>
          <FormField
            control={form.control}
            name="resumen_corto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resumen corto</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} rows={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resumen_extenso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resumen extenso</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} rows={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dato_curioso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dato curioso</FormLabel>
                <FormControl>
                  <Textarea {...field} value={field.value ?? ""} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <section className="rounded-xl border bg-card p-5 space-y-4">
          <h2 className="font-semibold">Autor y ubicación</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="autorNombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autor</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ubicacionNombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del lugar</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ubicacionDireccion"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitud</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? null : Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lng"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitud</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(e.target.value === "" ? null : Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="rounded-xl border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Fotos y medios</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ tipo: "foto", url: "", pie: null, credito: null })}
            >
              <ImagePlus className="size-4" />
              Agregar foto
            </Button>
          </div>

          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">Todavía no agregaste fotos.</p>
          )}

          <div className="space-y-4">
            {fields.map((item, index) => (
              <MediaRow
                key={item.id}
                index={index}
                control={form.control}
                subiendo={subiendoIndex === index}
                onSubirFoto={(file) => subirFoto(index, file)}
                onEliminar={() => remove(index)}
              />
            ))}
          </div>
        </section>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={guardando}>
            {guardando ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Guardando…
              </>
            ) : (
              "Guardar"
            )}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/admin/estatuas")}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}

function MediaRow({
  index,
  control,
  subiendo,
  onSubirFoto,
  onEliminar,
}: {
  index: number;
  control: Control<StatueFormInput>;
  subiendo: boolean;
  onSubirFoto: (file: File) => void;
  onEliminar: () => void;
}) {
  const tipo = useWatch({ control, name: `medias.${index}.tipo` });
  const url = useWatch({ control, name: `medias.${index}.url` });
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start gap-4">
        {tipo === "foto" && url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="size-20 shrink-0 rounded-md border object-cover" />
        ) : (
          <div className="text-muted-foreground flex size-20 shrink-0 items-center justify-center rounded-md border border-dashed">
            <ImageOff className="size-6" />
          </div>
        )}

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <FormField
            control={control}
            name={`medias.${index}.tipo`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <select className={selectClassName} {...field}>
                    <option value="foto">Foto</option>
                    <option value="audio">Audio</option>
                    <option value="doc">Documento</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`medias.${index}.url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  {tipo === "foto" ? (
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      readOnly
                      placeholder="Subí una foto para completar la URL"
                      className="text-muted-foreground"
                    />
                  ) : (
                    <Input {...field} value={field.value ?? ""} placeholder="https://..." />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`medias.${index}.pie`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pie de foto</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`medias.${index}.credito`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crédito</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        {tipo === "foto" ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onSubirFoto(file);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={subiendo}
            >
              {subiendo ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Subiendo…
                </>
              ) : (
                <>
                  <ImagePlus className="size-4" />
                  Subir foto
                </>
              )}
            </Button>
          </>
        ) : (
          <span />
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={onEliminar}
        >
          <X className="size-4" />
          Quitar
        </Button>
      </div>
    </div>
  );
}
