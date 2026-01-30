import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { VideoPlayerPage } from '../pages/VideoPlayerPage';

/**
 * Custom test fixtures for YouTube tests
 * Provides pre-configured page objects for each test
 */

// Define custom fixtures type
type YouTubeFixtures = {
  homePage: HomePage;
  videoPlayerPage: VideoPlayerPage;
};

/**
 * Extended test with YouTube page object fixtures
 */
export const test = base.extend<YouTubeFixtures>({
  /**
   * HomePage fixture - automatically navigates to homepage
   */
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.waitForPageLoad();
    await use(homePage);
  },

  /**
   * VideoPlayerPage fixture - provides video player page object
   * Note: Does not navigate automatically, use with homePage or navigate manually
   */
  videoPlayerPage: async ({ page }, use) => {
    const videoPlayerPage = new VideoPlayerPage(page);
    await use(videoPlayerPage);
  },
});

export { expect };

/**
 * Test annotations for organizing test suites
 */
export const TestTags = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  HOMEPAGE: '@homepage',
  VIDEO_PLAYER: '@video-player',
  KEYBOARD_SHORTCUTS: '@keyboard-shortcuts',
  PLAYBACK: '@playback',
  NAVIGATION: '@navigation',
} as const;
