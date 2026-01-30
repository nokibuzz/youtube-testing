import { type Page, type Locator, expect } from '@playwright/test';
import { Selectors } from '../data/selectors';

/**
 * Base Page Object class containing common functionality
 * All page objects should extend this class
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the page URL
   */
  abstract goto(): Promise<void>;

  /**
   * Wait for page to be fully loaded
   */
  abstract waitForPageLoad(): Promise<void>;

  // ==================== Common Navigation Methods ====================

  /**
   * Click on YouTube logo to go to homepage
   */
  async clickLogo(): Promise<void> {
    await this.page.locator(Selectors.common.logo)?.first().click();
  }

  /**
   * Search for a query using the search bar
   */
  async search(query: string): Promise<void> {
    const searchInput = this.page.locator(Selectors.common.searchInput);
    await searchInput.fill(query);
    await this.page.locator(Selectors.common.searchButton).click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Open the sidebar/guide menu
   */
  async openSidebar(): Promise<void> {
    await this.page.locator(Selectors.common.menuButton).click();
    await this.page.locator(Selectors.sidebar.guideContent).waitFor({ state: 'visible' });
  }

  // ==================== Consent/Cookie Handling ====================

  /**
   * Handle YouTube consent dialog if present
   */
  async handleConsentDialog(accept: boolean = true): Promise<void> {
    const consentDialog = this.page.locator(Selectors.consent.dialog);
    
    try {
      await consentDialog.waitFor({ state: 'visible', timeout: 5000 });
      
      if (accept) {
        await this.page.locator(Selectors.consent.acceptButton).click();
      } else {
        await this.page.locator(Selectors.consent.rejectButton).click();
      }
      
      await consentDialog.waitFor({ state: 'hidden' });
    } catch {
      // Consent dialog not present, continue
    }
  }

  // ==================== Utility Methods ====================

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for DOM content to be loaded
   */
  async waitForDomContentLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ 
      path: `screenshots/${name}.png`,
      fullPage: false 
    });
  }

  /**
   * Scroll to element
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Wait for element and return it
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    const locator = this.page.locator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    return locator;
  }

  /**
   * Press keyboard key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Get element text content
   */
  async getTextContent(locator: Locator): Promise<string | null> {
    return await locator.textContent();
  }
}
