import { defineConfig, devices } from '@playwright/test';
import type {TestOptions} from './test-options'

require('dotenv').config();
export default defineConfig<TestOptions>({
  retries: 1,
  reporter: 'html',

  use: {
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: process.env.DEV == '1' ? 'http://localhost:4201/'
        : process.env.UAT == '1' ? 'http://localhost:4202/' : 'http://localhost:4200/',
    trace: 'on-first-retry',
    video: 'off',
  },

  projects: [
    {
      name: 'chromium',
    },

    {
      name: 'firefox',
      use: { 
        browserName: 'firefox',
       },
    },

    {
      name: 'dev',
      use: { ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4201/'
       },
    },

    {
      name: 'uat',
      use: { ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4202/',
       },
    },
    {
      name: 'pageObjectsFullScreen',
      testMatch: 'usePageObjects.spec.ts',
      use: { 
        viewport: { width: 1920, height: 1080 },
       },
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: { ...devices['iPhone 13 Pro'] },
    }
  ],
});
