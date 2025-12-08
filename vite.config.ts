import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@assets": path.resolve(__dirname, "src/assets"),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "UsinCheck",
        short_name: "UsinCheck",
        description: "",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/logos/logo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logos/logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    port: 15975,
    host: "0.0.0.0",
    strictPort: false,
    allowedHosts: [".ngrok-free.app", ".ngrok.io", "localhost"],
    hmr: {
      clientPort: 443,
    },
    proxy: {
      "/api": {
        target: "https://qas-usincheck.jometto.com.br/",
        changeOrigin: true,
        secure: false, // apenas se for ambiente de teste sem certificado válido
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  } as any,
});
