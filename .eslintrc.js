module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential"],
  // extends: ["plugin:vue/strongly-recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": 1,
    "vuetify/no-deprecated-classes": "error",
    // "vue/attributes-order": "warn",
    // "vue/order-in-components": "warn",
    "vue/html-self-closing": "off",
  },
  parserOptions: {
    parser: "babel-eslint",
  },
  plugins: [
    'vuetify'
  ],
};
