import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Maximize, 
  X,
  User
} from "lucide-react";

interface StreamPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  autoPlay?: boolean;
  className?: string;
  isLocalStream?: boolean;
  onLeaveCall?: () => void;
}

export const StreamPlayer = ({
  stream,
  muted = false,
  autoPlay = true,
  className = "",
  isLocalStream = false,
  onLeaveCall,
}: StreamPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAudioOn, setIsAudioOn] = useState(!muted);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playError, setPlayError] = useState<string | null>(null);

  // Sync video stream and handle autoplay
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      if (isLocalStream) {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = isAudioOn;
        });
        stream.getVideoTracks().forEach((track) => {
          track.enabled = isVideoOn;
        });
      }

      // Attempt to auto-play if requested
      if (autoPlay) {
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
    }
  }, [stream, isAudioOn, isVideoOn, isLocalStream, autoPlay]);

  // Toggle audio (only for local stream)
  const toggleAudio = () => {
    if (isLocalStream && stream) {
      const newState = !isAudioOn;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = newState;
      });
      setIsAudioOn(newState);
    }
  };

  // Toggle video (only for local stream)
  const toggleVideo = () => {
    if (isLocalStream && stream) {
      const newState = !isVideoOn;
      stream.getVideoTracks().forEach((track) => {
        track.enabled = newState;
      });
      setIsVideoOn(newState);
    }
  };

  // Toggle full screen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement && videoRef.current) {
      videoRef.current.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error("Error attempting to exit fullscreen:", err);
      });
    }
  };

  // Handle manual play after autoplay failure
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
    <div
      className={`relative rounded-xl overflow-hidden shadow-2xl bg-black border border-zinc-800 transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        playsInline
        muted={isLocalStream ? true : muted}
      />

      {/* Play button overlay if needed */}
      {!isPlaying && playError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20">
          <Button
            onClick={handlePlayClick}
            className="rounded-full bg-white text-black hover:bg-white/90 border-white px-6 py-6 h-auto"
          >
            <Video size={24} strokeWidth={1.5} className="mr-2" />
            <span>Play Stream</span>
          </Button>
        </div>
      )}

      {/* Fullscreen Button (top-right, always visible) */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullScreen}
          className="rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 hover:border-white/20 p-2 h-auto w-auto"
          aria-label="Toggle full screen"
        >
          <Maximize size={16} strokeWidth={1.5} />
        </Button>
      </div>

      {/* Status Indicators for Remote Streams */}
      {!isLocalStream && (
        <div className="absolute top-4 right-14 flex gap-2">
          {stream?.getAudioTracks().some((track) => !track.enabled) && (
            <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-full p-2">
              <MicOff size={16} strokeWidth={1.5} />
            </div>
          )}
          {stream?.getVideoTracks().some((track) => !track.enabled) && (
            <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-full p-2">
              <VideoOff size={16} strokeWidth={1.5} />
            </div>
          )}
        </div>
      )}

      {/* Controls Overlay (only for local stream, excluding fullscreen) */}
      {isLocalStream && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent py-6 px-4 transition-opacity duration-300 z-10 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-center gap-6">
            {/* Audio Toggle Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleAudio}
              className={`rounded-full border ${
                !isAudioOn 
                  ? "bg-white text-black hover:bg-white/90 border-white" 
                  : "bg-black text-white border-white/20 hover:border-white hover:bg-black"
              }`}
              aria-label={isAudioOn ? "Mute audio" : "Unmute audio"}
            >
              {isAudioOn ? <Mic size={18} strokeWidth={1.5} /> : <MicOff size={18} strokeWidth={1.5} />}
            </Button>

            {/* Video Toggle Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleVideo}
              className={`rounded-full border ${
                !isVideoOn 
                  ? "bg-white text-black hover:bg-white/90 border-white" 
                  : "bg-black text-white border-white/20 hover:border-white hover:bg-black"
              }`}
              aria-label={isVideoOn ? "Turn off video" : "Turn on video"}
            >
              {isVideoOn ? <Video size={18} strokeWidth={1.5} /> : <VideoOff size={18} strokeWidth={1.5} />}
            </Button>

            {/* Leave Call Button */}
            {onLeaveCall && (
              <Button
                variant="outline"
                size="icon"
                onClick={onLeaveCall}
                className="rounded-full bg-white text-black hover:bg-white/90 border-white"
                aria-label="Leave call"
              >
                <X size={18} strokeWidth={2} />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Video Status Overlay when video is off (local stream) */}
      {isLocalStream && !isVideoOn && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-0">
          <div className="text-white text-center">
            <div className="bg-zinc-800 rounded-full p-8 mb-4 mx-auto w-28 h-28 flex items-center justify-center border border-zinc-700">
              <User size={36} strokeWidth={1.5} className="text-zinc-300" />
            </div>
            <p className="text-sm font-light tracking-wider text-zinc-300">CAMERA OFF</p>
          </div>
        </div>
      )}
    </div>
  );
};