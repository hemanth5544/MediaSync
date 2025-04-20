// src/hooks/useWebRTCPeerConnections.ts
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { RTCPeerConnectionsMap } from '../types';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTCPeerConnections = (
  socket: Socket | null,
  localStream: MediaStream | null,
  screenShareStream: MediaStream | null,
  isStreamer: boolean = false,
  onParticipantJoined?: (socketId: string) => void,
  onStreamReceived?: (stream: MediaStream) => void
) => {
  const [remoteStreams, setRemoteStreams] = useState<{ [key: string]: MediaStream }>({});
  const [remoteScreenStreams, setRemoteScreenStreams] = useState<{ [key: string]: MediaStream }>({});
  const [peerConnections, setPeerConnections] = useState<RTCPeerConnectionsMap>({});

  useEffect(() => {
    if (!socket) return;

    const handleNewSocket = (socketId: string) => {
      if (!isStreamer) return; // Streamers initiate connections

      const pc = new RTCPeerConnection(configuration);

      if (localStream) {
        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });
      }

      if (screenShareStream) {
        screenShareStream.getTracks().forEach((track) => {
          pc.addTrack(track, screenShareStream);
        });
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('icecandidate', {
            to: socketId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        const stream = event.streams[0];
        if (stream && event.track.kind === 'video' && stream.getVideoTracks().length > 0) {
          const isScreenShare = stream.getVideoTracks()[0].label.toLowerCase().includes('screen');
          if (isScreenShare) {
            setRemoteScreenStreams((prev) => ({
              ...prev,
              [socketId]: stream,
            }));
          } else {
            setRemoteStreams((prev) => ({
              ...prev,
              [socketId]: stream,
            }));
          }
          onStreamReceived?.(stream);
        }
        onParticipantJoined?.(socketId);
      };

      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          socket.emit('offer', {
            to: socketId,
            offer: pc.localDescription,
          });
        })
        .catch((error) => console.error('Error creating offer:', error));

      setPeerConnections((prev) => ({
        ...prev,
        [socketId]: pc,
      }));
    };

    const handleReceiveOffer = async (data: { from: string; offer: RTCSessionDescription }) => {
      if (isStreamer) return; // Viewers respond to offers

      const pc = new RTCPeerConnection(configuration);

      pc.ontrack = (event) => {
        const stream = event.streams[0];
        if (stream && event.track.kind === 'video' && stream.getVideoTracks().length > 0) {
          const isScreenShare = stream.getVideoTracks()[0].label.toLowerCase().includes('screen');
          if (isScreenShare) {
            setRemoteScreenStreams((prev) => ({
              ...prev,
              [data.from]: stream,
            }));
          } else {
            setRemoteStreams((prev) => ({
              ...prev,
              [data.from]: stream,
            }));
          }
          onStreamReceived?.(stream);
        }
        onParticipantJoined?.(data.from);
      };

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('icecandidate', {
            to: data.from,
            candidate: event.candidate,
          });
        }
      };

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('answer', {
          to: data.from,
          answer: pc.localDescription,
        });

        setPeerConnections((prev) => ({
          ...prev,
          [data.from]: pc,
        }));
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    };

    socket.on('new-socket', handleNewSocket);
    socket.on('recive-offer', handleReceiveOffer);

    socket.on('recive-answer', async (data: { from: string; answer: RTCSessionDescription }) => {
      const pc = peerConnections[data.from];
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (error) {
          console.error('Error setting remote description:', error);
        }
      }
    });

    socket.on('recive-icecandidate', async (data: { from: string; candidate: RTCIceCandidate }) => {
      const pc = peerConnections[data.from];
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    socket.on('stop-screen-share', (socketId: string) => {
      setRemoteScreenStreams((prev) => {
        const newStreams = { ...prev };
        delete newStreams[socketId];
        return newStreams;
      });
    });

    return () => {
      socket.off('new-socket', handleNewSocket);
      socket.off('recive-offer', handleReceiveOffer);
      socket.off('recive-answer');
      socket.off('recive-icecandidate');
      socket.off('stop-screen-share');
    };
  }, [socket, localStream, screenShareStream, isStreamer, peerConnections, onParticipantJoined, onStreamReceived]);

  return { remoteStreams, remoteScreenStreams, peerConnections };
};