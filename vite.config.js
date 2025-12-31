import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr"; // 1. ייבוא התוסף

export default defineConfig({
  plugins: [react(), svgr()],
});