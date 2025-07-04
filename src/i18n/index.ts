// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend) 
  .use(initReactI18next)
  .init({
    lng: 'zh',             // 預設語言
    fallbackLng: 'en',     // 找不到時使用英文
    interpolation: {
      escapeValue: false   // React 已自動處理 XSS
    },
    backend: {
      loadPath: '/language/{{lng}}/translation.json', // ← 語言檔載入路徑
    },
  });

export default i18n;