// src/components/DraggableWindow.tsx
import { useRef, useState, useCallback } from 'react';
import PlayList from '@/components/PlayList';
import SegmentedPlayer from '@/components/SegmentedPlayer';
import styles from '@/css/components/DraggableWindow.module.css';

export default function DraggableWindow() {
  const [expanded, setExpanded] = useState(false);
  const [enableTransition, setEnableTransition] = useState(false);
  const [top, setTop] = useState(700);
  // const bodyRef   = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  let offsetX = 0;
  let offsetY = 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    const el = dragRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    const handleMouseMove = (e: MouseEvent) => {
      const el = dragRef.current;
      if (!el) return;

      const newLeft = e.clientX - offsetX;
      const newTop = e.clientY - offsetY;

      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
      setTop(newTop);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const toggleExpand = useCallback(() => {
    setEnableTransition(true); 
    setExpanded(prev => {
      const next = !prev;
      if (!prev) {
        // 展開中，向上推
        setTop(prevTop => prevTop - 150);
      } else {
        // 收合時，還原原始 top
        setTop(prevTop => prevTop + 150);
      }
      setTimeout(() => {
        setEnableTransition(false);
      }, 700); // 時間要比 CSS transition 長一點
      return next;
    });
  }, []);


  return (
    <div ref={dragRef} className={`${styles.window} ${enableTransition ? styles.transition : ''}`} style={{ left: '1600px', top: `${top}px`, position: 'fixed' }}>
      <div className={styles.header} onMouseDown={handleMouseDown}></div>

      <div
        className={`${styles.body} ${
            expanded ? styles.expanded : styles.collapsed
        }`}
        >
        <PlayList />
      </div>

      <div className={styles.footer}>
        <button className={styles.toggleBtn} onClick={toggleExpand}>
          {expanded ? '˄' : '˅'}
        </button>
      </div>
      <div>
        <SegmentedPlayer />
      </div>
    </div>
  );
}