import { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  autoPlay?: boolean;
  className?: string;
}

export const StreamPlayer = ({ stream, muted = false, autoPlay = true, className = '' }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      className={`w-full h-full object-cover ${className}`}
      autoPlay={autoPlay}
      playsInline
      muted={muted}
      controls={!muted}
    />
  );
};