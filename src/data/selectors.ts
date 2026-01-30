export const Selectors = {
  // Common elements across pages
  common: {
    logo: 'a#logo',
    searchInput: 'input.ytSearchboxComponentInput',
    searchButton: 'button.ytSearchboxComponentSearchButton',
    voiceSearchButton: '[aria-label="Search with your voice"]',
    signInButton: 'a[aria-label="Sign in"]',
    menuButton: '#guide-button',
    notificationBell: '#notification-button',
  },

  // Homepage specific selectors
  homepage: {
    firstTimePopup: 'yt-formatted-string',
    videoRenderer: 'ytd-rich-item-renderer',
    videoThumbnail: '#thumbnail',
    videoTitle: '#video-title',
    channelName: '#channel-name',
    viewCount: '#metadata-line span:first-child',
    publishTime: '#metadata-line span:last-child',
    videoDuration: 'ytd-thumbnail-overlay-time-status-renderer',
    chipBar: '#chips',
    chipItem: 'yt-chip-cloud-chip-renderer',
    shortsShelf: 'ytd-rich-shelf-renderer[is-shorts]',
    contentSection: '#contents',
    emptyStateContainer: 'ytd-feed-nudge-renderer',
    emptyStateMessage: 'ytd-feed-nudge-renderer #title-container',
    emptyStateTitle: 'ytd-background-promo-renderer #promo-title',
    emptyStateIcon: 'ytd-background-promo-renderer #promo-icon',
  },

  // Video player page selectors
  videoPlayer: {
    // Main player container
    playerContainer: '#movie_player',
    videoElement: 'video.html5-main-video',
    
    // Player controls
    playPauseButton: '.ytp-play-button',
    muteButton: '.ytp-mute-button',
    volumeSlider: '.ytp-volume-slider',
    progressBar: '.ytp-progress-bar',
    currentTime: '.ytp-time-current',
    duration: '.ytp-time-duration',
    fullscreenButton: '.ytp-fullscreen-button',
    settingsButton: '.ytp-settings-button',
    miniplayerButton: '.ytp-miniplayer-button',
    theaterModeButton: '.ytp-size-button',
    subtitlesButton: '.ytp-subtitles-button',
    
    // Player state indicators
    playingState: '.ytp-play-button[data-title-no-tooltip="Pause"]',
    pausedState: '.ytp-play-button[data-title-no-tooltip="Play"]',
    bufferingSpinner: '.ytp-spinner',
    
    // Settings menu
    settingsMenu: '.ytp-settings-menu',
    qualityMenuItem: '.ytp-menuitem:has-text("Quality")',
    speedMenuItem: '.ytp-menuitem:has-text("Playback speed")',
    
    // Video info (on video player page)
    videoTitle: 'ytd-watch-metadata h1.ytd-watch-metadata yt-formatted-string',
    channelName: '#channel-name a',
    subscribeButton: '#subscribe-button',
    likeButton: '#segmented-like-button button',
    dislikeButton: '#segmented-dislike-button button',
    shareButton: 'button[aria-label="Share"]',
    viewCount: '#info-container .view-count',
    
    // Below player
    description: '#description',
    expandDescriptionButton: '#expand',
    commentsSection: '#comments',
  },

  // Search results page
  searchResults: {
    resultsContainer: 'ytd-search',
    videoResult: 'ytd-video-renderer',
    videoTitle: 'ytd-video-renderer #video-title',
    channelResult: 'ytd-channel-renderer',
    playlistResult: 'ytd-playlist-renderer',
    filterButton: '#filter-button',
    filterMenu: 'ytd-search-filter-options-dialog-renderer',
  },

  // Sidebar/Guide menu
  sidebar: {
    guideContent: '#guide-content',
    homeButton: 'a[title="Home"]',
    shortsButton: 'a[title="Shorts"]',
    subscriptionsButton: 'a[title="Subscriptions"]',
    libraryButton: 'a[title="Library"]',
    historyButton: 'a[title="History"]',
  },

  // Consent/Cookie dialog
  consent: {
    dialog: 'ytd-consent-bump-v2-lightbox',
    acceptButton: 'button[aria-label*="Accept"]',
    rejectButton: 'button[aria-label*="Reject"]',
    customizeButton: 'button[aria-label*="Customize"]',
  },
} as const;
