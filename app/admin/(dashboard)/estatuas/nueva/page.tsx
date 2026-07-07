import StatueForm from "@/components/admin/StatueForm";

export const metadata = {
  title: "Nueva estatua — Admin StatuApp",
};

export default function NuevaEstatuaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nueva estatua</h1>
        <p className="text-muted-foreground text-sm">Cargá los datos y las fotos de la estatua.</p>
      </div>
      <StatueForm modo="crear" />
    </div>
  );
}
