module.exports = {
  root: true,
  extends: [
    "@neuvernetzung/eslint-config-custom",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-var-requires": "off",
  },
};
