import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}", "src/**/__tests__/**/*.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
    setupFiles: ["vitest-setup.ts"],
  },
  resolve: {
    alias: {
      "@": "/Users/krzysztofpalpuchowski/Documents/GitHub/edu-report-v3-nextjs/src",
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  define: {
    "import.meta.vitest": "undefined",
  },
  assetsInclude: ["**/*.css"],
});
