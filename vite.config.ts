import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  // Set via the workflow for GitHub Pages (e.g. "/mom-bday-2026/").
  // Falls back to "/" for local dev.
  base: process.env.VITE_BASE ?? "/",
  plugins: [react(), tailwindcss()],
});
