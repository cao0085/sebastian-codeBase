// src/App.tsx
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRoutes } from 'react-router-dom'
import type { RootState } from '@/store/store'
import { routes } from './routes'



function App() {
  const element = useRoutes(routes)
  const theme = useSelector((state: RootState) => state.views.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="container">
      {element}
    </div>
  )
}

export default App