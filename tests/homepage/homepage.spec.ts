import { test, expect, TestTags } from '../../src/fixures/youtube.fixure';

/**
 * Homepage Test Suite
 * Tests for YouTube homepage functionality including video display,
 * navigation, and UI elements
 */
test.describe('YouTube Homepage @homepage', () => {
  
  test.describe('Page Load & Display', () => {
    
    test('should load homepage successfully, with no videos @smoke @regression', async ({ homePage }) => {
      // Assert homepage loaded with expected elements
      await homePage.assertHomepageLoaded();
      
      // Verify logo is visible
      const pageTitle = await homePage.getPageTitle();
      expect(pageTitle).toBe('YouTube');
    });

    test('should have search input visible and functional @smoke @regression', async ({ homePage, page }) => {
        // Verify search input is visible and functional
        const searchInput = await homePage.getSearchInput();
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toBeEnabled();

        await searchInput.focus();
        await expect(searchInput).toBeFocused();

        const testQuery = 'Playwright Testing';
        await searchInput.fill(testQuery);
        const inputValue = await searchInput.inputValue();
        expect(inputValue).toBe(testQuery);
    });

    test('should display empty state when no recommendations available @smoke @regression', async ({ homePage }) => {
      // Verify homepage is in empty state
      const isEmptyState = await homePage.isEmptyState();
      expect(isEmptyState).toBe(true);
    });

    test('should display correct empty state message @regression', async ({ homePage }) => {
      await homePage.assertEmptyStateDisplayed('Try searching to get started');
    });

    test('should not display video thumbnails in empty state @regression', async ({ homePage }) => {
      const videoCount = await homePage.getVideoCount();
      expect(videoCount).toBe(0);
    });

    test('should not display filter chip bar in empty state @regression', async ({ homePage }) => {
      const isChipBarVisible = await homePage.isChipBarVisible();
      expect(isChipBarVisible).toBe(false);
      const hasVideos = await homePage.hasVideos();
      expect(hasVideos).toBe(false);
    });
  });

  test.describe('Search Functionality in Empty State', () => {
    test('should navigate to search results when search is submitted with enter @smoke @regression', async ({ homePage, page }) => {
      const searchInput = await homePage.getSearchInput();

      searchInput.fill('music');
      searchInput.press('Enter');

      await page.waitForURL(/youtube\.com\/results/);
      await expect(page).toHaveURL(/results\?search_query=music/);
    });  

    test('should navigate to search results when search is submitted @smoke @regression', async ({ homePage, page }) => {
      const searchInput = await homePage.getSearchInput();
      const searchButton = await homePage.getSearchButton();

      searchInput.fill('music');
      searchButton.click();

      await page.waitForURL(/youtube\.com\/results/);
      await expect(page).toHaveURL(/results\?search_query=music/);
    });

    test('should display video results after searching @regression', async ({ homePage, page }) => {
      const searchInput = await homePage.getSearchInput();
      
      await searchInput.fill('music');
      await searchInput.press('Enter');
      
      await page.waitForURL(/youtube\.com\/results/);
      await page.waitForLoadState('networkidle');
      
      const videoResults = page.locator('ytd-video-renderer');
      await expect(videoResults.first()).toBeVisible({ timeout: 10000 });
      
      const resultCount = await videoResults.count();
      expect(resultCount).toBeGreaterThan(0);
    });

  });
});