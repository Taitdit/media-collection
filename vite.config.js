import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/bgg": {
        target: "https://boardgamegeek.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bgg/, ""),
      },
    },
  },
});