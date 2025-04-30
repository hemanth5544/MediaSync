// src/hooks/useStreamChat.ts
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage } from '../types';

export const useStreamChat = (socket: Socket | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    socket.on('brodcast-message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('viewers-count', (count: number) => {
      setViewerCount(count);
    });

    return () => {
      socket.off('brodcast-message');
      socket.off('viewers-count');
    };
  }, [socket]);

  const sendMessage = (message: string, to: string) => {
    if (socket) {
      socket.emit('chat-message', { to, message });
    }
  };

  return { messages, viewerCount, sendMessage };
};