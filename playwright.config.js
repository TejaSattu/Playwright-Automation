import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  fullyParallel: false,

  globalSetup: './globalsetup.js',

  reporter: [
    ['html'],
    ['allure-playwright'],
  ],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    retries: 1,

    viewport: null, // required for maximize
    launchOptions: {
      args: ['--start-maximized'],
    },
  },

  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
        headless: false,
      },
    },
    {
      name: 'edge',
      use: {
        browserName: 'chromium',
        channel: 'msedge',
        headless: false,
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        headless: false,
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
        headless: false,
      },
    },
  ],
});