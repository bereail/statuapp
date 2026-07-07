import { randomUUID } from "node:crypto";
import { readBinary, writeBinary, remove } from "@/lib/storage/blobStore";

const STORE_NAME = "statuapp-media";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB

function extensionFor(contentType: string): string {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "bin";
  }
}

/** Guarda una imagen y devuelve la URL pública desde donde se sirve. */
export async function saveImage(
  data: ArrayBuffer,
  contentType: string,
  hint?: string
): Promise<{ key: string; url: string }> {
  const slug = (hint ?? "imagen")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

  const key = `estatuas/${slug || "imagen"}-${randomUUID()}.${extensionFor(contentType)}`;
  await writeBinary(STORE_NAME, key, data, contentType);
  return { key, url: `/api/media/${key}` };
}

export async function getImage(key: string) {
  return readBinary(STORE_NAME, key);
}

export async function deleteImage(key: string) {
  await remove(STORE_NAME, key);
}

/** Extrae la key de storage a partir de una URL "/api/media/<key>". */
export function keyFromMediaUrl(url: string): string | null {
  const prefix = "/api/media/";
  if (!url.startsWith(prefix)) return null;
  return decodeURIComponent(url.slice(prefix.length));
}
