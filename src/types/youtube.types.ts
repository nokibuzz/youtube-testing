export type PlaybackSpeed = 0.25 | 0.5 | 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export type VideoQuality = '144p' | '240p' | '360p' | '480p' | '720p' | '1080p' | '1440p' | '2160p' | 'auto';

export interface VideoThumbnail {
  title: string;
  channel: string;
  views?: string;
  duration?: string;
  thumbnailUrl?: string;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackRate: number;
}

export interface VideoInfo {
  title: string;
  channelName: string;
  viewCount: string;
  likesCount?: string;
  publishDate?: string;
  description?: string;
}

export interface SearchFilters {
  uploadDate?: 'hour' | 'today' | 'week' | 'month' | 'year';
  type?: 'video' | 'channel' | 'playlist' | 'movie';
  duration?: 'short' | 'medium' | 'long';
  sortBy?: 'relevance' | 'uploadDate' | 'viewCount' | 'rating';
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => Promise<void>;
}
