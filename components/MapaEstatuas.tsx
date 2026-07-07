"use client";

import dynamic from "next/dynamic";
import type { PuntoEstatua } from "./MapaInterno";

// Leaflet toca `window` al importarse, así que el mapa no puede
// renderizarse en el servidor.
const MapaInterno = dynamic(() => import("./MapaInterno"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[60vh] w-full items-center justify-center rounded-2xl border bg-muted/30 text-muted-foreground">
      Cargando mapa…
    </div>
  ),
});

export default function MapaEstatuas({ puntos }: { puntos: PuntoEstatua[] }) {
  return <MapaInterno puntos={puntos} />;
}
