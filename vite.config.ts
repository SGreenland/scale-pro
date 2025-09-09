import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
    resolve: {
    alias: {
      "@scalemaestro/shared-types": path.resolve(
        __dirname,
        "packages/shared-types"
      ),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:4000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // optional if your backend uses the same route prefix
      },
    },
  },
});
