import type { MetadataRoute } from "next";
import { BRAND_BG } from "./_icons/BustMark";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "StatuApp — Patrimonio escultórico de Rosario",
    short_name: "StatuApp",
    description: "Explorá las estatuas y monumentos de Rosario, su historia y ubicación.",
    start_url: "/",
    display: "standalone",
    background_color: BRAND_BG,
    theme_color: BRAND_BG,
    icons: [
      { src: "/icon1", sizes: "192x192", type: "image/png" },
      { src: "/icon2", sizes: "512x512", type: "image/png" },
    ],
  };
}
