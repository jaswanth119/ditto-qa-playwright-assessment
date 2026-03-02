import { test, expect } from './base';
import { testData } from '../fixtures/testData';
import type { Page } from '@playwright/test';

import type { DittoHomePage } from '../pages/DittoHomePage';
import type { DittoPolicyPage } from '../pages/DittoPolicyPage';
import type { DittoHealthFormPage } from '../pages/DittoHealthFormPage';

test.describe('Ditto Insurance - HDFC ERGO Optima Secure', () => {

  test('Complete flow: Select product, validate policy sections, and fill form', async ({
    page,
    dittoHome,
    policyPage,
    formPage,
  }: {
    page: Page;
    dittoHome: DittoHomePage;
    policyPage: DittoPolicyPage;
    formPage: DittoHealthFormPage;
  }) => {
    await dittoHome.navigate();
    await dittoHome.selectHealthProduct(testData.productName);
    
    await policyPage.expandAndValidateMainBenefits();
    await policyPage.clickNext();
    
    await policyPage.expandAndValidateWaitingPeriods();
    await policyPage.clickNext();
    
    await policyPage.expandAndValidateWhatsNotCovered();
    await policyPage.clickNext();
    
    await policyPage.expandAndValidateExtraBenefits();
    await policyPage.clickContinue();

    await formPage.validateFamilySelectionPage();
    
    await formPage.selectFamilyMembers(testData.family);

    await formPage.clickNextStep();

    await formPage.validateFamilyDetailsPage();
    await formPage.fillAgeAndPincode(testData.details);
    await formPage.clickCalculatePremium();
    await formPage.waitForPremiumResults();

    await expect(async () => {
      const isValid = await formPage.verifyPremiumCalculation();
      expect(isValid).toBeTruthy();
    }).toPass();

    expect(page.url()).toContain('joinditto.in');
  });

});
