/**
 * Sample video IDs for testing
 * Note: These are popular/stable videos that are unlikely to be removed
 */
export const TestVideos = {
  // Short video for quick tests
  SHORT_VIDEO: 'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
  
  // Longer video for duration tests
  LONG_VIDEO: 'jNQXAC9IVRw', // Me at the zoo (first YouTube video)
  
  // Music video
  MUSIC_VIDEO: '9bZkp7q19f0', // PSY - Gangnam Style
  
  // Educational content
  EDUCATIONAL: 'aircAruvnKk', // 3Blue1Brown
} as const;

/**
 * Search queries for testing
 */
export const SearchQueries = {
  MUSIC: 'music videos',
  TUTORIALS: 'programming tutorials',
  NEWS: 'latest news',
  GAMING: 'gaming videos',
  SPORTS: 'sports highlights',
} as const;

/**
 * Filter chip categories commonly found on YouTube
 */
export const FilterChips = {
  ALL: 'All',
  MUSIC: 'Music',
  GAMING: 'Gaming',
  NEWS: 'News',
  LIVE: 'Live',
  SPORTS: 'Sports',
} as const;

/**
 * Keyboard shortcuts for video player
 */
export const KeyboardShortcuts = {
  PLAY_PAUSE: ['k', 'Space'],
  MUTE: 'm',
  FULLSCREEN: 'f',
  SKIP_FORWARD_5: 'ArrowRight',
  SKIP_BACKWARD_5: 'ArrowLeft',
  SKIP_FORWARD_10: 'l',
  SKIP_BACKWARD_10: 'j',
  VOLUME_UP: 'ArrowUp',
  VOLUME_DOWN: 'ArrowDown',
  JUMP_TO_START: 'Home',
  JUMP_TO_END: 'End',
  INCREASE_SPEED: 'Shift+>',
  DECREASE_SPEED: 'Shift+<',
  CAPTIONS: 'c',
  THEATER_MODE: 't',
  MINIPLAYER: 'i',
} as const;

/**
 * Expected UI elements on homepage
 */
export const HomepageElements = {
  MIN_VIDEOS_DISPLAYED: 5,
  EXPECTED_CHIP_CATEGORIES: ['All', 'Music', 'Gaming', 'News'],
} as const;

/**
 * Timeout values for different operations (in milliseconds)
 */
export const Timeouts = {
  PAGE_LOAD: 15000,
  VIDEO_LOAD: 20000,
  NETWORK_IDLE: 10000,
  ANIMATION: 500,
  SHORT_WAIT: 1000,
  MEDIUM_WAIT: 3000,
  LONG_WAIT: 5000,
} as const;

/**
 * URLs for testing
 */
export const TestUrls = {
  HOME: '/',
  TRENDING: '/feed/trending',
  SUBSCRIPTIONS: '/feed/subscriptions',
  LIBRARY: '/feed/library',
  HISTORY: '/feed/history',
  WATCH_LATER: '/playlist?list=WL',
} as const;
