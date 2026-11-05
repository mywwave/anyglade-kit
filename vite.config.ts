import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["packages/kit/styles/box.css", "packages/kit/styles/tokens.css"],
  },
  lint: {
    plugins: ["oxc", "typescript", "unicorn", "react", "jsx-a11y"],
    jsPlugins: [
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
      { name: "anyglade", specifier: "./packages/kit/oxlint/index.mjs" },
    ],
    categories: { correctness: "error" },
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    overrides: [
      {
        files: ["apps/playground/src/**/*.tsx"],
        rules: {
          "anyglade/no-raw-layout": "error",
          "anyglade/no-raw-text": "error",
          "anyglade/no-typography-utility": "error",
          "anyglade/no-spacing-utility": "error",
          "anyglade/no-foreign-import": "error",
          "anyglade/no-dark-variant": "error",
          "anyglade/no-arbitrary-value": "error",
        },
      },
    ],
    options: { typeAware: true, typeCheck: true },
  },
  run: {
    cache: true,
  },
});
