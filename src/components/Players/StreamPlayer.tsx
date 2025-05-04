import { useEffect, useRef, useState } from 'react';

interface StreamPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  className?: string;
}

export const StreamPlayer = ({ stream, muted = false, className }: StreamPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playError, setPlayError] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      console.log('StreamPlayer: Setting stream', stream);
      videoRef.current.srcObject = stream;

      // Attempt to auto-play
      videoRef.current
        .play()
        .then(() => {
          console.log('StreamPlayer: Video playing successfully');
          setIsPlaying(true);
          setPlayError(null);
        })
        .catch((err) => {
          console.error('StreamPlayer: Video play error:', err);
          setPlayError(err.message);
          setIsPlaying(false);
        });
    }
  }, [stream]);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          console.log('StreamPlayer: Video started via user interaction');
          setIsPlaying(true);
          setPlayError(null);
        })
        .catch((err) => {
          console.error('StreamPlayer: Manual play error:', err);
          setPlayError(err.message);
        });
    }
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={className}
      />
      {!isPlaying && playError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <button
            onClick={handlePlayClick}
            className="px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200"
          >
            Play Stream
          </button>
        </div>
      )}
    </div>
  );
};