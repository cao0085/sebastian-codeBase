import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TrackInfo } from '@/types/TrackInfo';

export interface PlayerState {
  currentTrack: TrackInfo | null;
  isPlaying: boolean;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack(state, action: PayloadAction<TrackInfo>) {
      state.currentTrack = action.payload;
      state.isPlaying = false;           // 先停下，等 <audio> onCanPlay 時再自動播放
    },
    setPlaying(state, action: PayloadAction<boolean>) {
      state.isPlaying = action.payload;
    },
  },
});

export const { setCurrentTrack, setPlaying } = playerSlice.actions;
export default playerSlice.reducer;