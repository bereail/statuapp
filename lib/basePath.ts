// Cuando la app se sirve bajo un subpath (p. ej. ailonline.com.ar/statuapp),
// Next.js le agrega el basePath solo a <Link>, <Image> y al router — no a
// fetch() ni a <a href> crudos. Este helper cubre esos casos.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}
