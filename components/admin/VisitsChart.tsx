"use client";

import { useId, useState } from "react";

type Punto = { fecha: string; cantidad: number };

function formatearFecha(iso: string) {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

export default function VisitsChart({ datos }: { datos: Punto[] }) {
  const [activo, setActivo] = useState<number | null>(null);
  const tableId = useId();
  const max = Math.max(1, ...datos.map((d) => d.cantidad));

  return (
    <div className="space-y-2">
      <div
        className="flex items-end gap-1.5 h-40"
        role="img"
        aria-labelledby={tableId}
        onMouseLeave={() => setActivo(null)}
      >
        {datos.map((d, i) => {
          const alturaPct = Math.max(4, (d.cantidad / max) * 100);
          const esActivo = activo === i;
          return (
            <div
              key={d.fecha}
              className="relative flex-1 flex flex-col items-center justify-end h-full group"
              onMouseEnter={() => setActivo(i)}
              onFocus={() => setActivo(i)}
              tabIndex={0}
            >
              {esActivo && (
                <div className="absolute -top-8 z-10 rounded-md bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background shadow-md">
                  {d.cantidad} · {formatearFecha(d.fecha)}
                </div>
              )}
              <div
                className="w-full rounded-t-md bg-primary transition-colors group-hover:bg-primary/80"
                style={{ height: `${alturaPct}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{datos[0] && formatearFecha(datos[0].fecha)}</span>
        <span>{datos.at(-1) && formatearFecha(datos.at(-1)!.fecha)}</span>
      </div>

      {/* Vista tabular accesible (oculta visualmente) */}
      <table id={tableId} className="sr-only">
        <caption>Visitas por día</caption>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Visitas</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((d) => (
            <tr key={d.fecha}>
              <td>{d.fecha}</td>
              <td>{d.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
