// src/components/PlayList.tsx
import { useDispatch } from 'react-redux';
import Hls from 'hls.js';
import { useState,useEffect,useRef } from 'react';
import { beforeAftertracks } from '@/assets/mp3/beforeAfterTracks';
import type { BeforeAfterTrackInfo } from '@/types/BeforeAfterTrackInfo';

const emptyTrack: BeforeAfterTrackInfo = {
  name: '',
  before_path: '',
  after_path: '',
  tags: [],
  time: 0,
};

// import style from '@/css/components/PlayList.module.css';

export default function BeforeAfterPlayer() {

  const [isReady, setIsReady] = useState(false);
  const [trackList] = useState(beforeAftertracks);
  const [currentTrack, setCurrentTrack] = useState<BeforeAfterTrackInfo>(trackList[0]);

  useEffect(() => {
    /* fetch tracks… */
  }, []);

  return (
    <div>
      <h2>曲目清單</h2>
      <ul>
        {trackList.map((track: BeforeAfterTrackInfo, index: number) => (
          <li key={index}>
            <button onClick={() => setCurrentTrack(track)}>
              {track.name}
            </button>
          </li>
        ))}
      </ul>

      {/* 若有選中曲目才顯示播放器 */}
      {currentTrack &&
        <AudioController 
            key={currentTrack.name}
            {...currentTrack}
            onReady={() => setIsReady(true)}
        />}
    </div>
  );
}



function AudioController(trackInfo: BeforeAfterTrackInfo & { onReady?: () => void }) {

  // define
  type Track = 'before' | 'after';
  const audioRef_before = useRef<HTMLAudioElement>(null);
  const audioRef_after = useRef<HTMLAudioElement>(null);

  // state
  const [activeTrack, setActiveTrack] = useState<Track>('before');
  const toggleTrack = () => 
    setActiveTrack(t => (t === 'before' ? 'after' : 'before'));

  // init
  useEffect(() => {
    console.log("播放before路徑", trackInfo.before_path);
    console.log("播放after路徑", trackInfo.after_path);
    const waitForAll = async () => {
        if (audioRef_before.current && trackInfo.before_path) {
            setupAudio(audioRef_before.current, trackInfo.before_path);
            await waitForAudioReady(audioRef_before.current);
        }

        if (audioRef_after.current && trackInfo.after_path) {
            setupAudio(audioRef_after.current, trackInfo.after_path);
            await waitForAudioReady(audioRef_after.current);
        }

        trackInfo.onReady?.();
    }
    
    waitForAll();
  }, [trackInfo.name]);

  // 
  const setupAudio = (
    audio: HTMLAudioElement,
    path: string | undefined
  ) => {
    if (!path) return;

    const url = `${import.meta.env.BASE_URL}${path}`;

    // Reset old src
    audio.pause();
    audio.src = '';
    audio.removeAttribute('src');

    // Native HLS support
    if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = url;
      audio.load();
      audio.play().catch(console.error);

    // Hls.js fallback
    } else if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hls.loadSource(url);
      hls.attachMedia(audio);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio.play().catch(console.error);
      });
      return () => hls.destroy();
    } else {
      console.error('HLS not supported in this browser');
    }
  };

function waitForAudioReady(audio: HTMLAudioElement): Promise<void> {
  return new Promise((resolve) => {
    const handler = () => {
      audio.removeEventListener('canplaythrough', handler);
      resolve();
    };
    audio.addEventListener('canplaythrough', handler);
  });
}

  return (
    <div>
        <button onClick={toggleTrack}>我是切換</button>
        <div>
            {activeTrack === 'before' ? '混音前' : '混音後'}
        </div>
        <div>我是進度條</div>
        <div>我是音量條</div>
        <button>我是播放</button>
    </div>
  );
}