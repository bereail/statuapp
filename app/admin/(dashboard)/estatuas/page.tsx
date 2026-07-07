import Link from "next/link";
import { Pencil, PlusCircle, Eye } from "lucide-react";
import { listStatues } from "@/lib/storage/statues";
import { obtenerEstadisticasDeVisitas } from "@/lib/storage/visits";
import { Button } from "@/components/ui/button";
import DeleteEstatuaButton from "@/components/admin/DeleteEstatuaButton";

export const dynamic = "force-dynamic";

export default async function AdminEstatuasPage() {
  const [estatuas, visitas] = await Promise.all([listStatues(), obtenerEstadisticasDeVisitas()]);
  const ordenadas = [...estatuas].sort((a, b) => a.titulo.localeCompare(b.titulo));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Estatuas</h1>
          <p className="text-muted-foreground text-sm">{estatuas.length} cargadas en total.</p>
        </div>
        <Button asChild>
          <Link href="/admin/estatuas/nueva">
            <PlusCircle className="size-4" />
            Nueva estatua
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Barrio</th>
                <th className="px-4 py-3 font-medium">Año</th>
                <th className="px-4 py-3 font-medium">Visitas</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ordenadas.map((e) => (
                <tr key={e.slug} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{e.titulo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.barrio ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.anio ?? "—"}</td>
                  <td className="px-4 py-3 tabular-nums">{visitas.porEstatua[e.slug] ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/estatuas/${e.slug}`} target="_blank" aria-label={`Ver ${e.titulo}`}>
                          <Eye className="size-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/estatuas/${e.slug}/editar`} aria-label={`Editar ${e.titulo}`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                      <DeleteEstatuaButton slug={e.slug} titulo={e.titulo} />
                    </div>
                  </td>
                </tr>
              ))}
              {ordenadas.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Todavía no cargaste ninguna estatua.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
