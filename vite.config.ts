import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Optionally set port if you want, e.g.:
     server: { port: 8080 }
});