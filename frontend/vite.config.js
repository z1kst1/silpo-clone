import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Обов'язково, щоб Докер випустив сайт назовні
    port: 5173,
    watch: {
      usePolling: true, // Та сама магія для Windows, яка сама оновлюватиме сторінку
    },
    proxy: {
      "/api": {
        target: "http://backend:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
