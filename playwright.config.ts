import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
    screenshot: "off",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080",
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    { name: "375px", use: { browserName: "chromium", viewport: { width: 375, height: 812 } } },
    { name: "390px", use: { browserName: "chromium", viewport: { width: 390, height: 844 } } },
    { name: "414px", use: { browserName: "chromium", viewport: { width: 414, height: 896 } } },
    { name: "768px", use: { browserName: "chromium", viewport: { width: 768, height: 1024 } } },
  ],
});
