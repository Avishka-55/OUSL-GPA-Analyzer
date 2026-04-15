import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Root path for local dev, repo path for production builds (GitHub Pages).
  base: command === "build" ? "/OUSL-GPA-Analyzer/" : "/",
}));