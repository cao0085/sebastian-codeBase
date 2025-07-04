import type { RouteObject } from 'react-router-dom'
import { Navigate }         from 'react-router-dom'
import MainLayout from '@/components/MainLayout'
import Home       from '@/views'            // ← 首頁
import Category1  from '@/views/category_1'
import Category2  from '@/views/category_2'

export const routes: RouteObject[] = [

  { 
    path: '/',
    element: <MainLayout />,
    children: [
      // `/` 直接顯示首頁
      { index: true, element: <Home /> },

      // 其他子頁
      { path: 'category_1', element: <Category1 /> },
      { path: 'category_2', element: <Category2 /> },

      // 未匹配 → 回首頁（或改成 NotFound）
      { path: '*', element: <Navigate to="" replace /> },
    ],
  }
  
]