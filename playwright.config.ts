import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: "npm run build && npx serve out -l 4321",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "on-first-retry",
  },
});
