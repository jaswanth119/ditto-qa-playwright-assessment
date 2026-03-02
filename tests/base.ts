import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

import { DittoHomePage } from '../pages/DittoHomePage';
import { DittoPolicyPage } from '../pages/DittoPolicyPage';
import { DittoHealthFormPage } from '../pages/DittoHealthFormPage';

type Pages = {
  dittoHome: DittoHomePage;
  policyPage: DittoPolicyPage;
  formPage: DittoHealthFormPage;
};

type UseFixture<T> = (fixture: T) => Promise<void>;

export const test = base.extend<Pages>({
  dittoHome: async ({ page }: { page: Page }, use: UseFixture<DittoHomePage>) => {
    await use(new DittoHomePage(page));
  },
  policyPage: async ({ page }: { page: Page }, use: UseFixture<DittoPolicyPage>) => {
    await use(new DittoPolicyPage(page));
  },
  formPage: async ({ page }: { page: Page }, use: UseFixture<DittoHealthFormPage>) => {
    await use(new DittoHealthFormPage(page));
  },
});

export { expect };
