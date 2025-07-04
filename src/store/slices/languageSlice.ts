// src/store/slices/languageSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import i18n from '@/i18n';

export type Language = 'en' | 'zh';

interface LanguageState {
  currentLanguage: Language;
}

const initialState: LanguageState = {
  currentLanguage: 'zh',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<Language>) {
      const lang = action.payload;
      state.currentLanguage = lang;
      i18n.changeLanguage(lang);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export type { LanguageState };
export default languageSlice.reducer;