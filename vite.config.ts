import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
// GitHub Pages repository path. QA builds served from a domain root set SITE_BASE=/ .
const base = process.env.SITE_BASE ?? '/indigo-vienna/';
export default defineConfig({
  base,
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  css: { postcss: { plugins: [tailwindcss()] } },
  plugins: [react()],
});
