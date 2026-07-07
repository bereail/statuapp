import { NextResponse } from "next/server";
import { getStatue, updateStatue, deleteStatue, SlugTakenError } from "@/lib/storage/statues";
import { statueFormSchema } from "@/lib/validation/statue";
import { formValuesToStatuePayload } from "@/lib/storage/statueMapper";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const estatua = await getStatue(slug);
  if (!estatua) return NextResponse.json({ ok: false, error: "No encontrada." }, { status: 404 });
  return NextResponse.json({ ok: true, estatua });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });

  const parsed = statueFormSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos.", detalles: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existente = await getStatue(slug);
  if (!existente) return NextResponse.json({ ok: false, error: "No encontrada." }, { status: 404 });

  try {
    const payload = formValuesToStatuePayload(
      parsed.data,
      existente.author?.id,
      existente.location?.id
    );
    const actualizada = await updateStatue(slug, payload);
    return NextResponse.json({ ok: true, estatua: actualizada });
  } catch (err) {
    if (err instanceof SlugTakenError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 409 });
    }
    console.error("Error actualizando estatua:", err);
    return NextResponse.json({ ok: false, error: "No se pudo actualizar la estatua." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await deleteStatue(slug);
  return NextResponse.json({ ok: true });
}
