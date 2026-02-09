const { Before, After } = require('@cucumber/cucumber');

Before(function () {
  console.log("🚀 Scenario started");
});

After(function () {
  console.log("✅ Scenario finished");
});
