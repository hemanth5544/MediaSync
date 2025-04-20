// src/hooks/useChat.ts
import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { ChatMessage } from '../types';

export const useChat = (socket: Socket | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive-personal-message', (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive-personal-message');
    };
  }, [socket]);

  const sendMessage = (message: string, to: string) => {
    if (socket) {
      socket.emit('personal-chat', { to, message });
    }
  };

  return { messages, sendMessage };
};