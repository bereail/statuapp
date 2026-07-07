// El optimizador integrado de next/image (/_next/image) no resuelve bien
// las imágenes locales cuando la app corre bajo un basePath: busca el
// archivo sin el prefijo y siempre devuelve 400. Este loader sirve las
// imágenes originales directo, con el prefijo agregado a mano.
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  if (/^https?:\/\//.test(src)) return src;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${src}`;
}
