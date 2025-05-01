import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, RTCPeerConnectionsMap } from '../types';

const apiUrl = import.meta.env.VITE_APP_URL;
console.log('API URL:', apiUrl); // Add this to verify
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTCCall = (
  callId: string,
  onParticipantJoined?: (socketId: string) => void,
  username?: string
) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{ [key: string]: MediaStream }>({});
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [remoteScreenStreams, setRemoteScreenStreams] = useState<{ [key: string]: MediaStream }>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peerConnections, setPeerConnections] = useState<RTCPeerConnectionsMap>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [participants, setParticipants] = useState<{ [socketId: string]: string }>({}); // Store socketId -> username

  // Initialize socket
  useEffect(() => {
    const newSocket = io(`${apiUrl}`, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
      localStream?.getTracks().forEach((track) => track.stop());
      screenShareStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Get user media and join call only when username is provided
  useEffect(() => {
    if (!username || !socket) return;

    socket.emit('set-username', username);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        socket.emit('join-call', callId);
      })
      .catch((error) => {
        console.error('Failed to get user media:', error);
        setLocalStream(null);
        socket.emit('join-call', callId);
      });
  }, [username, socket, callId]);

  // Start screen sharing
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

  // Stop screen sharing
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

  // Leave call
  const leaveCall = () => {
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    // Stop screen share stream
    if (screenShareStream) {
      screenShareStream.getTracks().forEach((track) => track.stop());
      setScreenShareStream(null);
      socket?.emit('stop-screen-share', callId);
    }

    // Close all peer connections
    Object.values(peerConnections).forEach((pc) => {
      pc.close();
    });
    setPeerConnections({});
    setRemoteStreams({});
    setRemoteScreenStreams({});
    setParticipants({});
    setMessages([]);

    // Disconnect socket
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  // WebRTC signaling and participant handling
  useEffect(() => {
    if (!socket) return;

    socket.on('new-socket', (socketId: string, username: string) => {
      setParticipants((prev) => ({ ...prev, [socketId]: username }));
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
        if (event.track.kind === 'video' && stream.getVideoTracks().length > 0) {
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
        }
        if (onParticipantJoined) {
          onParticipantJoined(socketId);
        }
      };

      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          socket.emit('offer', {
            to: socketId,
            offer: pc.localDescription,
          });
        });

      setPeerConnections((prev) => ({
        ...prev,
        [socketId]: pc,
      }));
    });

    socket.on('participants', (participants: [string, string][]) => {
      setParticipants(Object.fromEntries(participants));
    });

    socket.on('participant-left', (socketId: string) => {
      setParticipants((prev) => {
        const newParticipants = { ...prev };
        delete newParticipants[socketId];
        return newParticipants;
      });
      setRemoteStreams((prev) => {
        const newStreams = { ...prev };
        delete newStreams[socketId];
        return newStreams;
      });
      setRemoteScreenStreams((prev) => {
        const newStreams = { ...prev };
        delete newStreams[socketId];
        return newStreams;
      });
      setPeerConnections((prev) => {
        const newConnections = { ...prev };
        if (newConnections[socketId]) {
          newConnections[socketId].close();
          delete newConnections[socketId];
        }
        return newConnections;
      });
    });

    socket.on('recive-offer', async (data: { from: string; offer: RTCSessionDescription }) => {
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
            to: data.from,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        const stream = event.streams[0];
        if (event.track.kind === 'video' && stream.getVideoTracks().length > 0) {
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
        }
        if (onParticipantJoined) {
          onParticipantJoined(data.from);
        }
      };

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
    });

    socket.on('recive-answer', async (data: { from: string; answer: RTCSessionDescription }) => {
      const pc = peerConnections[data.from];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    socket.on('recive-icecandidate', async (data: { from: string; candidate: RTCIceCandidate }) => {
      const pc = peerConnections[data.from];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    socket.on('receive-personal-message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('start-screen-share', (socketId: string) => {
      // Handled via ontrack
    });

    socket.on('stop-screen-share', (socketId: string) => {
      setRemoteScreenStreams((prev) => {
        const newStreams = { ...prev };
        delete newStreams[socketId];
        return newStreams;
      });
    });

    return () => {
      socket.off('new-socket');
      socket.off('participants');
      socket.off('participant-left');
      socket.off('recive-offer');
      socket.off('recive-answer');
      socket.off('recive-icecandidate');
      socket.off('receive-personal-message');
      socket.off('start-screen-share');
      socket.off('stop-screen-share');
    };
  }, [socket, localStream, screenShareStream, peerConnections, onParticipantJoined]);

  return {
    localStream,
    remoteStreams,
    screenShareStream,
    remoteScreenStreams,
    socket,
    messages,
    startScreenShare,
    stopScreenShare,
    leaveCall,
    participants,
  };
};