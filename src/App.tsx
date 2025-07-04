// src/App.tsx
import { useSelector } from 'react-redux'
import { useRoutes } from 'react-router-dom'
import type { RootState } from '@/store/store'
import { routes } from './routes'
import appStyle from '@/css/App.module.css';
import { useTranslation } from 'react-i18next';



function App() {
  const element = useRoutes(routes)
  const theme = useSelector((state: RootState) => state.views.theme);
  const { t } = useTranslation();

  return (
    <div className={`app-root theme-${theme}`}>
      {element}
      {t('language')}
    </div>
  )
}

export default App