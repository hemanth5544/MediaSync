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

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  autoPlay?: boolean;
  className?: string;
  isLocal?: boolean;
  participantName?: string;
  onLeaveCall?: () => void;
}

export const VideoPlayer = ({
  stream,
  muted = false,
  autoPlay = true,
  className = "",
  isLocal = false,
  participantName = "Participant",
  onLeaveCall,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAudioOn, setIsAudioOn] = useState(!muted);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Sync video stream
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      if (isLocal) {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = isAudioOn;
        });
        stream.getVideoTracks().forEach((track) => {
          track.enabled = isVideoOn;
        });
      }
    }
  }, [stream, isAudioOn, isVideoOn, isLocal]);

  // Toggle audio (only for local stream)
  const toggleAudio = () => {
    if (isLocal) setIsAudioOn((prev) => !prev);
  };

  // Toggle video (only for local stream)
  const toggleVideo = () => {
    if (isLocal) setIsVideoOn((prev) => !prev);
  };

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
        muted={isLocal ? muted : true}
      />

      {/* Participant Label with status indicator */}
      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        <span className="font-medium tracking-wide">{participantName}</span>
      </div>

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
      {!isLocal && (
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
      {isLocal && (
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
            <Button
              variant="outline"
              size="icon"
              onClick={onLeaveCall}
              className="rounded-full bg-white text-black hover:bg-white/90 border-white"
              aria-label="Leave call"
            >
              <X size={18} strokeWidth={2} />
            </Button>
          </div>
        </div>
      )}

      {/* Video Status Overlay when video is off (local stream) */}
      {isLocal && !isVideoOn && (
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