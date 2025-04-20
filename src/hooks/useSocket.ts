// src/hooks/useSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const apiUrl = import.meta.env.VITE_APP_URL;

export const useSocket = (id: string, event: 'join-call' | 'join-stream') => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`${apiUrl}`, {
      transports: ['websocket'],
      upgrade: false,
    });
    setSocket(newSocket);

    newSocket.emit(event, id);

    return () => {
      newSocket.close();
    };
  }, [id, event]);

  return socket;
};