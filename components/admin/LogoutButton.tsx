"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loading}>
      <LogOut className="size-4" />
      Cerrar sesión
    </Button>
  );
}
