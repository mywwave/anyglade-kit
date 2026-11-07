import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

export default defineConfig({
  // GitHub Pages serves the playground under the repository name; locally it stays at the root.
  base: process.env.PLAYGROUND_BASE ?? "/",
  plugins: [react(), tailwindcss()],
  publicDir: "../../packages/kit/assets",
  resolve: {
    tsconfigPaths: true,
  },
});
