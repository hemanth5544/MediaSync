import React, { useEffect, useRef } from 'react';

interface ScreenSharePlayerProps {
  stream: MediaStream;
  className?: string;
}

export const ScreenSharePlayer: React.FC<ScreenSharePlayerProps> = ({ stream, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className={`relative bg-[#252525] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.1)] shadow-lg ${className}`}>
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
      <div className="absolute bottom-2 left-2 bg-[rgba(33,33,33,0.95)] text-[rgba(255,255,255,0.9)] px-2 py-1 rounded-md text-sm backdrop-blur-md">
        Screen Share
      </div>
    </div>
  );
};