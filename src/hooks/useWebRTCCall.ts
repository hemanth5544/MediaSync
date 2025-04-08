import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {ChatMessage, RTCPeerConnectionsMap } from '../types';
const apiUrl = import.meta.env.VITE_APP_URL; 
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export const useWebRTCCall = (
  callId: string,
  onParticipantJoined?: (socketId: string) => void
) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<{ [key: string]: MediaStream }>({});
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peerConnections, setPeerConnections] = useState<RTCPeerConnectionsMap>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Initial setup effect
  useEffect(() => {
    const newSocket = io(`${apiUrl}`, {
      transports: ['websocket'],
      upgrade: false
    });
    setSocket(newSocket);

    //getting media devices wiht navigator and seting hte media in the local stream state and join hte call/stream
    //setting the stream as state to send data in client
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        newSocket.emit("join-call", callId);
      })
      .catch(console.error);

    return () => {
      newSocket.close();
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // WebRTC signaling effect
  useEffect(() => {
    if (!socket || !localStream) return;

    //notify every others socket about the new socket joing the call
    socket.on("new-socket", (socketId: string) => {
      const pc = new RTCPeerConnection(configuration);
      
      // Add local tracks to connection
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("icecandidate", {
            to: socketId,
            candidate: event.candidate
          });
        }
      };

      // Handle incoming streams
      pc.ontrack = (event) => {
        setRemoteStreams(prev => ({
          ...prev,
          [socketId]: event.streams[0]
        }));
        // Trigger notification when a new participant fully connects with a stream
        if (onParticipantJoined) {
          onParticipantJoined(socketId);
        }
      };

      // Create and send offer
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
    });

    //once receive the offer set the dicseption to maintiant hte network cahnnel peer over signaling server obvly return a promise
    socket.on("recive-offer", async (data: { from: string; offer: RTCSessionDescription }) => {
      const pc = new RTCPeerConnection(configuration);
      
      localStream.getTracks().forEach(track => {
        pc.addTrack(track, localStream);
      });

      //shedules the new call  joins (new-join ) emitts
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("icecandidate", {
            to: data.from,
            candidate: event.candidate
          });
        }
      };

      pc.ontrack = (event) => {
        setRemoteStreams(prev => ({
          ...prev,
          [data.from]: event.streams[0]
        }));
        if (onParticipantJoined) {
          onParticipantJoined(data.from);
        }
      };

      await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await pc.createAnswer(); //same accept the connec retun prmise
      await pc.setLocalDescription(answer);

      socket.emit("answer", {
        to: data.from,
        answer: pc.localDescription
      });

      setPeerConnections(prev => ({
        ...prev,
        [data.from]: pc
      }));
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
    socket.on("receive-personal-message", (message: ChatMessage) => {
      console.log(message, "received message from socket");
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off("new-socket");
      socket.off("recive-offer");
      socket.off("recive-answer");
      socket.off("recive-icecandidate");
      socket.off("receive-personal-message");

    };
  }, [socket, localStream, peerConnections, onParticipantJoined]);

  return { localStream, remoteStreams, socket, messages };
};