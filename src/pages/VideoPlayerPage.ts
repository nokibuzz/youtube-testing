import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Selectors } from '../data/selectors';
import type { VideoPlayerState, VideoInfo, PlaybackSpeed } from '../types/youtube.types';

/**
 * Page Object for YouTube Video Player Page
 * Contains methods to interact with video player and controls
 */
export class VideoPlayerPage extends BasePage {
  // Player elements
  readonly playerContainer: Locator;
  readonly videoElement: Locator;
  readonly playPauseButton: Locator;
  readonly muteButton: Locator;
  readonly volumeSlider: Locator;
  readonly progressBar: Locator;
  readonly currentTimeDisplay: Locator;
  readonly durationDisplay: Locator;
  readonly fullscreenButton: Locator;
  readonly settingsButton: Locator;
  readonly theaterModeButton: Locator;

  // Video info elements
  readonly videoTitle: Locator;
  readonly channelName: Locator;
  readonly subscribeButton: Locator;
  readonly likeButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Player elements
    this.playerContainer = page.locator(Selectors.videoPlayer.playerContainer);
    this.videoElement = page.locator(Selectors.videoPlayer.videoElement);
    this.playPauseButton = page.locator(Selectors.videoPlayer.playPauseButton);
    this.muteButton = page.locator(Selectors.videoPlayer.muteButton);
    this.volumeSlider = page.locator(Selectors.videoPlayer.volumeSlider);
    this.progressBar = page.locator(Selectors.videoPlayer.progressBar);
    this.currentTimeDisplay = page.locator(Selectors.videoPlayer.currentTime);
    this.durationDisplay = page.locator(Selectors.videoPlayer.duration);
    this.fullscreenButton = page.locator(Selectors.videoPlayer.fullscreenButton);
    this.settingsButton = page.locator(Selectors.videoPlayer.settingsButton);
    this.theaterModeButton = page.locator(Selectors.videoPlayer.theaterModeButton);

