import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000", // your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // optional if your backend uses the same route prefix
      },
    },
  },
});
