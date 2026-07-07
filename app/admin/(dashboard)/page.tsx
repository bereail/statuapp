import Link from "next/link";
import { Eye, Landmark, CalendarDays, TrendingUp } from "lucide-react";
import { listStatues } from "@/lib/storage/statues";
import { obtenerEstadisticasDeVisitas } from "@/lib/storage/visits";
import VisitsChart from "@/components/admin/VisitsChart";

export const dynamic = "force-dynamic";

function ultimosNDias(porDia: Record<string, number>, n: number) {
  const dias: { fecha: string; cantidad: number }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const fecha = d.toISOString().slice(0, 10);
    dias.push({ fecha, cantidad: porDia[fecha] ?? 0 });
  }
  return dias;
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Icon className="size-4" />
        {label}
      </div>
      <div className="text-3xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [estatuas, visitas] = await Promise.all([listStatues(), obtenerEstadisticasDeVisitas()]);

  const hoy = new Date().toISOString().slice(0, 10);
  const serie14dias = ultimosNDias(visitas.porDia, 14);
  const visitasHoy = visitas.porDia[hoy] ?? 0;
  const visitas7dias = serie14dias.slice(-7).reduce((acc, d) => acc + d.cantidad, 0);

  const topEstatuas = Object.entries(visitas.porEstatua)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([slug, cantidad]) => ({
      slug,
      cantidad,
      titulo: estatuas.find((e) => e.slug === slug)?.titulo ?? slug,
    }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Métricas de visitas y contenido de StatuApp.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Eye} label="Visitas totales" value={visitas.total} />
        <StatTile icon={CalendarDays} label="Visitas hoy" value={visitasHoy} />
        <StatTile icon={TrendingUp} label="Últimos 7 días" value={visitas7dias} />
        <StatTile icon={Landmark} label="Estatuas cargadas" value={estatuas.length} />
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold">Visitas — últimos 14 días</h2>
        <VisitsChart datos={serie14dias} />
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold">Estatuas más visitadas</h2>
        {topEstatuas.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay visitas registradas.</p>
        ) : (
          <ol className="divide-y">
            {topEstatuas.map((e, i) => (
              <li key={e.slug} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-sm w-4">{i + 1}</span>
                  <Link href={`/estatuas/${e.slug}`} target="_blank" className="hover:underline">
                    {e.titulo}
                  </Link>
                </div>
                <span className="font-semibold tabular-nums">{e.cantidad}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
