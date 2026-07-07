import StatuesExplorer from "@/components/StatuesExplorer";
import { listStatues } from "@/app/src/data/statues";
import { toStatueDetail } from "@/app/src/types/statue";

export const dynamic = "force-dynamic";

export default async function ExplorarPage() {
  const statuesData = await listStatues();
  const initialData = statuesData.map(toStatueDetail); // → StatueDetail[]

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explorar</h1>
      <StatuesExplorer initialData={initialData} />
    </main>
  );
}
