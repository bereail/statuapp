// Sesión de administrador firmada con HMAC-SHA256 usando Web Crypto,
// para poder verificarla tanto en middleware (Edge) como en route handlers (Node).

export const ADMIN_SESSION_COOKIE = "statuapp_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  arr.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): Uint8Array {
  const padLength = (4 - (input.length % 4)) % 4;
  const padded = input.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(padLength);
  const binary = atob(padded);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return arr;
}

async function getSigningKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

type SessionPayload = { usuario: string; exp: number };

export async function createSessionToken(usuario: string, secret: string): Promise<string> {
  const payload: SessionPayload = { usuario, exp: Date.now() + SESSION_TTL_MS };
  const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await getSigningKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadB64));
  return `${payloadB64}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(
  token: string | undefined | null,
  secret: string
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [payloadB64, sigB64] = token.split(".");
  if (!payloadB64 || !sigB64) return null;

  try {
    const key = await getSigningKey(secret);
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(sigB64) as BufferSource,
      encoder.encode(payloadB64)
    );
    if (!isValid) return null;

    const payload = JSON.parse(decoder.decode(fromBase64Url(payloadB64))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
