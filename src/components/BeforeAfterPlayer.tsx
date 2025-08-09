// src/components/PlayList.tsx
import { useState, useEffect, useRef } from 'react';
import { beforeAftertracks } from '@/assets/mp3/beforeAfterTracks';
import type { BeforeAfterTrackInfo } from '@/types/BeforeAfterTrackInfo';
import { PauseIcon } from '@/assets/svgIcon/Pause';
import { PlayIcon } from '@/assets/svgIcon/Play';

import style from '@/css/components/BeforeAfterPlayer.module.css';

export default function BeforeAfterPlayer() {
  const [isReady, setIsReady] = useState(false);
  const [trackList] = useState(beforeAftertracks);
  const [currentTrack, setCurrentTrack] = useState<BeforeAfterTrackInfo>(trackList[0]);

  useEffect(() => {
    /* 若未來要 fetch 清單可寫在這邊 */
  }, []);

  return (
    <div className={style.container}>
      <div className={style.title}>
        <h2 className={style.h2}>Take a Listen</h2>
      </div>

      <div className={style.content}>
        <div className={style.playList}>
          {trackList.map((track: BeforeAfterTrackInfo, index: number) => (
            <div className={style.buttonContainer} key={index}>
              <button
                onClick={() => {
                  setIsReady(false);
                  setCurrentTrack(track);
                }}
              >
                {track.name}
              </button>
            </div>
          ))}
        </div>

        <div className={style.panel} aria-busy={!isReady}>
          {!isReady && (
            <div className={style.loadingOverlay}>
              <div className={style.loadingSpinner} aria-hidden />
              <span className={style.loadingText}>Loading…</span>
            </div>
          )}
          <AudioController
            key={currentTrack.name}
            {...currentTrack}
            onReady={() => {
              // 最少顯示 1 秒 loading
              setTimeout(() => setIsReady(true), 700);
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** 純 mp3 版本：不用 HLS / hls.js；用 Web Audio 控音 + A/B 交叉淡入淡出 */
function AudioController(trackInfo: BeforeAfterTrackInfo & { onReady?: () => void }) {
  type Track = 'before' | 'after';

  // <audio> refs（兩個都維持 volume=1，音量交給 WebAudio 控）
  const audioRef_before = useRef<HTMLAudioElement>(null);
  const audioRef_after = useRef<HTMLAudioElement>(null);

  // WebAudio：Context + 各自 Gain + Master Gain
  const audioCtxRef = useRef<AudioContext | null>(null);
  const srcBeforeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const srcAfterRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainBeforeRef = useRef<GainNode | null>(null);
  const gainAfterRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // UI state
  const [activeTrack, setActiveTrack] = useState<Track>('before');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.6); // Master Volume (0~1)
  const [duration, setDuration] = useState(0);

  /** 初始化/解鎖 WebAudio（於使用者互動時呼叫，如播放與調音） */
  const ensureAudioGraph = async () => {
    const elBefore = audioRef_before.current;
    const elAfter = audioRef_after.current;
    if (!elBefore || !elAfter) return;

    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      // 各自來源 + 各自 Gain
      srcBeforeRef.current = ctx.createMediaElementSource(elBefore);
      srcAfterRef.current = ctx.createMediaElementSource(elAfter);

      gainBeforeRef.current = ctx.createGain();
      gainAfterRef.current = ctx.createGain();

      // Master
      masterGainRef.current = ctx.createGain();
      masterGainRef.current.gain.value = volume;

      // 連線：before/after → 各自 gain → master → destination
      srcBeforeRef.current.connect(gainBeforeRef.current).connect(masterGainRef.current).connect(ctx.destination);
      srcAfterRef.current.connect(gainAfterRef.current).connect(masterGainRef.current).connect(ctx.destination);

      // 預設：before 聽得到、after 靜音
      gainBeforeRef.current.gain.value = 1;
      gainAfterRef.current.gain.value = 0;
    }

    // iOS 需要手勢觸發 resume
    if (audioCtxRef.current.state !== 'running') {
      try { await audioCtxRef.current.resume(); } catch {}
    }
  };

  /** 載入 mp3，這裡只處理本機相對路徑或你的公開 mp3 URL */
  const setupAudio = (audio: HTMLAudioElement, path?: string) => {
    if (!path) return;
    const url = `${import.meta.env.BASE_URL}${path}`;

    // reset
    audio.pause();
    audio.src = '';
    audio.removeAttribute('src');

    // 純 mp3，直接指定 src；volume 固定 1，避免與 WebAudio 重複縮放
    audio.volume = 1;
    audio.preload = 'metadata';
    audio.src = url;
    audio.load();
  };

  // 初始化/換歌：載入兩首 mp3 並在兩個音檔都能播放後 onReady
  useEffect(() => {
    const before = audioRef_before.current;
    const after = audioRef_after.current;
    if (!before || !after) return;

    setupAudio(before, trackInfo.before_path);
    setupAudio(after, trackInfo.after_path);

    let readyCount = 0;
    const tryReady = () => {
      readyCount++;
      if (readyCount >= 2) {
        // 取 before 的長度（假設兩首等長；不同也可改成取 max）
        const dur = isFinite(before.duration) ? before.duration : (isFinite(after.duration) ? after.duration : 0);
        setDuration(dur || 0);
        trackInfo.onReady?.();
      }
    };

    const onCanplayBefore = () => { before.removeEventListener('canplaythrough', onCanplayBefore); tryReady(); };
    const onCanplayAfter = () => { after.removeEventListener('canplaythrough', onCanplayAfter); tryReady(); };

    before.addEventListener('canplaythrough', onCanplayBefore);
    after.addEventListener('canplaythrough', onCanplayAfter);

    // 清理
    return () => {
      before.removeEventListener('canplaythrough', onCanplayBefore);
      after.removeEventListener('canplaythrough', onCanplayAfter);
      // 斷開 WebAudio（避免多次掛載累積 graph）
      try { srcBeforeRef.current?.disconnect(); } catch {}
      try { srcAfterRef.current?.disconnect(); } catch {}
      try { gainBeforeRef.current?.disconnect(); } catch {}
      try { gainAfterRef.current?.disconnect(); } catch {}
      try { masterGainRef.current?.disconnect(); } catch {}
      try { audioCtxRef.current?.close(); } catch {}
      audioCtxRef.current = null;
      srcBeforeRef.current = null;
      srcAfterRef.current = null;
      gainBeforeRef.current = null;
      gainAfterRef.current = null;
      masterGainRef.current = null;
      setCurrentTime(0);
      setIsPlaying(false);
      setActiveTrack('before');
    };
    // 只有換歌時才重建
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackInfo.name]);

  // 播放/暫停控制（兩首一起走，同步切 A/B 音量）
  useEffect(() => {
    const before = audioRef_before.current;
    const after = audioRef_after.current;
    if (!before || !after) return;

    if (isPlaying) {
      ensureAudioGraph().then(() => {
        before.play().catch(() => {});
        after.play().catch(() => {});
      });
    } else {
      before.pause();
      after.pause();
    }
  }, [isPlaying]);

  // 追時間（以 before 為基準）
  useEffect(() => {
    const id = setInterval(() => {
      const el = audioRef_before.current;
      if (el && isPlaying) setCurrentTime(el.currentTime);
    }, 200);
    return () => clearInterval(id);
  }, [isPlaying]);

  // A/B 切換：用 GainNode 做交叉淡入淡出
  useEffect(() => {
    const ctx = audioCtxRef.current;
    const gBefore = gainBeforeRef.current;
    const gAfter = gainAfterRef.current;
    if (!ctx || !gBefore || !gAfter) return;

    const now = ctx.currentTime;
    const dur = 0.15; // 150ms 小淡切

    gBefore.gain.cancelScheduledValues(now);
    gAfter.gain.cancelScheduledValues(now);

    if (activeTrack === 'before') {
      gBefore.gain.setValueAtTime(gBefore.gain.value, now);
      gBefore.gain.linearRampToValueAtTime(1, now + dur);
      gAfter.gain.setValueAtTime(gAfter.gain.value, now);
      gAfter.gain.linearRampToValueAtTime(0, now + dur);
    } else {
      gBefore.gain.setValueAtTime(gBefore.gain.value, now);
      gBefore.gain.linearRampToValueAtTime(0, now + dur);
      gAfter.gain.setValueAtTime(gAfter.gain.value, now);
      gAfter.gain.linearRampToValueAtTime(1, now + dur);
    }
  }, [activeTrack]);

  // Master Volume（0~1）
  useEffect(() => {
    const ctx = audioCtxRef.current;
    const mg = masterGainRef.current;
    if (!ctx || !mg) return;
    const now = ctx.currentTime;
    mg.gain.cancelScheduledValues(now);
    mg.gain.setValueAtTime(mg.gain.value, now);
    mg.gain.linearRampToValueAtTime(volume, now + 0.08);
  }, [volume]);

  // Seek：兩首一起跳（確保 AB 對齊）
  const onSeek = (t: number) => {
    const before = audioRef_before.current;
    const after = audioRef_after.current;
    if (!before || !after) return;
    before.currentTime = t;
    after.currentTime = t;
    setCurrentTime(t);
  };

  return (
    <div>
      <audio ref={audioRef_before} preload="metadata" />
      <audio ref={audioRef_after} preload="metadata" />
      <div className={style.controlBar}>
        <div
          className={style.iconCircle}
          onClick={() => setIsPlaying(p => !p)}
        >
          {isPlaying ? <PauseIcon size={28} /> : <PlayIcon size={28} />}
        </div>

        <div className={style.buttonGroup} role="group" aria-label="Track selector">
          <button
            type="button"
            aria-pressed={activeTrack === 'before'}
            onClick={() => setActiveTrack('before')}
          >
            Before
          </button>
          <button
            type="button"
            aria-pressed={activeTrack === 'after'}
            onClick={() => setActiveTrack('after')}
          >
            After
          </button>
        </div>

        <div className={style.volume}>
          <label>Time</label>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={Math.min(currentTime, duration || 0)}
            step={0.1}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
          />
        </div>

        <div className={style.volume}>
          <label>Volume</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              // 第一次調音量也算互動，可順便解鎖/建立 graph
              ensureAudioGraph();
            }}
          />
        </div>
      </div>
    </div>
  );
}