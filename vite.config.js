import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: if your repo is https://github.com/Avishka-55/<REPO_NAME>
  // then base must be "/<REPO_NAME>/"
  base: "/OUSL-GPA-Analyzer/",
});