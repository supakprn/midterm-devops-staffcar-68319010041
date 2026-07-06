// eslint.config.js
// ตั้งค่า ESLint แบบ Flat Config (ตามที่เรียนใน Week 5)

const globals = require("globals");

module.exports = [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "eqeqeq": "warn",
      "semi": ["warn", "always"],
    },
  },
];
// ปรับปรุงล่าสุดสำหรับ midterm-devops
