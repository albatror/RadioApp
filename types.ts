export interface Song {
  id: number | string;
  title: string;
  artist: string;
  albumArtUrl: string;
}

// Azuracast API Types
export interface AzuracastSong {
  id: string;
  text: string;
  artist: string;
  title: string;
  album: string;
  genre: string;
  lyrics: string;
  art: string;
  custom_fields: any[];
}

export interface SongHistoryItem {
  sh_id: number;
  played_at: number;
  duration: number;
  playlist: string;
  streamer: string;
  is_request: boolean;
  song: AzuracastSong;
}

export interface NowPlayingInfo {
  sh_id: number;
  played_at: number;
  duration: number;
  playlist: string;
  streamer: string;
  is_request: boolean;
  song: AzuracastSong;
  elapsed: number;
  remaining: number;
}

export interface AzuracastNowPlayingResponse {
  station: any;
  listeners: {
    total: number;
    unique: number;
    current: number;
  };
  live: any;
  now_playing: NowPlayingInfo;
  playing_next: SongHistoryItem;
  song_history: SongHistoryItem[];
  is_online: boolean;
  cache: string;
}
