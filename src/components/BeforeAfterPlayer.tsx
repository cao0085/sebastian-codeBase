// src/components/PlayList.tsx
import Hls from 'hls.js';
import { useState,useEffect,useRef } from 'react';
import { beforeAftertracks } from '@/assets/mp3/beforeAfterTracks';
import type { BeforeAfterTrackInfo } from '@/types/BeforeAfterTrackInfo';

// import style from '@/css/components/PlayList.module.css';

export default function BeforeAfterPlayer() {

  const [isReady, setIsReady] = useState(false);
  const [trackList] = useState(beforeAftertracks);
  const [currentTrack, setCurrentTrack] = useState<BeforeAfterTrackInfo>(trackList[0]);

  useEffect(() => {
    /* fetch tracks… */
  }, []);

  return (
    <div className='before-after'>
      <h2>Take a Listen</h2>
      <ul>
        {trackList.map((track: BeforeAfterTrackInfo, index: number) => (
          <li key={index}>
            <button onClick={() => {
              setIsReady(false); // 切換曲目時先重置 loading
              setCurrentTrack(track);
            }}>
              {track.name}
            </button>
          </li>
        ))}
      </ul>
      
      <div style={{ position: 'relative' }}>
        {!isReady && (
          <div
          >
            <span>test...</span>
          </div>
        )}
      </div>
      <AudioController
          key={currentTrack.name}
          {...currentTrack}
          onReady={() => setIsReady(true)}
      />

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

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.6);

  // init
  useEffect(() => {

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef_before.current && isPlaying) {
        setCurrentTime(audioRef_before.current.currentTime);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);


  useEffect(() => {
  const before = audioRef_before.current;
  const after = audioRef_after.current;
  if (!before || !after) return;

  if (activeTrack === 'before') {
    fadeVolume(before, before.volume, volume);
    fadeVolume(after, after.volume, 0);
    } else {
      fadeVolume(before, before.volume, 0);
      fadeVolume(after, after.volume, volume);
    }
  }, [activeTrack, volume]);

  function fadeVolume(
    audio: HTMLAudioElement,
    from: number,
    to: number,
    duration: number = 500
  ) {
    const stepTime = 16; // 每一幀大約 16ms
    const steps = duration / stepTime;
    let step = 0;

    const volumeDiff = to - from;

    const fade = () => {
      step++;
      const newVolume = from + (volumeDiff * step) / steps;
      audio.volume = Math.max(0, Math.min(1, newVolume));
      if (step < steps) {
        requestAnimationFrame(fade);
      }
    };

    requestAnimationFrame(fade);
  }

  return (
    <div>
      <button onClick={toggleTrack}>切換：{activeTrack}</button>
      <div>
        

        {/* 播放控制 */}
        <button onClick={() => {
          setIsPlaying(prev => {
            const next = !prev;
            if (next) {
              audioRef_before.current?.play();
              audioRef_after.current?.play();
            } else {
              audioRef_before.current?.pause();
              audioRef_after.current?.pause();
            }
            return next;
          });
        }}>
          {isPlaying ? '暫停' : '播放'}
        </button>

        {/* 進度條 */}
        <input
          type="range"
          min={0}
          max={audioRef_before.current?.duration || 0}
          value={currentTime}
          step={0.1}
          onChange={(e) => {
            const t = parseFloat(e.target.value);
            setCurrentTime(t);
            audioRef_before.current!.currentTime = t;
            audioRef_after.current!.currentTime = t;
          }}
        />

        <div>
          <label>音量</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (activeTrack === 'before' && audioRef_before.current) {
                audioRef_before.current.volume = v;
              }
              if (activeTrack === 'after' && audioRef_after.current) {
                audioRef_after.current.volume = v;
              }
            }}
          />
        </div>
      </div>
        <audio ref={audioRef_before}  />
        <audio ref={audioRef_after}  />
    </div>
  );
}