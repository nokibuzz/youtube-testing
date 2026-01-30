import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Selectors } from '../data/selectors';
import type { VideoThumbnail } from '../types/youtube.types';

/**
 * Page Object for YouTube Homepage
 * Contains methods to interact with homepage elements
 */
export class HomePage extends BasePage {
  // Locators
  readonly videoThumbnails: Locator;
  readonly chipBar: Locator;
  readonly searchInput: Locator;
  readonly contentSection: Locator;
  readonly emptyStateContainer: Locator;
  readonly emptyStateMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.videoThumbnails = page.locator(Selectors.homepage.videoRenderer);
    this.chipBar = page.locator(Selectors.homepage.chipBar);
    this.searchInput = page.locator(Selectors.common.searchInput);
    this.contentSection = page.locator(Selectors.homepage.contentSection);
    this.emptyStateContainer = page.locator(Selectors.homepage.emptyStateContainer);
    this.emptyStateMessage = page.locator(Selectors.homepage.emptyStateMessage);
  }

  // ==================== Navigation ====================

  /**
   * Navigate to YouTube homepage
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.handleConsentDialog();
  }

  /**
   * Wait for homepage to fully load (handles both empty state and videos state)
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    // Wait for either videos to appear OR empty state message
    // await Promise.race([
    //   this.videoThumbnails.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {}),
    this.emptyStateContainer.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
    // ]);
  }

  // ==================== Empty State ====================

  /**
   * Check if homepage is in empty state (no video recommendations)
   */
  async isEmptyState(): Promise<boolean> {
    return await this.page.locator(Selectors.homepage.emptyStateContainer).isVisible();
  }

  async getSearchInput(): Promise<Locator> {
    return this.searchInput;
  }

  async getSearchButton(): Promise<Locator> {
    return this.page.locator(Selectors.common.searchButton);
  }

  /**
   * Get empty state message text
   */
  async getEmptyStateMessage(): Promise<string> {
    if (await this.isEmptyState()) {
      return (await this.emptyStateMessage.textContent()) || '';
    }
    return '';
  }

  /**
   * Assert empty state is displayed with expected message
   */
  async assertEmptyStateDisplayed(expectedMessage?: string): Promise<void> {
    await expect(this.page.locator(Selectors.homepage.emptyStateContainer)).toBeVisible();
    if (expectedMessage) {
      await expect(this.page.locator(Selectors.homepage.emptyStateMessage)).toContainText(expectedMessage);
    }
  }

  // ==================== Video Thumbnails ====================

  /**
   * Get the count of video thumbnails on the page
   */
  async getVideoCount(): Promise<number> {
    await this.waitForPageLoad();
    return await this.videoThumbnails?.count() || 0;
  }

  /**
   * Get video thumbnail by index
   */
  getVideoByIndex(index: number): Locator {
    return this.videoThumbnails.nth(index);
  }

  /**
   * Click on a video thumbnail by index
   */
  async clickVideoByIndex(index: number): Promise<void> {
    const video = this.getVideoByIndex(index);
    await video.locator(Selectors.homepage.videoThumbnail).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Click on first available video
   */
  async clickFirstVideo(): Promise<void> {
    await this.clickVideoByIndex(0);
  }

  /**
   * Get video information from a thumbnail
   */
  async getVideoInfo(index: number): Promise<VideoThumbnail> {
    const video = this.getVideoByIndex(index);
    
    const title = await video.locator(Selectors.homepage.videoTitle).textContent() || '';
    const channel = await video.locator(Selectors.homepage.channelName).textContent() || '';
    
    let duration: string | undefined;
    try {
      duration = await video.locator(Selectors.homepage.videoDuration).textContent() || undefined;
    } catch {
      duration = undefined;
    }

    return {
      title: title.trim(),
      channel: channel.trim(),
      duration,
    };
  }

  /**
   * Get all visible video titles
   */
  async getAllVideoTitles(): Promise<string[]> {
    const titles: string[] = [];
    const count = await this.getVideoCount();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const video = this.getVideoByIndex(i);
      const title = await video.locator(Selectors.homepage.videoTitle).textContent();
      if (title) {
        titles.push(title.trim());
      }
    }
    
    return titles;
  }

  /**
   * Check if videos are displayed on homepage
   */
  async hasVideos(): Promise<boolean> {
    const count = await this.getVideoCount();
    return count > 0;
  }

  // ==================== Filter Chips ====================

  /**
   * Get all filter chip labels
   */
  async getFilterChips(): Promise<string[]> {
    const chips = this.page.locator(Selectors.homepage.chipItem);
    const count = await chips.count();
    const labels: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const label = await chips.nth(i).textContent();
      if (label) {
        labels.push(label.trim());
      }
    }
    
    return labels;
  }

  /**
   * Click on a filter chip by text
   */
  async clickFilterChip(chipText: string): Promise<void> {
    const chip = this.page.locator(Selectors.homepage.chipItem).filter({ hasText: chipText });
    await chip.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Check if filter chip bar is visible
   */
  async isChipBarVisible(): Promise<boolean> {
    return await this.chipBar.isVisible();
  }

  // ==================== Scroll & Load More ====================

  /**
   * Scroll down to load more videos
   */
  async scrollToLoadMore(): Promise<void> {
    const initialCount = await this.getVideoCount();
    
    await this.page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 2);
    });
    
    // Wait for new content to load
    await this.page.waitForTimeout(2000);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Scroll to bottom of page
   */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await this.page.waitForLoadState('networkidle');
  }

  // ==================== Shorts Section ====================

  /**
   * Check if Shorts shelf is visible
   */
  async isShortsShelfVisible(): Promise<boolean> {
    const shortsShelf = this.page.locator(Selectors.homepage.shortsShelf);
    return await shortsShelf.isVisible();
  }

  // ==================== Assertions ====================

  /**
   * Assert homepage is loaded correctly (handles empty state)
   */
  async assertHomepageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/youtube\.com/);
    await expect(this.searchInput).toBeVisible();
    // Homepage can be in empty state or have videos
    const isEmptyState = await this.isEmptyState();
    if (isEmptyState) {
      await expect(this.emptyStateContainer).toBeVisible();
    } else {
      await expect(this.videoThumbnails.first()).toBeVisible();
    }
  }

  /**
   * Assert minimum number of videos are displayed
   */
  async assertMinimumVideos(minCount: number): Promise<void> {
    const count = await this.getVideoCount();
    expect(count).toBeGreaterThanOrEqual(minCount);
  }
}
