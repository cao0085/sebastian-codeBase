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
  const [openBottom, setOpenBottom] = useState(false);
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
        <button
          className={layoutStyles.bottomHandle}
          onClick={() => setOpen(!open)}
          aria-label="toggle drawer"
        />
        <div className={layoutStyles.titleName}>Sebastian-lin</div>
      </div>
      <aside className={`${layoutStyles.drawerWapperOpen} ${!open ? layoutStyles.drawerWapperClosed : ''}`}>
        <div 
          className={`${open ? layoutStyles.drawerContent : layoutStyles.drawerHide}`}
        > 
          <NavPanel/>
          <div className={layoutStyles.drawerBottom}>
            {/* <SegmentedPlayer2></SegmentedPlayer2> */}
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
      {/* 內容 */}
      <main className={layoutStyles.mainContent}>
        <Outlet />
      </main>
      {/* phone bottom */}
      {/* <div className={layoutStyles.bottomBar}>
        <div>
          <NavPanel/>
        </div>
        <button onClick={() => {() => setOpen(!open2)}}>
          ＾
        </button>
      </div> */}

      {/* ① Bottom-Sheet：展開時才可見 */}
      <div
        className={`${layoutStyles.bottomSheet} ${
          openBottom ? layoutStyles.bottomSheetOpen : layoutStyles.bottomSheetClosed
        }`}
      >
        <NavPanel />

        <div className={layoutStyles.bottomActions}>
          <button title="123" onClick={toggleLanguage} className={layoutStyles.nonStyleButton}>
            <EarthIcon />
          </button>
          <button onClick={toggleTheme} className={layoutStyles.nonStyleButton}>
            {curentTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
      
      {/* ② 永遠貼底的 Toggle 按鈕 */}
      {/* <div className={layoutStyles.bottomToggleRow}>
        <button
          className={layoutStyles.bottomToggleBtn}
          onClick={() => setOpenBottom(!openBottom)}
          aria-label="toggle bottom sheet"
        >
          {openBottom ? '⌄' : '⌃'}
        </button>
      </div> */}
    </div>
  );
}