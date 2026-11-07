import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: "../../packages/kit/assets",
  resolve: {
    tsconfigPaths: true,
  },
});
