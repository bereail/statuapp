import { NextResponse } from "next/server";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, saveImage } from "@/lib/storage/mediaStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  const hint = formData.get("hint");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No se envió ningún archivo." }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return NextResponse.json(
      { ok: false, error: "Formato no soportado. Usá JPG, PNG, WEBP o GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { ok: false, error: `La imagen supera el tamaño máximo de ${MAX_IMAGE_BYTES / (1024 * 1024)}MB.` },
      { status: 400 }
    );
  }

  const buffer = await file.arrayBuffer();
  const { url } = await saveImage(buffer, file.type, typeof hint === "string" ? hint : undefined);

  return NextResponse.json({ ok: true, url });
}