    // Video info elements
    this.videoTitle = page.locator(Selectors.videoPlayer.videoTitle).first();
    this.channelName = page.locator(Selectors.videoPlayer.channelName).first();
    this.subscribeButton = page.locator(Selectors.videoPlayer.subscribeButton).first();
    this.likeButton = page.locator(Selectors.videoPlayer.likeButton).first();
  }

  // ==================== Navigation ====================

  /**
   * Navigate to a specific video by ID
   */
  async goto(videoId?: string): Promise<void> {
    if (videoId) {
      await this.page.goto(`/watch?v=${videoId}`);
    }
    await this.handleConsentDialog();
  }

  /**
   * Wait for video player to be ready
   */
  async waitForPageLoad(): Promise<void> {
    await this.playerContainer.waitFor({ state: 'visible', timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for video to start playing
   */
  async waitForVideoToLoad(): Promise<void> {
    await this.videoElement?.first().waitFor({ state: 'attached', timeout: 15000 });
    // Wait for video to have some duration
    await this.page.waitForFunction(() => {
      const video = document.querySelector('video.html5-main-video') as HTMLVideoElement;
      return video && video.readyState >= 2;
    }, { timeout: 15000 });
  }

  // ==================== Playback Controls ====================

  /**
   * Click the play/pause button
   */
  async clickPlayPause(): Promise<void> {
    await this.hoverOverPlayer();
    await this.playPauseButton.click();
  }

  /**
   * Play the video (if paused)
   */
  async play(): Promise<void> {
    const isPaused = await this.isPaused();
    if (isPaused) {
      await this.clickPlayPause();
    }
  }

  /**
   * Pause the video (if playing)
   */
  async pause(): Promise<void> {
    const isPlaying = await this.isPlaying();
    if (isPlaying) {
      await this.clickPlayPause();
    }
  }

  /**
   * Toggle play/pause using keyboard shortcut 'K'
   */
  async togglePlayPauseWithK(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('k');
  }

  /**
   * Toggle play/pause using spacebar
   */
  async togglePlayPauseWithSpace(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('Space');
  }

  /**
   * Check if video is currently playing
   */
  async isPlaying(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const video = document.querySelector('video.html5-main-video') as HTMLVideoElement;
      return video ? !video.paused : false;
    });
  }

  /**
   * Check if video is currently paused
   */
  async isPaused(): Promise<boolean> {
    return !(await this.isPlaying());
  }

  // ==================== Keyboard Shortcuts ====================

  /**
   * Focus on the player for keyboard controls
   */
  async focusPlayer(): Promise<void> {
    await this.playerContainer.click();
  }

  /**
   * Hover over player to show controls
   */
  async hoverOverPlayer(): Promise<void> {
    await this.playerContainer.hover();
  }

  /**
   * Skip forward 5 seconds using right arrow
   */
  async skipForward5Seconds(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('ArrowRight');
  }

  /**
   * Skip backward 5 seconds using left arrow
   */
  async skipBackward5Seconds(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('ArrowLeft');
  }

  /**
   * Skip forward 10 seconds using 'L' key
   */
  async skipForward10Seconds(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('l');
  }

  /**
   * Skip backward 10 seconds using 'J' key
   */
  async skipBackward10Seconds(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('j');
  }

  /**
   * Toggle mute using 'M' key
   */
  async toggleMuteWithM(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('m');
  }

  /**
   * Toggle fullscreen using 'F' key
   */
  async toggleFullscreenWithF(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('f');
  }

  /**
   * Exit fullscreen using Escape
   */
  async exitFullscreen(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  /**
   * Increase volume using up arrow
   */
  async increaseVolume(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('ArrowUp');
  }

  /**
   * Decrease volume using down arrow
   */
  async decreaseVolume(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('ArrowDown');
  }

  /**
   * Jump to start of video using Home key
   */
  async jumpToStart(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('Home');
  }

  /**
   * Jump to end of video using End key
   */
  async jumpToEnd(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('End');
  }

  /**
   * Jump to percentage of video (0-9 keys)
   */
  async jumpToPercentage(percentage: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press(percentage.toString());
  }

  /**
   * Increase playback speed using '>'
   */
  async increasePlaybackSpeed(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('Shift+>');
  }

  /**
   * Decrease playback speed using '<'
   */
  async decreasePlaybackSpeed(): Promise<void> {
    await this.focusPlayer();
    await this.page.keyboard.press('Shift+<');
  }

  // ==================== Volume Controls ====================

  /**
   * Click mute/unmute button
   */
  async clickMuteButton(): Promise<void> {
    await this.hoverOverPlayer();
    await this.muteButton.click();
  }

  /**
   * Check if video is muted
   */
  async isMuted(): Promise<boolean> {
    return await this.page.evaluate(() => {
      const video = document.querySelector('video.html5-main-video') as HTMLVideoElement;
      return video ? video.muted : false;
    });
  }

  /**
   * Get current volume (0-1)
   */
  async getVolume(): Promise<number> {
    return await this.page.evaluate(() => {
      const video = document.querySelector('video.html5-main-video') as HTMLVideoElement;
      return video ? video.volume : 0;
    });
  }

  // ==================== Time & Progress ====================

  /**
   * Get current playback time in seconds
   */
  async getCurrentTime(): Promise<number> {
    return await this.page.evaluate(() => {
      const video = document.querySelector('video.html5-main-video') as HTMLVideoElement;
      return video ? video.currentTime : 0;
    });
  }

  /**
   * Get video duration in seconds
   */
  async getDuration(): Promise<number> {
    return await this.page.evaluate(() => {
      const video = document.querySelector('video.html5-main-video') as HTMLVideoElement;
      return video ? video.duration : 0;
    });
  }

  /**
   * Get current time as displayed string
   */
  async getCurrentTimeDisplay(): Promise<string> {
    return await this.currentTimeDisplay.textContent() || '0:00';
  }

  /**
   * Get duration as displayed string
   */
  async getDurationDisplay(): Promise<string> {
    return await this.durationDisplay.textContent() || '0:00';
  }

  /**
   * Get playback progress percentage
   */
  async getProgressPercentage(): Promise<number> {
    const currentTime = await this.getCurrentTime();
    const duration = await this.getDuration();
    return duration > 0 ? (currentTime / duration) * 100 : 0;
  }

  // ==================== Video Information ====================

  /**
   * Get video title
   */
  async getVideoTitle(): Promise<string> {
    await this.videoTitle.waitFor({ state: 'visible', timeout: 12000 });
    return (await this.videoTitle.textContent()) || '';
  }

  /**
   * Get channel name
   */
  async getChannelName(): Promise<string> {
    return (await this.channelName.textContent()) || '';
  }

  /**
   * Get full video information
   */
  async getVideoInfo(): Promise<VideoInfo> {
    return {
      title: await this.getVideoTitle(),
      channelName: await this.getChannelName(),
      viewCount: '', // Would need specific selector
    };
  }

  // ==================== Fullscreen ====================

  /**
   * Click fullscreen button
   */
  async clickFullscreen(): Promise<void> {
    await this.hoverOverPlayer();
    await this.fullscreenButton.click();
  }

  /**
   * Check if in fullscreen mode
   */
  async isFullscreen(): Promise<boolean> {
    return await this.page.evaluate(() => {
      return document.fullscreenElement !== null;
    });
  }

  // ==================== Player State ====================

  /**
   * Get complete player state
   */
  async getPlayerState(): Promise<VideoPlayerState> {
    return await this.page.evaluate(() => {
      const video = document.querySelector('video.html5-main-video') as HTMLVideoElement;
      return {
        isPlaying: video ? !video.paused : false,
        isPaused: video ? video.paused : true,
        currentTime: video ? video.currentTime : 0,
        duration: video ? video.duration : 0,
        volume: video ? video.volume : 0,
        isMuted: video ? video.muted : false,
        isFullscreen: document.fullscreenElement !== null,
        playbackRate: video ? video.playbackRate : 1,
      };
    });
  }

  /**
   * Get current playback rate
   */
  async getPlaybackRate(): Promise<number> {
    return await this.page.evaluate(() => {
      const video = document.querySelector('video.html5-main-video') as HTMLVideoElement;
      return video ? video.playbackRate : 1;
    });
  }

  // ==================== Assertions ====================

  /**
   * Assert video player is visible
   */
  async assertPlayerVisible(): Promise<void> {
    await expect(this.playerContainer).toBeVisible();
  }

  /**
   * Assert video is playing
   */
  async assertIsPlaying(): Promise<void> {
    const isPlaying = await this.isPlaying();
    expect(isPlaying).toBe(true);
  }

  /**
   * Assert video is paused
   */
  async assertIsPaused(): Promise<void> {
    const isPaused = await this.isPaused();
    expect(isPaused).toBe(true);
  }

  /**
   * Assert video title matches
   */
  async assertVideoTitle(expectedTitle: string): Promise<void> {
    await expect(this.videoTitle).toContainText(expectedTitle);
  }

  /**
   * Assert video URL contains video ID
   */
  async assertVideoId(videoId: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`v=${videoId}`));
  }
}
