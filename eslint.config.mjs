import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  {
    ignores: [".next/**", "node_modules/**"],
  },
  // Basic Next.js configuration is usually handled by the 'next' plugin
  // but for now we'll just keep it simple to avoid iterability errors
]);

export default eslintConfig;
