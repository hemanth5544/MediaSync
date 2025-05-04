import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  message: string;
  from: string;
}

interface RTCPeerConnectionsMap {
  [socketId: string]: RTCPeerConnection;
}

const apiUrl = import.meta.env.VITE_APP_URL;

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export const useWebRTCStream = (streamId: string, isStreamer: boolean) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<RTCPeerConnectionsMap>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [viewerCount, setViewerCount] = useState(0);

  // Initialize socket and local stream
  useEffect(() => {
    const newSocket = io(`${apiUrl}`, {
      transports: ['websocket'],
      upgrade: false,
    });
    setSocket(newSocket);

    if (isStreamer) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          setLocalStream(mediaStream);
          newSocket.emit('join-stream', streamId);
        })
        .catch((err) => console.error('Streamer: getUserMedia error:', err));
    } else {
      newSocket.emit('join-stream', streamId);
    }

    return () => {
      newSocket.close();
      localStream?.getTracks().forEach((track) => track.stop());
      Object.values(peerConnections).forEach((pc) => pc.close());
    };
  }, [streamId, isStreamer]);

  // Handle WebRTC and chat events
  useEffect(() => {
    if (!socket) return;

    // Ensure localStream is ready for streamer before handling WebRTC
    if (isStreamer && !localStream) {
      return;
    }

    // Handle new viewer joining
    socket.on('new-socket', (socketId: string) => {
      if (isStreamer && localStream) {
        const pc = new RTCPeerConnection(configuration);

        localStream.getTracks().forEach((track) => {
          pc.addTrack(track, localStream);
        });

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('icecandidate', {
              to: socketId,
              candidate: event.candidate,
            });
          }
        };

        pc.onconnectionstatechange = () => {
        };

        pc.createOffer()
          .then((offer) => {
            return pc.setLocalDescription(offer);
          })
          .then(() => {
            socket.emit('offer', {
              to: socketId,
              offer: pc.localDescription,
            });
          })
          .catch((err) => console.error('Streamer: Offer creation error:', err));

        setPeerConnections((prev) => ({
          ...prev,
          [socketId]: pc,
        }));
      }
    });

    // Handle offer from streamer
    socket.on('recive-offer', async (data: { from: string; offer: RTCSessionDescription }) => {
      if (!isStreamer) {
        const pc = new RTCPeerConnection(configuration);

        pc.ontrack = (event) => {
          const stream = event.streams[0];
          if (stream) {
            setRemoteStream(stream);
          }
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit('icecandidate', {
              to: data.from,
              candidate: event.candidate,
            });
          }
        };

        pc.onconnectionstatechange = () => {
        };

        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit('answer', {
            to: data.from,
            answer: pc.localDescription,
          });
        } catch (err) {
          console.error('Viewer: Error handling offer:', err);
        }

        setPeerConnections((prev) => ({
          ...prev,
          [data.from]: pc,
        }));
      }
    });

    // Handle answer from viewer
    socket.on('recive-answer', async (data: { from: string; answer: RTCSessionDescription }) => {
      const pc = peerConnections[data.from];
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        } catch (err) {
          console.error('Streamer: Error setting answer:', err);
        }
      }
    });

    // Handle ICE candidate
    socket.on('recive-icecandidate', async (data: { from: string; candidate: RTCIceCandidate }) => {
      const pc = peerConnections[data.from];
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    });

    // Handle viewer count
    socket.on('viewers-count', (count: number) => {
      setViewerCount(count);
    });

    // Handle chat messages
    socket.on('brodcast-message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      console.log('Cleanup: Removing socket event listeners');
      socket.off('new-socket');
      socket.off('recive-offer');
      socket.off('recive-answer');
      socket.off('recive-icecandidate');
      socket.off('viewers-count');
      socket.off('brodcast-message');
    };
  }, [socket, localStream, isStreamer, peerConnections, streamId]);

  return { socket, localStream, remoteStream, messages, viewerCount };
};