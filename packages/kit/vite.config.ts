import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/index.ts", "src/icons.ts", "src/charts.ts", "src/ai.ts"],
    platform: "neutral",
    unbundle: true,
    dts: {
      generator: "tsgo",
    },
    publint: true,
  },
});
