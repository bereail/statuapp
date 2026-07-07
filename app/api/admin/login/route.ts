import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { ADMIN_SESSION_COOKIE, createSessionToken } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!adminUser || !adminPass || !secret) {
    console.error("Faltan variables de entorno ADMIN_USER / ADMIN_PASS / ADMIN_SESSION_SECRET");
    return NextResponse.json(
      { ok: false, error: "El panel admin no está configurado en el servidor." },
      { status: 500 }
    );
  }

  let body: { usuario?: string; password?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });
  }

  const usuario = body.usuario ?? "";
  const password = body.password ?? "";

  const usuarioOk = safeEqual(usuario, adminUser);
  const passOk = safeEqual(password, adminPass);

  if (!usuarioOk || !passOk) {
    return NextResponse.json({ ok: false, error: "Usuario o contraseña incorrectos." }, { status: 401 });
  }

  const token = await createSessionToken(usuario, secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
