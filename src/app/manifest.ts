import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Grid Notes",
    short_name: "Grid Notes",
    description: "An infinite canvas for your ideas.",
    start_url: "/canvas",
    display: "standalone",
    background_color: "#111820",
    theme_color: "#1E272C",
    orientation: "any",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/canvas-preview.png",
        sizes: "1280x800",
        type: "image/png",
      },
    ],
  };
}
