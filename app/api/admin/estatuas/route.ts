import { NextResponse } from "next/server";
import { listStatues, createStatue, SlugTakenError } from "@/lib/storage/statues";
import { statueFormSchema } from "@/lib/validation/statue";
import { formValuesToStatuePayload } from "@/lib/storage/statueMapper";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const estatuas = await listStatues();
  return NextResponse.json({ ok: true, estatuas });
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });

  const parsed = statueFormSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos.", detalles: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const payload = formValuesToStatuePayload(parsed.data);
    const creada = await createStatue(payload);
    return NextResponse.json({ ok: true, estatua: creada }, { status: 201 });
  } catch (err) {
    if (err instanceof SlugTakenError) {
      return NextResponse.json({ ok: false, error: err.message }, { status: 409 });
    }
    console.error("Error creando estatua:", err);
    return NextResponse.json({ ok: false, error: "No se pudo crear la estatua." }, { status: 500 });
  }
}
