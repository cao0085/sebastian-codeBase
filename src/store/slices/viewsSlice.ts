import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'dark' | 'light' ;

export interface ViewsState {
  theme: Theme;
}

const initialState: ViewsState = {
  theme: 'dark',
};

const viewsSlice = createSlice({
    name: 'views',
    initialState,
    reducers: {
      setTheme(state, action: PayloadAction<Theme>) {
        state.theme = action.payload;
      },
    },
  });

export const { setTheme } = viewsSlice.actions;
export default viewsSlice.reducer;