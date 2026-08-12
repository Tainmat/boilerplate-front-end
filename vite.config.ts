import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiOrigin = new URL(env.VITE_API_URL).origin;

  return {
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
          target: apiOrigin,
          changeOrigin: true,
          secure: false, // apenas se for ambiente de teste sem certificado válido
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    } as any,
  };
});
