import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
      manifest: {
        name: "WebStatus",
        short_name: "WebStatus",
        theme_color: "#e9e1fe",
        icons: [
          {
            src: "/assets/icon/favicon.png",
            sizes:
              "16x16 24x24 32x32 64x64 72x72 96x96 128x128 144x144 152x152 192x192 384x384 512x512",
            type: "image/png",
          },
        ],
        start_url: ".",
        display: "standalone",
        background_color: "#f5f5f5",
      },
    }),
  ],
});
