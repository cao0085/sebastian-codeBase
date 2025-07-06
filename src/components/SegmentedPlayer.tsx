import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface Props {
  src: string;               // .m3u8 路徑
}

export default function SegmentedPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // ❶ Safari（包含 iOS）原生支援 HLS
    if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = src;
      return;
    }

    // ❷ 其他瀏覽器用 Hls.js + Media Source Extensions
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      console.log(src)
      hls.loadSource(src);
      hls.attachMedia(audio);
      return () => hls.destroy();
    }

    console.error('HLS is not supported in this browser');
  }, [src]);

  return <audio ref={audioRef} controls style={{ width: '100%' }} />;
}