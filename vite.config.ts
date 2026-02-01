import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
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
        description: "Sistema UsinCheck",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
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
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff,woff2}"],

        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],

        // Desabilita a página de offline padrão do workbox
        offlineGoogleAnalytics: false,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,

        runtimeCaching: [
          // Cache para chamadas de API - Network First
          {
            urlPattern: /^https:\/\/(qas-)?usincheck\.jometto\.com\.br\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 horas
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              networkTimeoutSeconds: 10, // Timeout de 10s
            },
          },
          // Cache para imagens - Cache First
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
              },
            },
          },
          // Cache para fontes - Cache First
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "fonts-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true, // Habilita PWA em desenvolvimento
        type: "module",
      },
    }),
  ],
  server: {
    port: 15975,
    host: "0.0.0.0",
    strictPort: false,
    allowedHosts: [".ngrok-free.app", ".ngrok.io", "localhost"],
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
