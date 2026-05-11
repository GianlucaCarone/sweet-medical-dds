import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["packages/backend/**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    languageOptions: { globals: globals.node },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "warn",
      "no-var": "error",
      "prefer-const": "error",
      "eqeqeq": ["error", "always"],
      "no-implicit-globals": "error",
      "no-duplicate-imports": "error",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }]
    },
    extends: ["js/recommended"],
  },
  {
    files: ["packages/frontend/src/**/*.{js,jsx,mjs,cjs}"],
    ...pluginReact.configs.flat.recommended,
    settings: { react: { version: "detect" } },
  },
]);
