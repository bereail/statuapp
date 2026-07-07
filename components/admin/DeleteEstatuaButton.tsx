"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { withBasePath } from "@/lib/basePath";

export default function DeleteEstatuaButton({ slug, titulo }: { slug: string; titulo: string }) {
  const router = useRouter();
  const [armado, setArmado] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!armado) return;
    const t = setTimeout(() => setArmado(false), 3000);
    return () => clearTimeout(t);
  }, [armado]);

  async function confirmar() {
    setLoading(true);
    try {
      await fetch(withBasePath(`/api/admin/estatuas/${slug}`), { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
      setArmado(false);
    }
  }

  if (armado) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-destructive hover:text-destructive"
        onClick={confirmar}
        disabled={loading}
        aria-label={`Confirmar eliminación de ${titulo}`}
      >
        {loading ? "Eliminando…" : "¿Confirmar?"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setArmado(true)}
      aria-label={`Eliminar ${titulo}`}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
