// src/hooks/useMediaStream.ts
import { useEffect, useState } from 'react';

export const useMediaStream = (shouldRequest: boolean = true) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!shouldRequest) return;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((error) => {
        console.error('Failed to get user media:', error);
        setLocalStream(null);
      });

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
    };
  }, [shouldRequest]);

  return localStream;
};