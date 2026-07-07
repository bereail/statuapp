import { NextResponse } from "next/server";
import { registrarVisita } from "@/lib/storage/visits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const path = typeof json?.path === "string" ? json.path : null;

  if (!path || path.startsWith("/admin") || path.startsWith("/api")) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  await registrarVisita(path);
  return NextResponse.json({ ok: true });
}
