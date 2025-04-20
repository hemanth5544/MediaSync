import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  autoPlay?: boolean;
  className?: string;
}

export const VideoPlayer = ({
  stream,
  muted = false,
  autoPlay = true,
  className = "",
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isAudioOn, setIsAudioOn] = useState(!muted);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Sync video stream and toggle audio/video tracks
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      // Toggle audio tracks
      stream.getAudioTracks().forEach((track) => {
        track.enabled = isAudioOn;
      });

      // Toggle video tracks
      stream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOn;
      });
    }
  }, [stream, isAudioOn, isVideoOn]);

  // Toggle audio
  const toggleAudio = () => setIsAudioOn((prev) => !prev);

  // Toggle video
  const toggleVideo = () => setIsVideoOn((prev) => !prev);

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
      className={`relative w-full max-w-[600px] rounded-lg overflow-hidden shadow-lg ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-auto object-cover bg-black"
        autoPlay={autoPlay}
        playsInline
        muted={!isAudioOn}
        style={{ maxHeight: "400px" }} // Increased max height for better visibility
      />

      {/* Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md p-3 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          {/* Audio Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAudio}
            className={`rounded-full text-white hover:bg-gray-700 hover:text-blue-400 transition-colors ${
              !isAudioOn ? "bg-red-600 hover:bg-red-700" : ""
            }`}
            aria-label={isAudioOn ? "Mute audio" : "Unmute audio"}
          >
            {isAudioOn ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 5.586L3 3m15 15l-2.586-2.586M12 18a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-8-10a3 3 0 013-3V5a3 3 0 013 3v3m-6 0a3 3 0 013 3"
                />
              </svg>
            )}
          </Button>

          {/* Video Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVideo}
            className={`rounded-full text-white hover:bg-gray-700 hover:text-blue-400 transition-colors ${
              !isVideoOn ? "bg-red-600 hover:bg-red-700" : ""
            }`}
            aria-label={isVideoOn ? "Turn off video" : "Turn on video"}
          >
            {isVideoOn ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3l18 18M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </Button>

          {/* Full Screen Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullScreen}
            className="rounded-full text-white hover:bg-gray-700 hover:text-blue-400 transition-colors"
            aria-label="Toggle full screen"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};
