import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { Outlet } from 'react-router-dom';
import { setLanguage } from '@/store/slices/languageSlice';
import { setTheme } from '@/store/slices/viewsSlice';
import NavPanel from '@/components/NavPanel';
import layoutStyles from '@/css/components/MainLayout.module.css';

import EarthIcon from '@/assets/svgIcon/Earth'
import MoonIcon from '@/assets/svgIcon/Moon'
import SunIcon from '@/assets/svgIcon/Sun'

export default function MainLayout() {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();

  const currentLang = useSelector((state: RootState) => state.language.currentLanguage);
  const curentTheme = useSelector((state: RootState) => state.views.theme);

  const toggleTheme = () =>
    dispatch(setTheme(curentTheme === 'dark' ? 'light' : 'dark'));
  const toggleLanguage = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    dispatch(setLanguage(newLang));
  };

  return (
    <div className={layoutStyles.layout}>
      <div className={layoutStyles.headerWrapper}>
        <button className={layoutStyles.drawerButton} onClick={() => setOpen(!open)}>
          ≡
        </button>
        <div className={layoutStyles.titleName}>Sebastian-lin</div>
      </div>
      <aside className={`${layoutStyles.drawerWapperOpen} ${!open ? layoutStyles.drawerWapperClosed : ''}`}>
        <div 
          className={`${open ? layoutStyles.drawerContent : layoutStyles.drawerHide}`}
        > 
          <NavPanel/>
          <div className={layoutStyles.drawerBottom}>
            <button onClick={toggleLanguage} className={layoutStyles.nonStyleButton} title="切換語言">
              <EarthIcon/>
            </button>
            <button onClick={toggleTheme} className={layoutStyles.nonStyleButton} title="切換主題">
              {curentTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </aside>

      {/* 站位符號 */}
      <div className={`${layoutStyles.placeHolder} ${!open ? layoutStyles.placeHolderClosed : ''}`}></div>
      <main className={layoutStyles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}