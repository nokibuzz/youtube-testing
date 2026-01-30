import type { Page } from '@playwright/test';

export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateRandomVideoId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Parse YouTube time string to seconds
 */
export function parseTimeToSeconds(timeString: string): number {
  const parts = timeString.split(':').map(Number);
  
  if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return 0;
}

/**
 * Format seconds to YouTube time string
 */
export function formatSecondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Extract video ID from YouTube URL
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Check if URL is a valid YouTube video URL
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}

/**
 * Wait for video player state change
 */
export async function waitForPlayerState(
  page: Page,
  expectedState: 'playing' | 'paused',
  timeout: number = 10000
): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const isPlaying = await page.evaluate(() => {
      const video = document.querySelector('video.html5-main-video') as HTMLVideoElement;
      return video ? !video.paused : false;
    });
    
    if ((expectedState === 'playing' && isPlaying) || 
        (expectedState === 'paused' && !isPlaying)) {
      return true;
    }
    
    await wait(100);
  }
  
  return false;
}

export async function retryWithBackoff<T>(
  action: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      const delay = initialDelay * Math.pow(2, attempt);
      await wait(delay);
    }
  }
  
  throw lastError;
}

/**
 * Scroll until element is found or max scrolls reached
 */
export async function scrollUntilFound(
  page: Page,
  selector: string,
  maxScrolls: number = 10
): Promise<boolean> {
  for (let i = 0; i < maxScrolls; i++) {
    const element = page.locator(selector);
    if (await element.isVisible()) {
      return true;
    }
    
    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight);
    });
    
    await wait(1000);
  }
  
  return false;
}

export async function getConsoleLogs(page: Page): Promise<string[]> {
  const logs: string[] = [];
  
  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
  });
  
  return logs;
}
