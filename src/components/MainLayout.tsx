import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import layoutStyles from '@/css/components/MainLayout.module.css';

export default function MainLayout() {
  const [open, setOpen] = useState(true);

  return (
    <div className={layoutStyles.layout}>
      <button className={layoutStyles.toggle} onClick={() => setOpen(!open)}>
        ≡ 
      </button>

      <aside className={`${layoutStyles.drawer} ${!open ? layoutStyles.closed : ''}`}>
        <div 
          className={`${open ? layoutStyles.slideShow : layoutStyles.slideHide}`}
        > 
        {/* 放導覽列 */}
        {/* <SlidePanel/> */}
            
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