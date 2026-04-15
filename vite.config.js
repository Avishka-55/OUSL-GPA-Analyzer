import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Use root path for dev, subdirectory for production GitHub Pages
  base: process.env.NODE_ENV === "production" ? "/OUSL-GPA-Analyzer/" : "/",
});