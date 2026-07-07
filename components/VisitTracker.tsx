"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const body = JSON.stringify({ path: pathname });
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon("/api/track", blob)) {
      fetch("/api/track", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
