import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ramadan Calendar Bangladesh",
    short_name: "Ramadan",
    description: "Ramadan prayer times and calendar for Bangladesh",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#ff6b00",
    icons: [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
