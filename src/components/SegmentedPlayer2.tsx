// src/components/SegmentedPlayer.tsx
import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { setPlaying } from '@/store/slices/playerSlice';

export default function SegmentedPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const dispatch = useDispatch();
  var src = useSelector((s: RootState) => s.player.currentTrack?.path);
  const isPlaying = useSelector((s: RootState) => s.player.isPlaying);

  /* 載入 HLS */
  useEffect(() => {
    console.log("test"+ src)
    src = `${import.meta.env.BASE_URL}${src}`;
    const audio = audioRef.current;
    if (!audio || !src) return;

    // 先暫停舊 audio
    audio.pause();

    if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = src;
      audio.load();
    } else if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(audio);
      return () => hls.destroy();
    } else {
      console.error('HLS is not supported in this browser');
    }
  }, [src]);

  /* 根據 store 的 isPlaying 控制播放／暫停 */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(console.error);
    else audio.pause();
  }, [isPlaying]);

  /* audio 事件 → 回寫狀態（可擴充為 position 等） */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => dispatch(setPlaying(true));
    const onPause = () => dispatch(setPlaying(false));
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [dispatch]);

  /* 沒選曲目先不要顯示 */
  // if (!src) return null;

  return <audio ref={audioRef} controls style={{ width: '280px' }} />;
}