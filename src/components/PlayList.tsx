// src/components/PlayList.tsx
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { tracks } from '@/assets/mp3/tracks';
import { setCurrentTrack,setPlaying } from '@/store/slices/playerSlice';
import type { TrackInfo } from '@/types/TrackInfo';

import style from '@/css/components/PlayList.module.css';

export default function PlayList() {
  const dispatch = useDispatch();
  const handleSelect = (track: TrackInfo) => {
    dispatch(setCurrentTrack(track));
    dispatch(setPlaying(true));
  };

  useEffect(() => {
    /* fetch tracks… */
  }, []);

  return (
    <div className={style.container}>
      {tracks.map((t) => (
        <Track key={t.path} track={t} onSelect={() => handleSelect(t)} />
      ))}
    </div>
  );
}

/* --- Track 子元件 --- */
function Track({ track, onSelect }: { track: TrackInfo; onSelect: () => void }) {
  return (
    <div className={style.track} onClick={onSelect}>
      <div className={style.title}>{track.name}</div>
      <div className={style.artist}>{track.artist}</div>
      <div className={style.tagList}>
        {track.tags.map((tag) => (
          <span key={tag} className={style.tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}