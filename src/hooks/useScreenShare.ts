// src/hooks/useScreenShare.ts
import { useState } from 'react';
import { Socket } from 'socket.io-client';
import { RTCPeerConnectionsMap } from '../types';

export const useScreenShare = (
  socket: Socket | null,
  callId: string,
  peerConnections: RTCPeerConnectionsMap,
  localStream: MediaStream | null
) => {
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setScreenShareStream(stream);

      socket?.emit('start-screen-share', callId);

      Object.entries(peerConnections).forEach(([socketId, pc]) => {
        stream.getTracks().forEach((track) => {
          const sender = pc.getSenders().find((s) => s.track?.kind === track.kind);
          if (sender) {
            sender.replaceTrack(track);
          } else {
            pc.addTrack(track, stream);
          }
        });
      });

      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const stopScreenShare = () => {
    if (screenShareStream) {
      screenShareStream.getTracks().forEach((track) => track.stop());
      setScreenShareStream(null);
      socket?.emit('stop-screen-share', callId);

      if (localStream) {
        Object.entries(peerConnections).forEach(([socketId, pc]) => {
          localStream.getTracks().forEach((track) => {
            const sender = pc.getSenders().find((s) => s.track?.kind === track.kind);
            if (sender) {
              sender.replaceTrack(track);
            } else {
              pc.addTrack(track, localStream);
            }
          });
        });
      }

      Object.entries(peerConnections).forEach(([socketId, pc]) => {
        pc.createOffer()
          .then((offer) => pc.setLocalDescription(offer))
          .then(() => {
            socket?.emit('offer', {
              to: socketId,
              offer: pc.localDescription,
            });
          });
      });
    }
  };

  return { screenShareStream, startScreenShare, stopScreenShare };
};