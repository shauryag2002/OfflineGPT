// eslint.config.js

const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],

    rules: {
      // Disallow imports like ../ or ../../
      // "import/no-relative-parent-imports": "error",

      "no-console": "warn",

      "no-unused-vars": "warn",

      eqeqeq: ["error", "always"],

      curly: "error",
    },
  },
]);
