import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, RTCPeerConnectionsMap } from '../types';
const apiUrl = import.meta.env.VITE_APP_URL; 


const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export const useWebRTCStream = (streamId: string, isStreamer: boolean) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peerConnections, setPeerConnections] = useState<RTCPeerConnectionsMap>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [viewerCount, setViewerCount] = useState(0);

  // Initial connection setup
  useEffect(() => {
    const newSocket = io(`${apiUrl}`, {
      transports: ['websocket'],
      upgrade: false
    });
    setSocket(newSocket);

    if (isStreamer) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          newSocket.emit("join-stream", streamId);
        })
        .catch(console.error);
    } else {
      newSocket.emit("join-stream", streamId);
    }

    return () => {
      newSocket.close();
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [streamId, isStreamer]);

  // WebRTC signaling and stream handling
  useEffect(() => {
    if (!socket || (!stream )) return;

    socket.on("new-socket", (socketId: string) => {
      if (isStreamer) {
        const pc = new RTCPeerConnection(configuration);
        
        stream!.getTracks().forEach(track => {
          pc.addTrack(track, stream!);
        });

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("icecandidate", {
              to: socketId,
              candidate: event.candidate
            });
          }
        };

        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .then(() => {
            socket.emit("offer", {
              to: socketId,
              offer: pc.localDescription
            });
          });

        setPeerConnections(prev => ({
          ...prev,
          [socketId]: pc
        }));
      }
    });

    socket.on("recive-offer", async (data: { from: string; offer: RTCSessionDescription }) => {
      if (!isStreamer) {
        const pc = new RTCPeerConnection(configuration);

        pc.ontrack = (event) => {
          setStream(event.streams[0]);
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("icecandidate", {
              to: data.from,
              candidate: event.candidate
            });
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", {
          to: data.from,
          answer: pc.localDescription
        });

        setPeerConnections(prev => ({
          ...prev,
          [data.from]: pc
        }));
      }
    });

    socket.on("recive-answer", async (data: { from: string; answer: RTCSessionDescription }) => {
      const pc = peerConnections[data.from];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    });

    socket.on("recive-icecandidate", async (data: { from: string; candidate: RTCIceCandidate }) => {
      const pc = peerConnections[data.from];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });

    socket.on("viewers-count", (count: number) => {
      setViewerCount(count);
    });

    socket.on("brodcast-message", (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off("new-socket");
      socket.off("recive-offer");
      socket.off("recive-answer");
      socket.off("recive-icecandidate");
      socket.off("viewers-count");
      socket.off("brodcast-message");
    };
  }, [socket, stream, isStreamer, streamId, peerConnections]);

  return { stream, socket, messages, viewerCount };
};