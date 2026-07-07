"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { withBasePath } from "@/lib/basePath";

export type PuntoEstatua = {
  slug: string;
  titulo: string;
  barrio: string | null;
  lat: number;
  lng: number;
};

// Pin propio en SVG inline: evita el problema clásico de Leaflet con los
// íconos default (rutas de imagen que se rompen al empaquetar con Next).
const icono = L.divIcon({
  className: "",
  html: `<svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.27 21.73 0 14 0z" fill="#C08A52"/>
    <circle cx="14" cy="14" r="6" fill="#1E1F26"/>
  </svg>`,
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  popupAnchor: [0, -34],
});

const CENTRO_ROSARIO: [number, number] = [-32.9468, -60.6393];

export default function MapaInterno({ puntos }: { puntos: PuntoEstatua[] }) {
  return (
    <div className="h-[60vh] w-full overflow-hidden rounded-2xl border">
      <MapContainer center={CENTRO_ROSARIO} zoom={13} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {puntos.map((p) => (
          <Marker key={p.slug} position={[p.lat, p.lng]} icon={icono}>
            <Popup>
              <div className="space-y-1">
                <p className="font-semibold">{p.titulo}</p>
                {p.barrio && <p className="text-sm text-muted-foreground">{p.barrio}</p>}
                <a href={withBasePath(`/estatuas/${p.slug}`)} className="text-sm underline">
                  Ver ficha
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
