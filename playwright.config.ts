import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 3,
  timeout: 30000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: "http://127.0.0.1:4174", channel: "chrome", trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: { command: "npm run start", url: "http://127.0.0.1:4174", reuseExistingServer: true, timeout: 30000 },
});
