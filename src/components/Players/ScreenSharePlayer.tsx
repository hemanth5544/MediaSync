import { useEffect, useRef, useState } from 'react';
import { Button } from "../ui/button";
import { Maximize, Monitor } from "lucide-react";

interface ScreenSharePlayerProps {
  stream: MediaStream;
  className?: string;
}

export const ScreenSharePlayer = ({ stream, className = "" }: ScreenSharePlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Toggle full screen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement && videoRef.current) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div 
      className={`relative rounded-xl overflow-hidden shadow-2xl bg-zinc-900 border border-zinc-800 transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-contain" 
      />
      
      {/* Screen Share Label */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
        <Monitor size={16} strokeWidth={1.5} />
        <span className="font-medium tracking-wide">Screen Share</span>
      </div>
      
      {/* Fullscreen control button */}
      <div
        className={`absolute top-4 right-4 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullScreen}
          className="rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 hover:border-white/20 p-2 h-auto w-auto"
          aria-label="Toggle full screen"
        >
          <Maximize size={16} strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  );
};