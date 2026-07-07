"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { withBasePath } from "@/lib/basePath";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const body = JSON.stringify({ path: pathname });
    const blob = new Blob([body], { type: "application/json" });
    const trackUrl = withBasePath("/api/track");
    if (!navigator.sendBeacon(trackUrl, blob)) {
      fetch(trackUrl, { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
