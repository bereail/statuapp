import { notFound } from "next/navigation";
import StatueForm from "@/components/admin/StatueForm";
import { getStatue } from "@/lib/storage/statues";
import { statueToFormValues } from "@/lib/storage/statueMapper";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Editar estatua — Admin StatuApp",
};

export default async function EditarEstatuaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const estatua = await getStatue(slug);
  if (!estatua) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar estatua</h1>
        <p className="text-muted-foreground text-sm">{estatua.titulo}</p>
      </div>
      <StatueForm modo="editar" slugOriginal={estatua.slug} valoresIniciales={statueToFormValues(estatua)} />
    </div>
  );
}
