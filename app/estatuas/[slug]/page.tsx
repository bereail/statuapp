import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getStatueBySlug } from "@/app/src/data/statues";
import GaleriaEstatua from "@/components/GaleriaEstatua";
// app/estatuas/[slug]/page.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Lightbulb } from "lucide-react"; // opcional, para resaltar el dato curioso


// Los datos ahora se editan desde el panel admin, así que la página se
// renderiza dinámicamente en vez de generarse una única vez en build time.
export const dynamic = "force-dynamic";
export const dynamicParams = true;

// (Opcional) poné tu dominio en variable de entorno para OG absoluto
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const statue = await getStatueBySlug(slug);
  if (!statue) return { title: "Estatua no encontrada — StatuApp" };

  const rel = statue.imagen_url ?? statue.medias?.find((m) => m.tipo === "foto")?.url;
  const ogImageAbs = rel ? new URL(rel, SITE_URL).toString() : undefined;

  return {
    title: `${statue.titulo} — StatuApp`,
    description: statue.resumen_corto ?? undefined,
    openGraph: ogImageAbs
      ? {
          title: `${statue.titulo} — StatuApp`,
          description: statue.resumen_corto ?? undefined,
          images: [{ url: ogImageAbs, alt: statue.titulo }],
        }
      : undefined,
  };
}

export default async function StatuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const statue = await getStatueBySlug(slug);
  if (!statue) return notFound();

  // Log útil en dev (podés borrar):
  if (process.env.NODE_ENV === "development") {
    console.log("[PAGE estatua] slug:", slug, "titulo:", statue.titulo, "medias:", statue.medias?.length ?? 0);
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        ← Volver
      </Link>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">{statue.titulo}</h1>
        {statue.resumen_corto && (
          <p className="text-muted-foreground">{statue.resumen_corto}</p>
        )}
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Galería (cliente) */}
        <div>
          <GaleriaEstatua medias={statue.medias ?? []} titulo={statue.titulo} />
        </div>

        {/* Datos */}
        <div className="space-y-3 text-sm">
          {statue.author?.nombre && (
            <div>
              <b>Autor:</b> {statue.author.nombre}
            </div>
          )}
          {typeof statue.anio === "number" && (
            <div>
              <b>Año:</b> {statue.anio}
            </div>
          )}
          {statue.material && (
            <div>
              <b>Material:</b> {statue.material}
            </div>
          )}

          {statue.location && (
            <div className="space-y-1">
              {statue.location.nombre && (
                <div>
                  <b>Ubicación:</b> {statue.location.nombre}
                </div>
              )}
              {statue.location.direccion && (
                <div>
                  <b>Dirección:</b> {statue.location.direccion}
                </div>
              )}
              {statue.location.barrio && (
                <div>
                  <b>Barrio:</b> {statue.location.barrio}
                </div>
              )}

              {typeof statue.location.lat === "number" &&
                typeof statue.location.lng === "number" && (
                  <Button asChild variant="secondary" size="sm" className="mt-2">
                    <a
                      href={`https://www.google.com/maps?q=${statue.location.lat},${statue.location.lng}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver en Maps
                    </a>
                  </Button>
                )}
            </div>
          )}
        </div>
      </div>

           {/* Dato curioso (si existe) */}
      {statue.dato_curioso && (
        <aside className="mt-6 rounded-xl border bg-muted/30 p-4 flex gap-3">
          <Lightbulb className="mt-1 shrink-0" />
          <p className="text-sm">
            <strong>Dato curioso:</strong> {statue.dato_curioso}
          </p>
        </aside>
      )}

      {/* Descripción larga en Markdown (si existe) */}
      {statue.resumen_extenso && (
        <article className="prose prose-sm dark:prose-invert max-w-none mt-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {statue.resumen_extenso}
          </ReactMarkdown>
        </article>

      )}
    </section>
  );
}
