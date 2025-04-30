import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface VideoPlayerProps {
  stream: MediaStream | null;
  muted?: boolean;
  autoPlay?: boolean;
  className?: string;
  isLocal?: boolean;
  participantName?: string;
  onLeaveCall?: () => void; // New prop for leave call
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
  console.log(participantName, "partiiiicipantName");

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
      className={`relative rounded-lg overflow-hidden shadow-lg bg-black transition-all duration-300 ${className}`}
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

      {/* Participant Label */}
      <div className="absolute bottom-2 left-2 bg-[rgba(0,0,0,0.7)] text-white px-2 py-1 rounded-md text-sm backdrop-blur-sm">
        {participantName}
      </div>

      {/* Status Indicators for Remote Streams */}
      {!isLocal && (
        <div className="absolute top-2 right-2 flex gap-2">
          {stream?.getAudioTracks().some((track) => !track.enabled) && (
            <div className="bg-red-600 text-white rounded-full p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 5.586L3 3m15 15l-2.586-2.586M12 18a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-8-10a3 3 0 013-3V5a3 3 0 013 3v3m-6 0a3 3 0 013 3"
                />
              </svg>
            </div>
          )}
          {stream?.getVideoTracks().some((track) => !track.enabled) && (
            <div className="bg-red-600 text-white rounded-full p-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3l18 18M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Controls Overlay (only for local stream) */}
      {isLocal && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.8)] p-3 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            {/* Audio Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAudio}
              className={`rounded-full text-white hover:bg-gray-600 hover:text-blue-400 transition-colors ${
                !isAudioOn ? "bg-red-600 hover:bg-red-700" : ""
              }`}
              aria-label={isAudioOn ? "Mute audio" : "Unmute audio"}
            >
              {isAudioOn ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className={`rounded-full text-white hover:bg-gray-600 hover:text-blue-400 transition-colors ${
                !isVideoOn ? "bg-red-600 hover:bg-red-700" : ""
              }`}
              aria-label={isVideoOn ? "Turn off video" : "Turn on video"}
            >
              {isVideoOn ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="rounded-full text-white hover:bg-gray-600 hover:text-blue-400 transition-colors"
              aria-label="Toggle full screen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5"
                />
              </svg>
            </Button>

            {/* Leave Call Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onLeaveCall}
              className="rounded-full text-white hover:bg-gray-600 hover:text-red-400 transition-colors"
              aria-label="Leave call"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};