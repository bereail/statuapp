import { listStatues } from "@/app/src/data/statues";
import MapaEstatuas from "@/components/MapaEstatuas";
import type { PuntoEstatua } from "@/components/MapaInterno";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mapa — StatuApp",
  description: "Ubicación de las estatuas y monumentos de Rosario en el mapa.",
};

export default async function MapaPage() {
  const estatuas = await listStatues();

  const puntos: PuntoEstatua[] = estatuas
    .map((e) => ({
      slug: e.slug,
      titulo: e.titulo,
      barrio: e.barrio ?? e.location?.barrio ?? null,
      lat: e.lat ?? e.location?.lat ?? null,
      lng: e.lng ?? e.location?.lng ?? null,
    }))
    .filter(
      (p): p is PuntoEstatua =>
        typeof p.lat === "number" && typeof p.lng === "number"
    );

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10 md:px-8">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Mapa</h1>
        <p className="text-muted-foreground">
          {puntos.length} estatua{puntos.length === 1 ? "" : "s"} ubicada
          {puntos.length === 1 ? "" : "s"} en el mapa de Rosario.
        </p>
      </header>

      <MapaEstatuas puntos={puntos} />
    </main>
  );
}
