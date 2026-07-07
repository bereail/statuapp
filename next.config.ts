import type { NextConfig } from "next";

// Permite desplegar la app bajo un subpath (p. ej. ailonline.com.ar/statuapp)
// sin afectar el desarrollo local, donde NEXT_PUBLIC_BASE_PATH no está seteada.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  basePath,
};


export default nextConfig;
