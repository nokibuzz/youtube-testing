import { test, expect } from '../../src/fixures/youtube.fixure'
import { VideoPlayerPage } from '../../src/pages/VideoPlayerPage';
import { Timeouts } from '../../src/data/test-data';
import { Selectors } from '@data/selectors';

/**
 * Video Navigation Test Suite
 * Tests for navigating to videos via search (since homepage starts empty)
 * and clicking videos to open the video player
 */
test.describe('Video Navigation @navigation', () => {
  
  /**
   * Helper to perform search and wait for results
   */
  async function searchForVideos(page: any, query: string = 'music video') {
    const searchInput = page.locator(Selectors.common.searchInput);
    await searchInput.fill(query);
    await searchInput.press('Enter');
    await page.waitForURL(/youtube\.com\/results/);
    await page.waitForLoadState('networkidle');
    
    // Wait for video results to load
    const videoResults = page.locator('ytd-video-renderer');
    await videoResults.first().waitFor({ state: 'visible', timeout: 15000 });
    
    return videoResults;
  }

  test.describe('Search Results to Video Player', () => {

    test('should open video player when clicking on search result @smoke @regression', async ({ 
      homePage, 
      page 
    }) => {
      // Search for videos (since homepage is empty)
      const videoResults = await searchForVideos(page, 'metal music');
      
      // Verify search results are present
      const resultCount = await videoResults.count();
      expect(resultCount).toBeGreaterThan(0);
      
      // Get first video title before clicking
      const firstVideoTitle = page.locator(Selectors.searchResults.videoTitle).first();
      const titleText = await firstVideoTitle.textContent();
      
      // Click on first video result
      await firstVideoTitle.click();
      
      // Wait for navigation to video page
      await page.waitForURL(/\/watch\?v=/);
      await page.waitForLoadState('domcontentloaded');
      
      // Create video player page object
      const videoPlayerPage = new VideoPlayerPage(page);
      await videoPlayerPage.waitForPageLoad();
      
      // Verify video player is visible
      await videoPlayerPage.assertPlayerVisible();
    });

    test('should display video with matching title from search result @regression', async ({ 
      homePage, 
      page 
    }) => {
      // Search for videos
      await searchForVideos(page, 'snake documentary');
      
      // Get first video title from search results
      const firstVideoTitle = page.locator(Selectors.searchResults.videoTitle).first();
      const searchResultTitle = (await firstVideoTitle.textContent())?.trim() || '';
      
      // Click on video
      await firstVideoTitle.click();
      await page.waitForURL(/\/watch\?v=/);
      await page.waitForLoadState('domcontentloaded');
      
      // Create video player page object
      const videoPlayerPage = new VideoPlayerPage(page);
      await videoPlayerPage.waitForPageLoad();
      
      // Get video title on player page
      console.log('search result title', searchResultTitle);
      const playerTitle = await videoPlayerPage.getVideoTitle();

      console.log('video title', playerTitle);
      console.log('search result title', searchResultTitle);
      
      // Note: Titles may differ slightly, so we do partial match
      expect(
        playerTitle.toLowerCase().includes(searchResultTitle.slice(0, 15).toLowerCase()) || 
        searchResultTitle.toLowerCase().includes(playerTitle.slice(0, 15).toLowerCase())
      ).toBeTruthy();
    });

    test('should have video player controls visible after navigation @smoke @regression', async ({ 
      homePage, 
      page 
    }) => {
      // Search for videos
      await searchForVideos(page);
      
      // Click on first video
      const firstVideoTitle = page.locator(Selectors.searchResults.videoTitle).first();
      await firstVideoTitle.click();
      await page.waitForURL(/\/watch\?v=/);
      await page.waitForLoadState('domcontentloaded');
      
      // Create video player page object
      const videoPlayerPage = new VideoPlayerPage(page);
      await videoPlayerPage.waitForPageLoad();
      
      // Hover to show controls
      await videoPlayerPage.hoverOverPlayer();
      
      // Verify play button is visible
      await expect(videoPlayerPage.playPauseButton).toBeVisible();
    });

    test('should load video with valid duration after clicking search result @regression', async ({ 
      homePage, 
      page 
    }) => {
      // Search for videos
      await searchForVideos(page, 'tutorial');
      
      // Click on first video
      const firstVideoTitle = page.locator(Selectors.searchResults.videoTitle).first();
      await firstVideoTitle.click();
      await page.waitForURL(/\/watch\?v=/);
      await page.waitForLoadState('domcontentloaded');
      
      // Create video player page object
      const videoPlayerPage = new VideoPlayerPage(page);
      await videoPlayerPage.waitForPageLoad();
      await videoPlayerPage.waitForVideoToLoad();
      
      // Wait a moment for video metadata to load
      await page.waitForTimeout(Timeouts.MEDIUM_WAIT);
      
      // Check video has duration
      const playerState = await videoPlayerPage.getPlayerState();
      expect(playerState.duration).toBeGreaterThan(0);
    });

  });

  test.describe('Click Multiple Videos', () => {

    test('should be able to click different search result videos @regression', async ({ 
      homePage, 
      page 
    }) => {
      // Search for videos
      await searchForVideos(page, 'cooking recipe');
      
      // Click on second video (index 1)
      const secondVideoTitle = page.locator(Selectors.searchResults.videoTitle).nth(1);
      await expect(secondVideoTitle).toBeVisible();
      await secondVideoTitle.click();
      
      // Verify navigation
      await page.waitForURL(/\/watch\?v=/);
      
      // Create video player page object
      const videoPlayerPage = new VideoPlayerPage(page);
      await videoPlayerPage.waitForPageLoad();
      await videoPlayerPage.assertPlayerVisible();
    });

    test('should navigate to third video from search results @regression', async ({ 
      homePage, 
      page 
    }) => {
      // Search for videos
      await searchForVideos(page, 'workout fitness');
      
      // Click on third video (index 2)
      const thirdVideoTitle = page.locator(Selectors.searchResults.videoTitle).nth(2);
      await expect(thirdVideoTitle).toBeVisible();
      await thirdVideoTitle.click();
      
      // Verify navigation
      await page.waitForURL(/\/watch\?v=/);
      
      // Create video player page object
      const videoPlayerPage = new VideoPlayerPage(page);
      await videoPlayerPage.waitForPageLoad();
      await videoPlayerPage.assertPlayerVisible();
    });

  });

  test.describe('Navigation Between Pages', () => {

    test('should return to homepage when clicking logo from video page @regression', async ({ 
      homePage, 
      page 
    }) => {
      // Search and navigate to a video
      await searchForVideos(page);
      const firstVideoTitle = page.locator(Selectors.searchResults.videoTitle).first();
      await firstVideoTitle.click();
      await page.waitForURL(/\/watch\?v=/);
      
      // Create video player page object
      const videoPlayerPage = new VideoPlayerPage(page);
      await videoPlayerPage.waitForPageLoad();
      
      // Click logo to go back
      await videoPlayerPage.clickLogo();
      await page.waitForLoadState('domcontentloaded');
      
      // Verify back on homepage
      await expect(page).toHaveURL(/youtube\.com\/?$/);
      
      // Homepage should show empty state again
      const isEmptyState = await homePage.isEmptyState();
      expect(isEmptyState).toBe(true);
    });

    test('should be able to perform new search from video page @regression', async ({ 
      homePage, 
      page 
    }) => {
      // Navigate to a video first
      await searchForVideos(page, 'jazz music');
      const firstVideoTitle = page.locator(Selectors.searchResults.videoTitle).first();
      await firstVideoTitle.click();
      await page.waitForURL(/\/watch\?v=/);
      
      // Perform new search from video page
      const searchInput = page.locator(Selectors.common.searchInput);
      await searchInput.fill('rock music');
      await searchInput.press('Enter');
      
      // Verify navigation to new search results
      await page.waitForURL(/youtube\.com\/results/);
      await expect(page).toHaveURL(/search_query=rock/);
    });

    test('should use browser back button to return to search results @regression', async ({ 
      homePage, 
      page 
    }) => {
      // Search and navigate to a video
      await searchForVideos(page, 'guitar lesson');
      const firstVideoTitle = page.locator(Selectors.searchResults.videoTitle).first();
      await firstVideoTitle.click();
      await page.waitForURL(/\/watch\?v=/);
      
      // Use browser back
      await page.goBack();
      await page.waitForLoadState('domcontentloaded');
      
      // Verify back on search results
      await expect(page).toHaveURL(/youtube\.com\/results/);
      
      // Verify video results are still there
      const videoResults = page.locator('ytd-video-renderer');
      await expect(videoResults.first()).toBeVisible();
    });

  });

});
