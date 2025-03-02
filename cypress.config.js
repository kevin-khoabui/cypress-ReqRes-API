const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://reqres.in/api", // Base URL for API tests
    video: true
  },
});
