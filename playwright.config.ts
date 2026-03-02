import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: ['tests/**/*.spec.ts'],
  timeout: 120000,
  retries: 1,
  use: {
    headless: false,
    viewport: null,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    permissions: ['geolocation'],
    geolocation: { latitude: 19.0760, longitude: 72.8777 },
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled',
            '--disable-infobars',
            '--start-maximized',
            '--disable-http2',
            '--disable-quic',
          ],
          headless: false,
        },
      },
    },
  ],
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
});
