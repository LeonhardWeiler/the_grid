import { defineConfig } from "vite";

export default defineConfig({
  root: "frontend",
  build: {
    outDir: "../public/dist",
    emptyOutDir: true
  },
  server: {
    port: 5173
  }
});
