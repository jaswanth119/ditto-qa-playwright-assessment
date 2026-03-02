import { Page, expect } from '@playwright/test';

export interface PremiumBreakdown {
  basePremium: number;
  riders: number;
  gst: number;
  totalPremium: number;
}

export class DittoHealthFormPage {
  constructor(private page: Page) {}

  async validateFamilySelectionPage(): Promise<void> {
    await expect(this.page.getByText('Who all do you want to buy health insurance for?')).toBeVisible();
  }

  async selectFamilyMembers(members: {
    selfGender: 'Male' | 'Female';
    spouseGender?: 'Male' | 'Female';
    sons?: number;
    daughters?: number;
  }): Promise<void> {
    const selfChip = this.getMemberChip('Self');
    await selfChip.getByText('Self', { exact: true }).click();
    await selfChip.getByText(members.selfGender, { exact: true }).click();

    if (members.spouseGender) {
      const spouseChip = this.getMemberChip('Spouse');
      await spouseChip.getByText('Spouse', { exact: true }).click();
      await spouseChip.getByText(members.spouseGender, { exact: true }).click();
    }

    if (members.sons && members.sons > 0) {
      const sonChip = this.getMemberChip('Son');
      const sonPlusButton = sonChip.locator('button').nth(1);
      
      for (let i = 0; i < members.sons; i++) {
        await sonPlusButton.click();
      }
    }

    if (members.daughters && members.daughters > 0) {
      const daughterChip = this.getMemberChip('Daughter');
      const daughterPlusButton = daughterChip.locator('button').nth(1);
      
      for (let i = 0; i < members.daughters; i++) {
        await daughterPlusButton.click();
      }
    }
  }

  private getMemberChip(memberName: string) {
    const chipLabel = this.page.locator('label').filter({ hasText: memberName }).first();
    return chipLabel;
  }

  async clickNextStep(): Promise<void> {
    await this.page.getByRole('button', { name: /next step/i }).click();
  }

  async validateFamilyDetailsPage(): Promise<void> {
    await expect(this.page.getByText('Tell us about your family')).toBeVisible();
    await expect(this.page.getByText(/age\s*&\s*pincode/i)).toBeVisible();
  }

  async fillAgeAndPincode(details: {
    selfAge: number | string;
    spouseAge?: number | string;
    firstSonAge?: number | string;
    firstDaughterAge?: number | string;
    pincode: number | string;
  }): Promise<void> {
    await this.page.getByPlaceholder('Your age').fill(String(details.selfAge));

    if (details.spouseAge !== undefined) {
      await this.page.getByPlaceholder("Spouse's age").fill(String(details.spouseAge));
    }

    if (details.firstSonAge !== undefined) {
      await this.page.getByPlaceholder("First son's age").fill(String(details.firstSonAge));
    }

    if (details.firstDaughterAge !== undefined) {
      await this.page.getByPlaceholder("First daughter's age").fill(String(details.firstDaughterAge));
    }

    await this.page.getByPlaceholder('Enter your pin code').fill(String(details.pincode));
  }

  async clickCalculatePremium(): Promise<void> {
    const button = this.page.getByRole('button', { name: /calculate premium/i });
    await button.scrollIntoViewIfNeeded();
    await button.click();
  }

  async waitForPremiumResults(): Promise<void> {
    await expect(this.page.getByText(/premium/i).first()).toBeVisible({ timeout: 30000 });
  }

  async extractPremiumBreakdown(): Promise<PremiumBreakdown> {
    const breakdown: PremiumBreakdown = {
      basePremium: 0,
      riders: 0,
      gst: 0,
      totalPremium: 0
    };

    breakdown.basePremium = await this.extractAmountByText(['Base Premium', 'Base Price']);
    breakdown.riders = await this.extractSelectedAddOnsTotal();
    breakdown.gst = await this.extractAmountByText(['GST']);
    breakdown.totalPremium = await this.extractAmountByText(['Total Premium', 'Total Amount']);

    return breakdown;
  }

  private parseCurrency(text: string): number {
    const amountMatch = text.match(/₹\s*([\d,]+(?:\.\d{1,2})?)/);
    if (!amountMatch) return 0;
    return parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  private async extractAmountByText(textVariations: string[]): Promise<number> {
    for (const text of textVariations) {
      try {
        const element = this.page.getByText(new RegExp(text, 'i')).first();
        if (await element.isVisible({ timeout: 2000 })) {
          const parent = element.locator('..');
          const content = await parent.textContent() || await element.textContent() || '';
          
          const parsed = this.parseCurrency(content);
          if (parsed) return parsed;
        }
      } catch { /* try next */ }
    }
    return 0;
  }

  private async extractSelectedAddOnsTotal(): Promise<number> {
    const checked = this.page.getByRole('checkbox').filter({ has: this.page.locator(':checked') });
    const count = await checked.count();
    if (count === 0) return 0;

    let total = 0;
    for (let i = 0; i < count; i++) {
      const checkbox = checked.nth(i);
      const row = checkbox.locator('xpath=ancestor::*[self::label or self::div][1]');
      const text = (await row.textContent()) || (await checkbox.locator('..').textContent()) || '';
      total += this.parseCurrency(text);
    }
    return total;
  }

  async verifyPremiumCalculation(): Promise<boolean> {
    const breakdown = await this.extractPremiumBreakdown();
    const calculatedTotal = breakdown.basePremium + breakdown.riders + breakdown.gst;
    const displayedTotal = breakdown.totalPremium;
    const tolerance = 1;
    return Math.abs(calculatedTotal - displayedTotal) <= tolerance;
  }
}
