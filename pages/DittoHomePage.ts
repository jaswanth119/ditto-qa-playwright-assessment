import { Page } from '@playwright/test';

export class DittoHomePage {
  private readonly baseUrl = 'https://app.joinditto.in/fq';

  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto(this.baseUrl, { 
      waitUntil: 'load', 
      timeout: 60000 
    });
  }

  async selectHealthProduct(productName: string = 'Optima Secure'): Promise<void> {
    await this.page.getByText(productName, { exact: false }).first().click();
  }
}
