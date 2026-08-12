import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

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
  plugins: [react()],
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
