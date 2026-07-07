import { getStore } from "@netlify/blobs";
import { promises as fs } from "node:fs";
import path from "node:path";

// En Netlify (prod) usamos Netlify Blobs, que persiste entre invocaciones de funciones.
// En desarrollo local (next dev sin netlify dev) no hay contexto de Blobs disponible,
// así que guardamos todo en un directorio .data/ (gitignoreado) para poder trabajar sin
// depender de la CLI de Netlify.
const isNetlifyRuntime = Boolean(
  process.env.NETLIFY || process.env.NETLIFY_BLOBS_CONTEXT
);

const LOCAL_ROOT = path.join(process.cwd(), ".data");

function localPathFor(storeName: string, key: string) {
  // el key puede incluir "/" (p. ej. medias/foo.jpg); lo mantenemos como subcarpetas
  return path.join(LOCAL_ROOT, storeName, key);
}

async function localReadJSON<T>(storeName: string, key: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(localPathFor(storeName, `${key}.json`), "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function localWriteJSON(storeName: string, key: string, value: unknown) {
  const filePath = localPathFor(storeName, `${key}.json`);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf-8");
}

async function localReadBinary(
  storeName: string,
  key: string
): Promise<{ data: ArrayBuffer; contentType: string } | null> {
  try {
    const filePath = localPathFor(storeName, key);
    const [data, metaRaw] = await Promise.all([
      fs.readFile(filePath),
      fs.readFile(`${filePath}.meta.json`, "utf-8").catch(() => null),
    ]);
    const meta = metaRaw ? JSON.parse(metaRaw) : { contentType: "application/octet-stream" };
    const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
    return { data: buffer, contentType: meta.contentType };
  } catch {
    return null;
  }
}

async function localWriteBinary(
  storeName: string,
  key: string,
  data: ArrayBuffer,
  contentType: string
) {
  const filePath = localPathFor(storeName, key);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, Buffer.from(data));
  await fs.writeFile(`${filePath}.meta.json`, JSON.stringify({ contentType }), "utf-8");
}

async function localDelete(storeName: string, key: string) {
  const filePath = localPathFor(storeName, key);
  await Promise.all([
    fs.rm(filePath, { force: true }),
    fs.rm(`${filePath}.meta.json`, { force: true }),
    fs.rm(localPathFor(storeName, `${key}.json`), { force: true }),
  ]);
}

/** Lee un valor JSON de un store. Devuelve `fallback` si no existe. */
export async function readJSON<T>(storeName: string, key: string, fallback: T): Promise<T> {
  if (isNetlifyRuntime) {
    const store = getStore(storeName);
    const val = await store.get(key, { type: "json" });
    return (val as T) ?? fallback;
  }
  const val = await localReadJSON<T>(storeName, key);
  return val ?? fallback;
}

/** Escribe un valor JSON en un store. */
export async function writeJSON(storeName: string, key: string, value: unknown): Promise<void> {
  if (isNetlifyRuntime) {
    const store = getStore(storeName);
    await store.setJSON(key, value);
    return;
  }
  await localWriteJSON(storeName, key, value);
}

/** Lee un binario (imagen) de un store junto con su content-type. */
export async function readBinary(
  storeName: string,
  key: string
): Promise<{ data: ArrayBuffer; contentType: string } | null> {
  if (isNetlifyRuntime) {
    const store = getStore(storeName);
    const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
    if (!result) return null;
    const contentType =
      (result.metadata?.contentType as string | undefined) ?? "application/octet-stream";
    return { data: result.data, contentType };
  }
  return localReadBinary(storeName, key);
}

/** Escribe un binario (imagen) en un store con su content-type. */
export async function writeBinary(
  storeName: string,
  key: string,
  data: ArrayBuffer,
  contentType: string
): Promise<void> {
  if (isNetlifyRuntime) {
    const store = getStore(storeName);
    await store.set(key, data, { metadata: { contentType } });
    return;
  }
  await localWriteBinary(storeName, key, data, contentType);
}

/** Elimina una clave (JSON o binaria) de un store. */
export async function remove(storeName: string, key: string): Promise<void> {
  if (isNetlifyRuntime) {
    const store = getStore(storeName);
    await store.delete(key);
    return;
  }
  await localDelete(storeName, key);
}
