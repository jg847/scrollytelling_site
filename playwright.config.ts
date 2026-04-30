import { defineConfig } from "@playwright/test";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const previewRoot = ".playwright-preview";
const previewMount = `${previewRoot}${basePath}`;

export default defineConfig({
  testDir: "./tests/browser",
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: `rm -rf ${previewRoot} && mkdir -p ${previewMount} && npm run build && cp -R out/. ${previewMount} && npx serve ${previewRoot} -l 4321`,
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: `http://127.0.0.1:4321${basePath}`,
    trace: "on-first-retry",
  },
});
