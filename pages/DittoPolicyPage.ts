import { Page, expect } from '@playwright/test';

export class DittoPolicyPage {
  constructor(private page: Page) {}

  async expandAndValidateMainBenefits(): Promise<void> {
    const mainBenefitsSection = this.page.getByText('Main Benefits').first();
    await mainBenefitsSection.click();
    
    await expect(this.page.getByText('Hospitalization').first()).toBeVisible();
    await expect(this.page.getByText('Room Category').first()).toBeVisible();
    await expect(this.page.getByText('Pre-Hospitalization').first()).toBeVisible();
    await expect(this.page.getByText('Post-Hospitalization').first()).toBeVisible();
    await expect(this.page.getByText('Day Care Treatments').first()).toBeVisible();
    await expect(this.page.getByText('Ayush Treatment').first()).toBeVisible();
    
    await this.scrollToNextButtonIfNeeded();
  }

  async clickNext(): Promise<void> {
    const nextButton = this.page.getByRole('button', { name: /next/i });
    await nextButton.click();
  }

  async expandAndValidateWaitingPeriods(): Promise<void> {
    const waitingPeriodsSection = this.page.getByText('Waiting Periods').first();
    await waitingPeriodsSection.click();
    
    await this.scrollToNextButtonIfNeeded();
  }

  async expandAndValidateWhatsNotCovered(): Promise<void> {
    const whatsNotCoveredSection = this.page.getByText(/what'?s\s*not\s*covered/i).first();
    await whatsNotCoveredSection.click();
    
    await this.scrollToNextButtonIfNeeded();
  }

  async expandAndValidateExtraBenefits(): Promise<void> {
    const extraBenefitsSection = this.page.getByText('Extra Benefits').first();
    await extraBenefitsSection.click();
    
    await this.scrollToContinueButtonIfNeeded();
  }

  async clickContinue(): Promise<void> {
    const continueButton = this.page.getByRole('button', { name: /continue/i });
    await continueButton.click();
  }

  private async scrollToNextButtonIfNeeded(): Promise<void> {
    const nextButton = this.page.getByRole('button', { name: /next/i });
    await nextButton.scrollIntoViewIfNeeded();
  }

  private async scrollToContinueButtonIfNeeded(): Promise<void> {
    const continueButton = this.page.getByRole('button', { name: /continue/i });
    await continueButton.scrollIntoViewIfNeeded();
  }
}
